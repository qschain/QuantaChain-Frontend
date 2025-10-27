import React, { useState, useMemo, useRef } from 'react'

type Seg = {
    label: string
    value: number
    detail?: string // 可选额外信息，例如年化收益
}

export default function PieDonut({
                                     segments,
                                     size = 260,
                                     hole = 80,
                                     showCenter = true,
                                 }: {
    segments: Seg[]
    size?: number
    hole?: number
    showCenter?: boolean
}) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const r = size / 2
    const stroke = (size - hole) / 2
    const radius = r - stroke / 2
    const C = 2 * Math.PI * radius

    // 青蓝色渐变色方案（统一风格）
    const colors = useMemo(
        () => segments.map((_, i) => `hsl(${190 + (i * 20) % 120} 80% 55%)`),
        [segments]
    )

    // 构造饼图数据
    let acc = 0
    const rings = segments.map((s, i) => {
        const len = Math.max(0, s.value) * C
        const dash = `${len} ${C - len}`
        const offset = -acc * C
        acc += Math.max(0, s.value)
        return { dash, offset, color: colors[i], label: s.label, frac: s.value, detail: s.detail }
    })

    const hoverSeg =
        hoverIndex !== null && hoverIndex >= 0 && hoverIndex < segments.length
            ? segments[hoverIndex]
            : null

    // 鼠标移动时更新 tooltip 坐标
    function handleMouseMove(e: React.MouseEvent) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        setTooltip({
            x: e.clientX - rect.left + 10,
            y: e.clientY - rect.top - 10,
            content: hoverSeg
                ? `${hoverSeg.label}\n${(hoverSeg.value * 100).toFixed(2)}%${
                    hoverSeg.detail ? ` · ${hoverSeg.detail}` : ''
                }`
                : '',
        })
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                height: size + 10,
                userSelect: 'none',
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    transform: 'rotate(-90deg)',
                    display: 'block',
                    margin: '0 auto',
                }}
            >
                {/* 背景环 */}
                <circle
                    cx={r}
                    cy={r}
                    r={radius}
                    fill="none"
                    stroke="var(--sr-bg-surface)"
                    strokeWidth={stroke}
                />

                {/* 扇形 */}
                {rings.map((k, i) => (
                    <circle
                        key={i}
                        cx={r}
                        cy={r}
                        r={radius}
                        fill="none"
                        stroke={k.color}
                        strokeWidth={stroke}
                        strokeDasharray={k.dash}
                        strokeDashoffset={k.offset}
                        opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.4}
                        style={{
                            cursor: 'pointer',
                            transition: 'opacity 0.2s ease',
                        }}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => {
                            setHoverIndex(null)
                            setTooltip(null)
                        }}
                    />
                ))}
            </svg>

            {/* 中心文字 */}
            {showCenter && (
                <div
                    style={{
                        position: 'absolute',
                        textAlign: 'center',
                        color: 'var(--sr-text)',
                        pointerEvents: 'none',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {hoverSeg ? (
                        <>
                            <div style={{ fontSize: 15, color: 'var(--sr-muted)', marginBottom: 4 }}>
                                {hoverSeg.label}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--sr-primary)' }}>
                                {(hoverSeg.value * 100).toFixed(2)}%
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: 14, color: 'var(--sr-muted)', marginBottom: 4 }}>
                                SR Votes
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--sr-primary)' }}>
                                Overview
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ✅ Tooltip 悬浮提示 */}
            {tooltip && hoverSeg && (
                <div
                    style={{
                        position: 'absolute',
                        top: tooltip.y,
                        left: tooltip.x,
                        background: 'rgba(20, 25, 35, 0.9)',
                        color: '#fff',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 13,
                        lineHeight: 1.4,
                        whiteSpace: 'pre-line',
                        pointerEvents: 'none',
                        transform: 'translate(10px, -10px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    )
}
