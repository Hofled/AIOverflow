export interface AuthenticationParams {
    username: string
    password: string
}

export interface TokenResponse {
    token: string
    userID: number
    userName: string
}