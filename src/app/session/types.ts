export type User = {
    role: string
    name: string
    token?: string
    address: string
}

export type LoginResponse = {
    code: string
    message: string
    data?: {
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