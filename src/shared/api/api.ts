import type {LoginResponse, RegisterResponse} from "../../pages/auth/types";
import {http} from "./http";

type ApiOpts = { real?: boolean }

function withReal<T extends Record<string, any> | undefined>(opts: T, real?: boolean): T {
    const next: any = { ...(opts || {}) }
    if (real) next.useRealApi = true
    return next as T
}

export const api = {
    async register(userName: string, passWord: string, opts?: ApiOpts): Promise<RegisterResponse> {
        return http.post<RegisterResponse>(
            '/api/register',
            { userName, passWord },
            withReal({ withAuth: false }, opts?.real)
        )
    },

    async login(userName: string, passWord: string, opts?: ApiOpts): Promise<LoginResponse> {
        return http.post<LoginResponse>(
            '/api/login',
            { userName, passWord },
            withReal({ withAuth: false }, opts?.real)
        )
    }
}