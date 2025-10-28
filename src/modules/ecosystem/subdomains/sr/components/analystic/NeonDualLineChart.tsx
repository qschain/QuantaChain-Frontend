import {useEffect, useMemo, useRef, useState} from 'react'
import type { WitnessStatPoint } from '../../shared/api/srApi'

type Props = {
    data: WitnessStatPoint[] // ts, apy(%)，freezeRate(0-1)
    height?: number
}

const NeonDualLineChart: React.FC<Props> = ({ data, height = 260 }) => {
    const pad = 28
    const [w, setW] = useState(720) // 自适应容器宽
    const ref = useRef<HTMLDivElement>(null)
    const [animated, setAnimated] = useState(false)

   useEffect(() => {
        if (!ref.current) return
        const ro = new ResizeObserver(() => setW(ref.current!.clientWidth))
        ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])

    // 触发动画
    useEffect(() => {
        setAnimated(false)
        const timer = setTimeout(() => setAnimated(true), 50)
        return () => clearTimeout(timer)
    }, [data])


    const box = { x0: pad, y0: pad, x1: w - pad, y1: height - pad }
    const N = data.length
    const tsMin = data[0]?.ts ?? 0
    const tsMax = data[N - 1]?.ts ?? 1
    const apyMax = Math.max(...data.map(d => d.apy), 0) || 1
    const apyMin = Math.min(...data.map(d => d.apy), 0)
    const frMax = Math.max(...data.map(d => d.freezeRate), 0) || 1
    const frMin = Math.min(...data.map(d => d.freezeRate), 0)

    const xOf = (ts: number) =>
        box.x0 + ((ts - tsMin) / Math.max(1, tsMax - tsMin)) * (box.x1 - box.x0)

    const yOfApy = (v: number) => {
        const t = (v - apyMin) / Math.max(1e-9, apyMax - apyMin)
        return box.y1 - t * (box.y1 - box.y0)
    }
    const yOfFr = (v: number) => {
        const t = (v - frMin) / Math.max(1e-9, frMax - frMin)
        return box.y1 - t * (box.y1 - box.y0)
    }

    const pathFreeze = useMemo(() => {
        if (!N) return ''
        return data.map((d, i) => `${i ? 'L' : 'M'} ${xOf(d.ts)} ${yOfFr(d.freezeRate)}`).join(' ')
    }, [data, N, w, height, frMin, frMax])

    const areaFreeze = useMemo(() => {
        if (!N) return ''
        const head = `M ${xOf(data[0].ts)} ${yOfFr(data[0].freezeRate)} `
        const mid = data.slice(1).map(d => `L ${xOf(d.ts)} ${yOfFr(d.freezeRate)}`).join(' ')
        const tail = ` L ${xOf(data[N - 1].ts)} ${box.y1} L ${xOf(data[0].ts)} ${box.y1} Z`
        return head + mid + tail
    }, [data, N, w, height, frMin, frMax])

    const pathApy = useMemo(() => {
        if (!N) return ''
        return data.map((d, i) => `${i ? 'L' : 'M'} ${xOf(d.ts)} ${yOfApy(d.apy)}`).join(' ')
    }, [data, N, w, height, apyMin, apyMax])

    // 计算路径长度用于动画
    const pathFreezeLength = useMemo(() => {
        if (!pathFreeze || typeof document === 'undefined') return 0
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', pathFreeze)
        return path.getTotalLength()
    }, [pathFreeze])

    const pathApyLength = useMemo(() => {
        if (!pathApy || typeof document === 'undefined') return 0
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', pathApy)
        return path.getTotalLength()
    }, [pathApy])

    // Tooltip
    const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)
    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!N) return
        const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect()
        const px = e.clientX - rect.left
        let idx = 0
        let best = Infinity
        data.forEach((d, i) => {
            const dx = Math.abs(xOf(d.ts) - px)
            if (dx < best) { best = dx; idx = i }
        })
        const d = data[idx]
        const x = xOf(d.ts)
        const y = Math.min(yOfFr(d.freezeRate), yOfApy(d.apy))
        const date = new Date(d.ts).toLocaleDateString()
        setTip({ x, y, text: `${date}\nFreeze ${ (d.freezeRate*100).toFixed(2)}% · APY ${d.apy.toFixed(2)}%` })
    }

    return (
        <div ref={ref} style={{ width: '100%', opacity: animated ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <svg width={w} height={height} onMouseMove={onMove} onMouseLeave={() => setTip(null)}>
                {/* 背景玻璃 */}
                <defs>
                    <linearGradient id="frArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0,229,255,.26)" />
                        <stop offset="100%" stopColor="rgba(0,229,255,.02)" />
                    </linearGradient>
                    <linearGradient id="frLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00e5ff" />
                        <stop offset="100%" stopColor="#05ffd2" />
                    </linearGradient>
                    <linearGradient id="apyLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                </defs>

                {/* 网格 */}
                {Array.from({ length: 4 }).map((_, i) => {
                    const y = box.y0 + ((i + 1) / 5) * (box.y1 - box.y0)
                    return <line key={i} x1={box.x0} y1={y} x2={box.x1} y2={y} stroke="rgba(255,255,255,.08)" />
                })}
                {Array.from({ length: 4 }).map((_, i) => {
                    const x = box.x0 + ((i + 1) / 5) * (box.x1 - box.x0)
                    return <line key={'v'+i} x1={x} y1={box.y0} x2={x} y2={box.y1} stroke="rgba(255,255,255,.06)" />
                })}

                {/* 面积（Freeze）- 添加淡入动画 */}
                <path
                    d={areaFreeze}
                    fill="url(#frArea)"
                    style={{
                        opacity: animated ? 1 : 0,
                        transition: 'opacity 0.6s ease 0.3s'
                    }}
                />

                {/* Freeze 曲线 - 添加路径绘制动画 */}
                <path
                    d={pathFreeze}
                    fill="none"
                    stroke="url(#frLine)"
                    strokeWidth={3}
                    filter="url(#shadow)"
                    strokeDasharray={pathFreezeLength}
                    strokeDashoffset={animated ? 0 : pathFreezeLength}
                    style={{
                        transition: 'stroke-dashoffset 1.2s ease-out'
                    }}
                />

                {/* APY 曲线 - 添加路径绘制动画 */}
                <path
                    d={pathApy}
                    fill="none"
                    stroke="url(#apyLine)"
                    strokeWidth={2}
                    opacity={0.95}
                    strokeDasharray={pathApyLength}
                    strokeDashoffset={animated ? 0 : pathApyLength}
                    style={{
                        transition: 'stroke-dashoffset 1.2s ease-out 0.2s'
                    }}
                />

                {/* 霓虹点位（稀疏）- 添加依次出现动画 */}
                {data.map((d, i) => (
                    <circle
                        key={'p1'+i}
                        cx={xOf(d.ts)}
                        cy={yOfFr(d.freezeRate)}
                        r={animated ? 3 : 0}
                        fill="#00e5ff"
                        opacity={.9}
                        style={{
                            transition: `r 0.3s ease ${0.8 + i * 0.02}s`
                        }}
                    />
                ))}
                {data.map((d, i) => (
                    <circle
                        key={'p2'+i}
                        cx={xOf(d.ts)}
                        cy={yOfApy(d.apy)}
                        r={animated ? 3 : 0}
                        fill="#a78bfa"
                        opacity={.9}
                        style={{
                            transition: `r 0.3s ease ${1.0 + i * 0.02}s`
                        }}
                    />
                ))}

                {/* Tooltip */}
                {tip && (
                    <>
                        <line x1={tip.x} y1={box.y0} x2={tip.x} y2={box.y1} stroke="rgba(255,255,255,.12)" />
                        <g transform={`translate(${Math.min(tip.x + 8, w - 160)}, ${Math.max(tip.y - 40, 8)})`}>
                            <rect width="170" height="42" rx="10" fill="rgba(20,27,34,.9)" stroke="rgba(0,229,255,.3)" />
                            <text x="8" y="18" fontSize="12" fill="#cbd5e1">{tip.text.split('\n')[0]}</text>
                            <text x="8" y="34" fontSize="12" fill="#00e5ff">{tip.text.split('\n')[1]}</text>
                        </g>
                    </>
                )}
            </svg>

            {/* Legend */}
            <div
                className="sr-row sr-gap-16"
                style={{
                    marginTop: 8,
                    opacity: animated ? 1 : 0,
                    transition: 'opacity 0.5s ease 1.5s'
                }}
            >
                <div className="sr-row sr-gap-8 sr-align-center">
                    <span style={{ width:12, height:12, borderRadius:2, background:'linear-gradient(90deg,#00e5ff,#05ffd2)' }} />
                    <span className="sr-muted">质押率</span>
                </div>
                <div className="sr-row sr-gap-8 sr-align-center">
                    <span style={{ width:12, height:12, borderRadius:2, background:'linear-gradient(90deg,#a78bfa,#7c3aed)' }} />
                    <span className="sr-muted">APY</span>
                </div>
            </div>
        </div>
    )
}

export default NeonDualLineChart