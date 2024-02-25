export interface OperationStatus<T> {
    status: AuthResultStatus
    result?: T
}

export enum AuthResultStatus {
    Success = 'success',
    Fail = 'fail'
}

export interface AuthenticationParams {
    username: string
    password: string
}