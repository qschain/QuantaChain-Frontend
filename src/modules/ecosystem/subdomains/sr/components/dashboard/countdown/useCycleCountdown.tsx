import { useEffect, useMemo, useState } from 'react'

/** 把 "YYYY-MM-DD HH:mm:ss" 转换为时间戳（兼容 Safari） */
function parseTimeToMs(s?: string) {
    if (!s) return NaN
    const t = Date.parse(String(s).replace(/-/g, '/'))
    return Number.isFinite(t) ? t : NaN
}

/** 6 小时一轮（可配），根据 nextTime 算剩余与比例 */
export function useCycleCountdown(nextTime?: string, cycleHours = 6) {
    const [now, setNow] = useState<number>(() => Date.now())
    const target = useMemo(() => parseTimeToMs(nextTime), [nextTime])

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(id)
    }, [])

    const cycleMs = cycleHours * 3600 * 1000
    const leftMs = useMemo(() => {
        if (!Number.isFinite(target)) return NaN
        return Math.max(0, target - now)
    }, [now, target])

    const progress = useMemo(() => {
        if (!Number.isFinite(target)) return 0
        const p = 1 - leftMs / cycleMs
        return Math.min(1, Math.max(0, p))
    }, [leftMs, cycleMs])

    const leftText = useMemo(() => {
        if (!Number.isFinite(leftMs)) return '—'
        const s = Math.floor(leftMs / 1000)
        const d = Math.floor(s / 86400)
        const h = Math.floor((s % 86400) / 3600)
        const m = Math.floor((s % 3600) / 60)
        const sec = s % 60
        return d > 0
            ? `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
            : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    }, [leftMs])

    const percent = Math.round(progress * 100)

    return { leftMs, progress, percent, leftText }
}
