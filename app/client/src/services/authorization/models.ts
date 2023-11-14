export interface OperationStatus {
    status: string
}

export interface RedirectOperation extends OperationStatus {

}

export interface SuccessfulOperation extends OperationStatus {
    state: any
}

export interface FailedOperation extends OperationStatus {
    message: string
}

export enum AuthenticationResultStatus {
    Redirect = 'redirect',
    Success = 'success',
    Fail = 'fail'
}
