// 仅粘贴组件/函数体（不含 import）
import {useCallback, useEffect, useMemo, useState} from "react";
import srApi from "../shared/api/srApi";

export default function useWitnessOverview() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [sumVotes, setSumVotes] = useState(0)
    const [freezeRatePct, setFreezeRatePct] = useState('—') // e.g. "47.60%"
    const [avgApyPct, setAvgApyPct] = useState('—')         // e.g. "328.60%" (按你要求 ×100)

    const [top10, setTop10] =useState<Array<{ name: string; pct: number }>>([])
    const [othersPct, setOthersPct] = useState(0)

    const refresh = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // 拉取前 27 个
            const { list, sumVotes, freezeRate } = await srApi.getWitnessList(
                { pageNum: 1, pageSize: 27 },
                true
            )

            // KPI —— 总票数
            setSumVotes(sumVotes || 0)

            // KPI —— 总质押率（0~1 -> %）
            const fr = Number(freezeRate ?? 0) * 100
            setFreezeRatePct(Number.isFinite(fr) ? `${fr.toFixed(2)}%` : '—')

            // KPI —— 平均年化（前 27 个 annualizedRate 的均值 ×100）
            const rates = (list || []).slice(0, 27).map(it => Number(it.annualizedRate ?? 0))
            const avg = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length) : NaN
            setAvgApyPct(Number.isFinite(avg) ? `${avg.toFixed(2)}%` : '—')

            // 分布与排名
            const withPct = (list || []).map(it => {
                // 优先 percent（字符串小数，如 "0.071" -> 7.1%），否则使用 votesPercentage（本身已是百分比数值）
                const hasPercent = it.percent != null && it.percent !== ''
                const pct = hasPercent ? Number(it.percent) * 100 : Number(it.votesPercentage ?? 0)
                return { name: it.name || it.address, pct: Number.isFinite(pct) ? pct : 0 }
            })

            // 按百分比降序
            withPct.sort((a, b) => b.pct - a.pct)

            // 前 10 名 + 其他（11–27 合并）
            const top10 = withPct.slice(0, 10)
            const rest = withPct.slice(10, 27)
            const others = rest.reduce((s, x) => s + x.pct, 0)

            setTop10(top10)
            setOthersPct(others)
        } catch (e: any) {
            setError(e?.message || 'load witness overview error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { refresh() }, [refresh])

    // 饼图片段（按 top10 + others 组装）
    const segments = useMemo(() => {
        const arr = [...top10]
        if (othersPct > 0.0001) arr.push({ name: 'Others', pct: othersPct })
        // 规范化（防守：总和可能非 100）
        const total = arr.reduce((s, x) => s + x.pct, 0) || 1
        return arr.map(s => ({ label: s.name, value: s.pct / total }))
    }, [top10, othersPct])

    return {
        loading,
        error,
        // KPI
        sumVotes,
        freezeRatePct,
        avgApyPct,
        // 排名（百分比数字）
        top10,
        othersPct,
        // 饼图片段（0~1）
        segments,
        refresh,
    }
}
