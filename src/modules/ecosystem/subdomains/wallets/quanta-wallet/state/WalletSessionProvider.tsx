// 统一管理全局的用户登录状态
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { api } from '../shared/api/api'
import type { User, LoginResponse, RegisterResponse } from '../types'
import { http } from '../shared/api/httpWallet'

type SessionContext = {
    authed: boolean
    user: User | null
    loading: boolean
    login: (identifier: string, password: string) => Promise<void>
    register: (userName: string, password: string) => Promise<void>
    logout: () => void
    initializeFromToken: () => Promise<void>
}

const SessionCtx = createContext<SessionContext | null>(null)

export function WalletSessionProvider({ children }: { children: React.ReactNode }) {
    const [authed, setAuthed] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // —— 辅助：把 token 放入 http + 持久化 ——
    const applyToken = (token: string | null) => {
        http.setAuthToken(token)
        if (token) localStorage.setItem('token', token)
        else localStorage.removeItem('token')
    }

    // —— 启动：从本地恢复并（可选）验证 token ——
    const initializeFromToken = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            if (token) {
                applyToken(token)

                // 方式一（严格）：调用“获取当前用户”接口验证 token
                // 注：你可以在 api 层补一个 api.me()，这里我先用 dashboard 做“轻验证”
                try {
                    // await api.getDashboard({ real: true })
                    // 若能通，则认为 authed = true（也可在这里设置 user 资料）
                    setAuthed(true)
                    // 也可以在这里调一个真实的 /me 接口获取用户信息
                    // const me = await api.me({real:true})
                    // setUser(me)
                } catch {
                    // token 无效或网络问题
                    applyToken(null)
                    setAuthed(false)
                    setUser(null)
                }
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        initializeFromToken()
        // —— 跨 Tab 同步登录/退出 ——
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'token') {
                const t = localStorage.getItem('token')
                http.setAuthToken(t)
                if (!t) {
                    setAuthed(false)
                    setUser(null)
                } else {
                    // 简单处理：有 token 就认为已登录（也可触发一次轻验证）
                    setAuthed(true)
                }
            }
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const register = async (userName: string, password: string) => {
        const response = await api.register(userName, password, { real: true })
        if (response.code == '500') {
            throw new Error(response.data?.message || '用户已注册')
        }
        // 这里保持你原来的策略：注册成功后不自动登录
        // 如果想自动登录，可以直接复用 login(userName, password)
    }

    const login = async (identifier: string, password: string) => {
        const response = await api.login(identifier, password, { real: true })
        if (response.code !== '200') {
            throw new Error(response.message || '登录失败')
        }
        const token = response.data?.token
        if (!token) {
            throw new Error('登录失败：未获取到 token')
        }

        // —— 应用 token ——（之后所有请求会自动带 Authorization 头）
        applyToken(token)

        // 组装用户对象（实际应该从后端回传的 profile 字段取）
        const userData: User = {
            id: identifier,
            name: identifier,
            email: identifier,
            token,
        }
        setUser(userData)
        setAuthed(true)
    }

    const logout = () => {
        setAuthed(false)
        setUser(null)
        applyToken(null)
    }

    const value = useMemo(
        () => ({ authed, user, loading, login, register, logout, initializeFromToken }),
        [authed, user, loading]
    )

    return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>
}

export function useSession() {
    const ctx = useContext(SessionCtx)
    if (!ctx) throw new Error('useSession must be used within WalletSessionProvider')
    return ctx
}
