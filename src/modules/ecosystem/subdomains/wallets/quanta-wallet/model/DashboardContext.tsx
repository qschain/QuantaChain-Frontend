import React, { createContext, useContext } from 'react'
import type { DashboardDTO } from '../types'
import { useDashboard } from './useDashboard'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'

/** Context 里放 状态 + 值 */
type DashboardCtxValue = {
    data: DashboardDTO | null
    loading: boolean
    error: string | null
}

const Ctx = createContext<DashboardCtxValue | null>(null)

/** 非阻塞 Provider：始终渲染 children，不再用 Loading/Error 截断渲染 */
export function DashboardProvider({
                                      children,
                                      real,
                                  }: {
    children: React.ReactNode
    real?: boolean
}) {
    const { user, authed, loading: sessionLoading } = useSession()
    const name = user?.name

    // 只有在会话就绪且拿到用户名时才触发请求
    const canFetch = authed && !!name && !sessionLoading
    const { data, loading, error } = useDashboard(canFetch ? name : undefined, { real })

    const value: DashboardCtxValue = {
        data: canFetch && !loading && !error ? data : null,
        loading: sessionLoading || !canFetch || loading,
        error: !canFetch
            ? (sessionLoading ? null : authed ? 'no username' : 'not authed')
            : error,
    }

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** 宽松版 hook：返回 {data, loading, error}，组件自己决定如何兜底 */
export function useDashboardCtx() {
    const v = useContext(Ctx)
    if (!v) throw new Error('useDashboardCtx must be used within <DashboardProvider>')
    return v
}

/** 兼容旧代码的严格版：只有数据就绪才返回，否则抛错（建议仅在已被保护壳包裹时使用） */
export function useDashboardData(): DashboardDTO {
    const { data } = useDashboardCtx()
    if (!data) throw new Error('useDashboardData requires dashboard data to be ready')
    return data
}

/** 保护壳：仅在数据就绪时渲染 children，避免严格版 hook 在未就绪时抛错 */
export function RequireDashboardData({
                                         children,
                                         fallback = <div style={{ padding: 8 }}>Loading…</div>,
                                         errorFallback = (msg: string) => (
                                             <div style={{ padding: 8, color: 'var(--danger, #ff5a7a)' }}>Error: {msg}</div>
                                         ),
                                     }: {
    children: React.ReactNode
    fallback?: React.ReactNode
    errorFallback?: (msg: string) => React.ReactNode
}) {
    const { data, loading, error } = useDashboardCtx()
    if (loading) return <>{fallback}</>
    if (error || !data) return <>{errorFallback(typeof error === 'string' ? error : 'no data')}</>
    return <>{children}</>
}
