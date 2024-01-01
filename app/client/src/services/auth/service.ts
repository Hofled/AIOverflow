import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthResultStatus, OperationStatus } from "./models";
import { DefaultGetTimeoutMs, IdentityPaths } from "./consts";

type onAxiosSuccess = (response: AxiosResponse) => OperationStatus;
type onAxiosError = (error: any, response?: AxiosResponse) => OperationStatus;

export class AuthorizeService {
  private _callbacks: Map<number, (authenticated: boolean) => void> = new Map();
  private _nextSubscriptionId: number = 0;

  constructor() {
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const response: AxiosResponse = await axios.get(IdentityPaths.IsAuthenticated, this.createAxiosRequestConfig(null, {
        withCredentials: true
      }));

      if (response.status != axios.HttpStatusCode.Ok) {
        return false;
      }

      return response.data;
    }
    catch (error: any) {
      return false;
    }
  }

  // TODO implement
  async isAuthorized(role: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async login(username: string, password: string): Promise<OperationStatus> {
    return this.axiosGetRequest(IdentityPaths.Login, this.loginSuccessCallback, this.loginErrorCallback, { username, password });
  }

  // registers a new user using the provided username and password and signs in
  async register(username: string, password: string, state?: any): Promise<OperationStatus> {
    return this.axiosGetRequest(IdentityPaths.Register, this.loginSuccessCallback, this.loginErrorCallback, { username, password });
  }

  loginSuccessCallback: onAxiosSuccess = response => {
    this.notifySubscribers(true);
    return this.success(response.data);
  }

  loginErrorCallback: onAxiosError = (error, response) => {
    return this.handleAxiosError(error);
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

  error(message?: string): OperationStatus {
    return { status: AuthResultStatus.Fail, message };
  }

  success(message?: string): OperationStatus {
    return { status: AuthResultStatus.Success, message };
  }

  async axiosGetRequest(url: string, onSuccess: onAxiosSuccess, onError: onAxiosError, params?: any): Promise<OperationStatus> {
    try {
      const response: AxiosResponse = await axios.get(url, this.createAxiosRequestConfig(params));

      if (response.status != axios.HttpStatusCode.Ok) {
        return this.error(response.data);
      }

      return onSuccess(response);
    }
    catch (error: any) {
      return onError(error);
    }
  }

  handleAxiosError(error: any): OperationStatus {
    // Handle errors, log them, or throw them as needed
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<string>;
      return this.error(axiosError.response?.data);
    } else {
      return this.error(error);
    }
  }

  createAxiosRequestConfig(params?: any, config?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      timeout: DefaultGetTimeoutMs,
      params: params,
      ...config
    }
  }

  static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;
