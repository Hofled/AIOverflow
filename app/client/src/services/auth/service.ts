import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { UserPaths } from "./consts";
import { UserInfo } from "../../models/user-info";
import { OperationStatus, onAxiosSuccess, onAxiosError, axiosRequest, wrapSuccess, wrapFail } from "../axios";

export class AuthorizeService {
  private _callbacks: Map<number, (authenticated: boolean) => void> = new Map();
  private _nextSubscriptionId: number = 0;

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async getUserInfo(): Promise<OperationStatus<UserInfo | undefined>> {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      return wrapFail();
    }

    return axiosRequest(UserPaths.Info, "GET", (r: AxiosResponse<UserInfo>) => wrapSuccess(r.data), (r) => wrapFail(r.data), null, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}` }));
  }

  async login(username: string, password: string): Promise<OperationStatus<string>> {
    return axiosRequest(UserPaths.Login, "POST", this.loginSuccessCallback, this.loginErrorCallback, { username, password }, new AxiosHeaders({ "Content-Type": "application/json" }));
  }

  logout() {
    localStorage.removeItem('token');
    this.notifySubscribers(false);
  }

  // registers a new user using the provided username and password and signs in
  async register(username: string, password: string, state?: any): Promise<OperationStatus<string>> {
    return axiosRequest(UserPaths.Register, "POST", this.loginSuccessCallback, this.loginErrorCallback, { username, password }, new AxiosHeaders({ "Content-Type": "application/json" }));
  }

  async checkRouteAuth(path: string): Promise<OperationStatus<boolean>> {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      return wrapFail(false);
    }

    return axiosRequest(UserPaths.IsAuthorized, "POST", (r: AxiosResponse<boolean>) => wrapSuccess(r.data), (r) => wrapFail(r.data), { path },
      new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}`, "Content-Type": "application/json" })
    );
  }

  private loginSuccessCallback: onAxiosSuccess<{ token: string }, string> = response => {
    localStorage.setItem('token', response.data.token);
    this.notifySubscribers(true);
    return wrapSuccess();
  }

  private loginErrorCallback: onAxiosError = (error, response) => {
    return this.handleAxiosError(error);
  }

  private handleAxiosError(error: any): OperationStatus<any> {
    // Handle errors, log them, or throw them as needed
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<string>;
      return wrapFail(axiosError.response?.data);
    } else {
      return wrapFail(error);
    }
  }

  subscribe(callback: (authenticated: boolean) => void) {
    const subscriptionId = this._nextSubscriptionId++;
    this._callbacks.set(subscriptionId, callback);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: number) {
    this._callbacks.delete(subscriptionId);
  }

  private notifySubscribers(isAuthenticated: boolean) {
    for (const callback of this._callbacks.values()) {
      callback(isAuthenticated);
    }
  }

  static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;
