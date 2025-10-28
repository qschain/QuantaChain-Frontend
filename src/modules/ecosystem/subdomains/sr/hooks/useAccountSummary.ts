import {useCallback, useEffect, useState} from "react";
import {srApi} from "../shared/api/srApi";

type Summary = {
    loading: boolean
    error: string
    voteTotal: number           // 已投票数
    pendingTRX: number          // 待领取(单位 TRX)
    refresh: () => Promise<void>
}

/** 从 /api/account/get 里只抽取 voteTotal & rewardNum 两个信息 */
export default function useAccountSummary(userName?: string): Summary {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [voteTotal, setVoteTotal] = useState(0)
    const [pendingTRX, setPendingTRX] = useState(0)

    const fetchOnce = useCallback(async () => {
        if (!userName) return
        setLoading(true)
        setError('')
        try {
            // 直接正常调用，不暴露新的 api 方法
            const res = await srApi.getAccount(userName ,true)

            const vt = Number(res.voteTotal ?? 0)
            const rewardSun = Number(res.rewardNumSUN ?? 0)

            setVoteTotal(Number.isFinite(vt) ? vt : 0)
            setPendingTRX(rewardSun / 1_000_000) // SUN -> TRX
        } catch (e: any) {
            setError(e?.message || 'load account error')
        } finally {
            setLoading(false)
        }
    }, [userName])

    useEffect(() => { fetchOnce() }, [fetchOnce])

    return { loading, error, voteTotal, pendingTRX, refresh: fetchOnce }
}
