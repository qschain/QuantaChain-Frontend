import { createContext, useContext } from 'react'
import type { DashboardDTO } from '../types'
import { useDashboard } from './useDashboard' //
import { useSession } from '../state/WalletSessionProvider'

const Ctx = createContext<DashboardDTO | null>(null)

export function DashboardProvider({
                                      children,
                                      real,
                                  }: {
    children: React.ReactNode
    real?: boolean
}) {
    const { user, authed } = useSession()
    const username = user?.name

    // 未登录或没有用户名时的兜底
    if (!authed || !username) {
        return <div style={{ padding: 16 }}>Error: not authed or no username</div>
    }

    // 拉取当前用户的 dashboard（会自动带 Authorization 头）
    const { data, loading, error } = useDashboard(username, { real })

    if (loading) return <div style={{ padding: 16 }}>Loading...</div>
    if (error || !data) return <div style={{ padding: 16 }}>Error: {error || 'No data'}</div>

    return <Ctx.Provider value={data}>{children}</Ctx.Provider>
}

export function useDashboardData() {
    const v = useContext(Ctx)
    if (!v) throw new Error('useDashboardData must be used within <DashboardProvider>')
    return v
}
