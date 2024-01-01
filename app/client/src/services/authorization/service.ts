import { AuthenticationResultStatus, FailedOperation, RedirectOperation, SuccessfulOperation } from "./models";

export class AuthorizeService {
  private _callbacks: Map<number, (authenticated: boolean) => void> = new Map();
  private _nextSubscriptionId: number = 0;

  constructor() {
  }

  // TODO implement
  async isAuthenticated(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // TODO implement
  async isAuthorized(role: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // TODO implement sign in functionality with the /identity/login endpoint
  async signIn(username: string, password: string, state?: any): Promise<RedirectOperation | SuccessfulOperation | FailedOperation> {
    this.notifySubscribers(true);
    return this.success(state);
  }

  subscribe(callback: (authenticated: boolean) => void) {
    const subscriptionId = this._nextSubscriptionId++;
    this._callbacks.set(subscriptionId, callback);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: number) {
    if (!this._callbacks.delete(subscriptionId)) {
      throw new Error(`subscription with ID ${subscriptionId} was not found`);
    }
  }

  notifySubscribers(isAuthenticated: boolean) {
    for (const callback of this._callbacks.values()) {
      callback(isAuthenticated);
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

  // TODO might be redundant
  redirect(): RedirectOperation {
    return { status: AuthenticationResultStatus.Redirect };
  }

  static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;
