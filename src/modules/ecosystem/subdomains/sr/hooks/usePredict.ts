import {useCallback, useRef, useState} from "react";
import {postPredict} from "../shared/api/srApi";

type UsePredictReturn = {
    count: string
    rate: string
    days: string
    setCount: (v: string) => void
    setRate: (v: string) => void
    setDays: (v: string) => void
    result: number | null
    loading: boolean
    error: string
    simulate: () => Promise<void>
}

export default function usePredict(
    initial?: Partial<Pick<UsePredictReturn, 'count' | 'rate' | 'days'>>
): UsePredictReturn {
    const [count, setCount] = useState(initial?.count ?? '')
    const [rate, setRate] = useState(initial?.rate ?? '')
    const [days, setDays] = useState(initial?.days ?? '')

    const [result, setResult] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // 使用 ref 来防止竞态条件
    const reqIdRef = useRef(0)

    const simulate = useCallback(async () => {
        const currentReqId = ++reqIdRef.current
        setLoading(true)
        setError('')

        try {
            // 兜底把空值置为字符串数字
            const payload = {
                count: String(count || '0'),
                rate: String(Number(rate || '0')/100),
                days: String(days || '0'),
            }
            const ret = await postPredict(payload)

            // 检查是否是最新的请求
            if (reqIdRef.current !== currentReqId) return

            setResult(Number(ret) || 0)
        } catch (e: any) {
            // 检查是否是最新的请求
            if (reqIdRef.current !== currentReqId) return

            setError(e?.message || 'predict error')
            setResult(null)
        } finally {
            // 只有最新的请求才更新 loading 状态
            if (reqIdRef.current === currentReqId) {
                setLoading(false)
            }
        }
    }, [count, rate, days])

    return {
        count, rate, days,
        setCount, setRate, setDays,
        result, loading, error,
        simulate,
    }
}