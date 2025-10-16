import { useEffect, useState } from 'react'
import {DashboardDTO} from "../types";
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {accountByUserRespToDashboardDTO} from "./dashboardAdapter";
import {api} from "../shared/api/api";

export function useDashboard(username?: string, opts?: { real?: boolean }) {
    const [data, setData] = useState<DashboardDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { user, authed, loading: sessionLoading } = useSession()
    const name = username ?? user?.name

    useEffect(() => {
        let alive = true

        // 还在恢复会话：保持 loading，不报错
        if (sessionLoading) {
            setLoading(true)
            setError(null)
            return
        }

        // 会话已判定但未登录
        if (!authed) {
            setLoading(false)
            setError('not authed')
            return
        }

        // 已登录但还没有拿到用户名
        if (!name) {
            setLoading(true)   // 保持 loading，别报错；等 name 出现
            setError(null)
            return
        }

        setLoading(true); setError(null)
        api.getAccountOverview(name, { real: opts?.real })
            .then((resp) => { if (alive) setData(accountByUserRespToDashboardDTO(resp)) })
            .catch((e)   => { if (alive) setError(e?.message || 'load failed') })
            .finally(()  => { if (alive) setLoading(false) })

        return () => { alive = false }
    }, [sessionLoading, authed, name, opts?.real])

    return { data, loading, error }
}