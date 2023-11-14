import { User, UserManager, WebStorageStateStore } from "oidc-client";
import { ApplicationPaths, ApplicationName } from "./consts";
import { AuthenticationResultStatus, FailedOperation, RedirectOperation, SuccessfulOperation } from "./models";

export class AuthorizeService {
  private userManager?: UserManager;
  private _callbacks: Map<number, Function> = new Map();
  private _nextSubscriptionId: number = 0;
  private _user?: User;
  private configurationUrl?: string;

  constructor() {
    this.configurationUrl = ApplicationPaths.ApiAuthorizationClientConfigurationUrl;
  }

  // By default pop ups are disabled because they don't work properly on Edge.
  // If you want to enable pop up authentication simply set this flag to false.
  _popUpDisabled = true;

  async isAuthenticated() {
    const userProfile = await this.getUserProfile();
    return !!userProfile;
  }

  async getUserProfile() {
    if (this._user && this._user.profile) {
      return this._user.profile;
    }

    await this.ensureUserManagerInitialized();
    const user = await this.userManager?.getUser();
    return user && user.profile;
  }

  async getAccessToken() {
    await this.ensureUserManagerInitialized();
    const user = await this.userManager?.getUser();
    return user && user.access_token;
  }

  // We try to authenticate the user in three different ways:
  // 1) We try to see if we can authenticate the user silently. This happens
  //    when the user is already logged in on the IdP and is done using a hidden iframe
  //    on the client.
  // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
  //    redirect flow.
  async signIn(state: any): Promise<RedirectOperation | SuccessfulOperation | FailedOperation> {
    await this.ensureUserManagerInitialized();
    try {
      const silentUser = await this.userManager?.signinSilent(this.createArguments());
      this.updateState(silentUser);
      return this.success(state);
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log("Silent authentication error: ", silentError);

      try {
        if (this._popUpDisabled) {
          throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
        }

        const popUpUser = await this.userManager?.signinPopup(this.createArguments());
        this.updateState(popUpUser);
        return this.success(state);
      } catch (popUpError: any) {
        if (popUpError.message === "Popup window closed") {
          // The user explicitly cancelled the login action by closing an opened popup.
          return this.error("The user closed the window.");
        } else if (!this._popUpDisabled) {
          console.log("Popup authentication error: ", popUpError);
        }

        // PopUps might be blocked by the user, fallback to redirect
        try {
          await this.userManager?.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError: any) {
          console.log("Redirect authentication error: ", redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

  async completeSignIn(url: any): Promise<RedirectOperation | SuccessfulOperation | FailedOperation> {
    try {
      await this.ensureUserManagerInitialized();
      const user = await this.userManager?.signinCallback(url);
      this.updateState(user);
      return this.success(user && user.state);
    } catch (error) {
      console.log('There was an error signing in: ', error);
      return this.error('There was an error signing in.');
    }
  }

  // We try to sign out the user in two different ways:
  // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
  //    Pop-Up blocker or the user has disabled PopUps.
  // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
  //    post logout redirect flow.
  async signOut(state: any): Promise<RedirectOperation | SuccessfulOperation | FailedOperation> {
    await this.ensureUserManagerInitialized();
    try {
      if (this._popUpDisabled) {
        throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
      }

      await this.userManager?.signoutPopup(this.createArguments());
      this.updateState(undefined);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log("Popup signout error: ", popupSignOutError);
      try {
        await this.userManager?.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError: any) {
        console.log("Redirect signout error: ", redirectSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  async completeSignOut(url: string) {
    await this.ensureUserManagerInitialized();
    try {
      const response = await this.userManager?.signoutCallback(url);
      this.updateState(null);
      return this.success(response && response.state);
    } catch (error: any) {
      console.log(`there was an error trying to log out '${error}'`);
      return this.error(error);
    }
  }

  updateState(user: any) {
    this._user = user;
    this.notifySubscribers();
  }

  subscribe(callback: Function) {
    const subscriptionId = this._nextSubscriptionId++;
    this._callbacks.set(subscriptionId, callback);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: number) {
    if (!this._callbacks.delete(subscriptionId)) {
      throw new Error(`subscription with ID ${subscriptionId} was not found`);
    }
  }

  notifySubscribers() {
    for (const callback of this._callbacks.values()) {
      callback();
    }
  }

  createArguments(state?: any) {
    return { useReplaceToNavigate: true, data: state };
  }

  error(message: string): FailedOperation {
    return { status: AuthenticationResultStatus.Fail, message };
  }

  success(state: any): SuccessfulOperation {
    return { status: AuthenticationResultStatus.Success, state };
  }

  redirect(): RedirectOperation {
    return { status: AuthenticationResultStatus.Redirect };
  }

  async ensureUserManagerInitialized() {
    if (this.userManager !== undefined || this.configurationUrl === undefined) {
      return;
    }

    let response = await fetch(this.configurationUrl);
    if (!response.ok) {
      throw new Error(`Could not load settings for '${ApplicationName}'`);
    }

    let settings = await response.json();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    settings.userStore = new WebStorageStateStore({
      prefix: ApplicationName
    });

    this.userManager = new UserManager(settings);

    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager?.removeUser();
      this.updateState(undefined);
    });
  }

  static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;
