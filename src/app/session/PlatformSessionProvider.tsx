import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { api } from '../../shared/api/api'
import type { User, LoginResponse, RegisterResponse } from './types'
import { http } from '../../shared/api/http'

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

export function PlatformSessionProvider({ children }: { children: React.ReactNode }) {
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
                try {
                    setAuthed(true)
                } catch {
                    // token 无效或网络问题
                    applyToken(null)
                    setAuthed(false)
                    setUser(null)
                }
                const savedUser = localStorage.getItem('user')
                if (savedUser) {
                    const user = JSON.parse(savedUser)
                    setUser(user)
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
        if (response.code == '422') {
            throw new Error(response.message)
        }
        const role = response.data?.role
        if (role !== 'REGULAR') {
            throw new Error('登录失败：非用户角色')
        }
        const token = response.data?.token
        if (!token) {
            throw new Error('登录失败：未获取到 token')
        }
        const userName = response.data?.userName
        if (!userName) {
            throw new Error('登录失败：未获取到用户名')
        }
        const address = response.data?.address;
        if (!address) {
            throw new Error('登录失败：未获取到地址');
        }
        applyToken(token)

        // 组装用户对象（实际应该从后端回传的 profile 字段取）
        const userData: User = {
            address,
            role: role,
            name: userName,
            token
        }
        setUser(userData)
        console.log(userData)
        setAuthed(true)

        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        setAuthed(false)
        setUser(null)
        applyToken(null)
        localStorage.removeItem('user') // 添加:清除保存的用户信息
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
