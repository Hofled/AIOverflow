import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { DefaultGetTimeoutMs } from "./consts";

type onAxiosSuccess<T, R> = (response: AxiosResponse<T>) => OperationStatus<R>;
type onAxiosError = (error: any, response?: AxiosResponse) => OperationStatus<any>;

async function axiosRequest<T, R>(url: string, method: Method, onSuccess: onAxiosSuccess<T, R>, onError: onAxiosError, body?: any, headers?: AxiosHeaders): Promise<OperationStatus<R>> {
    try {
        const response: AxiosResponse = await axios(createAxiosRequestConfig(url, method, body, { headers }));

        if (response.status >= axios.HttpStatusCode.BadRequest) {
            return onError(response.data, response);
        }

        return onSuccess(response);
    }
    catch (error: any) {
        return onError(error);
    }
}

function createAxiosRequestConfig(url: string, method: Method, body?: any, config?: AxiosRequestConfig): AxiosRequestConfig {
    return {
        url: url,
        method: method,
        timeout: DefaultGetTimeoutMs,
        data: body,
        ...config
    }
}

export interface OperationStatus<T> {
    status: Status
    result?: T
    error?: any
}

export enum Status {
    Success = 'success',
    Fail = 'fail'
}

function wrapFail<T>(result?: T): OperationStatus<T> {
    return { status: Status.Fail, result: result };
}

function wrapSuccess<T>(result?: T): OperationStatus<T> {
    return { status: Status.Success, result: result };
}

export type { onAxiosSuccess, onAxiosError };
export { axiosRequest, wrapSuccess, wrapFail };