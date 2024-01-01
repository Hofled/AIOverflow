export interface OperationStatus {
    status: AuthResultStatus
    message?: string
}

export enum AuthResultStatus {
    Success = 'success',
    Fail = 'fail'
}

export interface AuthenticationParams {
    username: string
    password: string
}