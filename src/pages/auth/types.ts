export type LoginResponse = {
    code: string
    message: string
    data?: {
        address: string
        role: string
        userName: string
        token: string
    }
}

export type RegisterResponse = {
    code: string
    message: string
    data?: {
        "message": string
    }
}
