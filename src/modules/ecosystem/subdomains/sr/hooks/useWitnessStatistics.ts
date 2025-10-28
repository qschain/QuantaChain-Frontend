import { useCallback, useEffect, useMemo, useState } from 'react'
import srApi, { WitnessStatistics } from '../shared/api/srApi'

export default function useWitnessStatistics(initialDays = 7) {
    const [days, setDays] = useState<number>(initialDays)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>()
    const [stats, setStats] = useState<WitnessStatistics | null>(null)

    const load = useCallback(async (d: number) => {
        setLoading(true); setError(undefined)
        try {
            const s = await srApi.getWitnessStatistics(d, true)
            setStats(s)
        } catch (e: any) {
            setError(e?.message || 'load statistics error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { void load(days) }, [days, load])

    const refresh = useCallback(() => load(days), [days, load])

    // 百分号格式化
    const fmtPct = (v?: number, digits = 2) =>
        (Number(v ?? 0) * 100).toFixed(digits) + '%'

    const kpi = useMemo(() => {
        if (!stats) return null
        return {
            maxApy: stats.maxApy?.toFixed(2) + '%',
            minApy: stats.minApy?.toFixed(2) + '%',
            maxFreeze: fmtPct(stats.maxFreezeRate),
            minFreeze: fmtPct(stats.minFreezeRate),
        }
    }, [stats])

    return { days, setDays, loading, error, stats, kpi, refresh }
}
