import {useCallback, useEffect, useState} from "react";
import {http} from "../../../../../shared/api/http";
import srApi from "../shared/api/srApi";

type RewardsState = {
    loading: boolean
    error: string
    pendingTRX: number      // 待领取（TRX）
    txHash: string          // 最近一次领取返回的哈希（成功时填充）
    withdrawing: boolean
    refresh: () => Promise<void>
    withdraw: () => Promise<string>  // 返回 txnHash
    clearTx: () => void
}

/**
 * 奖励与收益：数据与动作聚合在 Hook 中，页面只消费状态与方法
 * - 从 srApi.getAccount 只取 rewardNumSUN（SUN -> TRX）
 * - 领取奖励通过 srApi.postWithdraw(ownerAddress)
 * - 统一错误处理、loading、哈希等状态
 */
export default function useRewards(userName?: string, ownerAddress?: string): RewardsState {
    const [loading, setLoading] = useState(true)
    const [withdrawing, setWithdrawing] = useState(false)
    const [error, setError] = useState('')
    const [pendingTRX, setPendingTRX] = useState(0)
    const [txHash, setTxHash] = useState('')

    const refresh = useCallback(async () => {
        setError('')
        if (!userName) {
            setPendingTRX(0)
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const account = await srApi.getAccount(userName) // 已封装映射到 AccountInfo
            const rewardSun = Number(account?.rewardNumSUN ?? 0)
            setPendingTRX(rewardSun / 1_000_000)
        } catch (e: any) {
            setError(e?.message || 'load account error')
        } finally {
            setLoading(false)
        }
    }, [userName])

    const withdraw = useCallback(async () => {
        if (!ownerAddress) throw new Error('No ownerAddress')
        setWithdrawing(true)
        setError('')
        try {
            const hash = await srApi.postWithdraw(ownerAddress)
            if (!hash) throw new Error('withdraw failed')
            setTxHash(hash)
            await refresh()     // 成功后刷新待领取
            return hash
        } catch (e: any) {
            setError(e?.message || 'withdraw failed')
            throw e
        } finally {
            setWithdrawing(false)
        }
    }, [ownerAddress, refresh])

    const clearTx = useCallback(() => setTxHash(''), [])

    useEffect(() => { refresh() }, [refresh])

    return { loading, error, pendingTRX, txHash, withdrawing, refresh, withdraw, clearTx }
}
