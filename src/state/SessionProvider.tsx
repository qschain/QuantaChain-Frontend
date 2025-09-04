import React, { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../services/api'
import type { User } from '../types'
import { http } from '../lib/http'

type SessionContext = {
  authed: boolean
  user: User | null
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
}

const SessionCtx = createContext<SessionContext | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // 初始从本地存储恢复会话（仅根据 token 存在与否）
  const [authed, setAuthed] = useState<boolean>(() => !!localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  const login = async (identifier: string, password: string) => {
    // 真实后端建议返回 token；MSW/Mock 场景下没有 token 则使用占位
    const u = await api.login(identifier, password)
    const token = (u as any)?.token || 'dev-mock-token'
    localStorage.setItem('token', token)
    http.setAuthToken(token)
    setUser(u)
    setAuthed(true)
  }

  const logout = () => {
    setAuthed(false)
    setUser(null)
    localStorage.removeItem('token')
    http.setAuthToken(null)
  }

  const value = useMemo(() => ({ authed, user, login, logout }), [authed, user])

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>
}

export function useSession() {
  const ctx = useContext(SessionCtx)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
