import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { AuthResultStatus, OperationStatus } from "./models";
import { DefaultGetTimeoutMs, UserPaths } from "./consts";
import { UserInfo } from "../../models/user-info";

type onAxiosSuccess<T, R> = (response: AxiosResponse<T>) => OperationStatus<R>;
type onAxiosError = (error: any, response?: AxiosResponse) => OperationStatus<any>;

export class AuthorizeService {
  private _callbacks: Map<number, (authenticated: boolean) => void> = new Map();
  private _nextSubscriptionId: number = 0;

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async getUserInfo(): Promise<OperationStatus<UserInfo | undefined>> {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      return this.error();
    }

    return this.axiosRequest(UserPaths.Info, "GET", (r: AxiosResponse<UserInfo>) => this.success(r.data), (r) => this.error(r.data), null, new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}`}));
  }

  async login(username: string, password: string): Promise<OperationStatus<string>> {
    return this.axiosRequest(UserPaths.Login, "POST", this.loginSuccessCallback, this.loginErrorCallback, { username, password }, new AxiosHeaders({ "Content-Type": "application/json" }));
  }

  logout() {
    localStorage.removeItem('token');
    this.notifySubscribers(false);
  }

  // registers a new user using the provided username and password and signs in
  async register(username: string, password: string, state?: any): Promise<OperationStatus<string>> {
    return this.axiosRequest(UserPaths.Register, "POST", this.loginSuccessCallback, this.loginErrorCallback, { username, password }, new AxiosHeaders({ "Content-Type": "application/json" }));
  }

  async checkRouteAuth(path: string): Promise<OperationStatus<boolean>> {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      return this.error(false);
    }

    return this.axiosRequest(UserPaths.IsAuthorized, "POST", (r: AxiosResponse<boolean>) => this.success(r.data), (r) => this.error(r.data), { path },
      new AxiosHeaders({ 'Authorization': `Bearer ${jwtToken}`, "Content-Type": "application/json" })
    );
  }

  loginSuccessCallback: onAxiosSuccess<{ token: string }, string> = response => {
    localStorage.setItem('token', response.data.token);
    this.notifySubscribers(true);
    return this.success();
  }

  loginErrorCallback: onAxiosError = (error, response) => {
    return this.handleAxiosError(error);
  }

  handleAxiosError(error: any): OperationStatus<any> {
    // Handle errors, log them, or throw them as needed
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<string>;
      return this.error(axiosError.response?.data);
    } else {
      return this.error(error);
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

  notifySubscribers(isAuthenticated: boolean) {
    for (const callback of this._callbacks.values()) {
      callback(isAuthenticated);
    }
  }

  error<T>(result?: T): OperationStatus<T> {
    return { status: AuthResultStatus.Fail, result: result };
  }

  success<T>(result?: T): OperationStatus<T> {
    return { status: AuthResultStatus.Success, result: result };
  }

  private async axiosRequest<T, R>(url: string, method: Method, onSuccess: onAxiosSuccess<T, R>, onError: onAxiosError, body?: any, headers?: AxiosHeaders): Promise<OperationStatus<R>> {
    try {
      const response: AxiosResponse = await axios(this.createAxiosRequestConfig(url, method, body, { headers }));

      if (response.status !== axios.HttpStatusCode.Ok) {
        return this.error(response.data);
      }

      return onSuccess(response);
    }
    catch (error: any) {
      return onError(error);
    }
  }

  createAxiosRequestConfig(url: string, method: Method, body?: any, config?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      url: url,
      method: method,
      timeout: DefaultGetTimeoutMs,
      data: body,
      ...config
    }
  }

  static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;
