import React, { useMemo } from 'react'
import { useCycleCountdown } from './useCycleCountdown'

type Props = {
    nextTime?: string
    cycleHours?: number
    size?: number
    strokeWidth?: number
    label?: string
}

export default function TronPulseCoreRing({
                                              nextTime,
                                              cycleHours = 6,
                                              size = 180,          // 稍微放大默认尺寸
                                              strokeWidth = 14,    // 加宽：更厚实的环
                                              label,
                                          }: Props) {
    const { progress, leftText, percent } = useCycleCountdown(nextTime, cycleHours)

    // 半径/周长
    const r = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth])
    const C = useMemo(() => 2 * Math.PI * r, [r])
    const dash = useMemo(() => `${C * progress} ${C}`, [C, progress])

    // 渐变与滤镜 id
    const gradId = useMemo(() => `sr-grad-${Math.random().toString(36).slice(2)}`, [])
    const glowId = useMemo(() => `sr-glow-${Math.random().toString(36).slice(2)}`, [])

    // 进度头部坐标（-90° 让 0% 从正上方开始）
    const angle = progress * 360 - 90
    const rad = (angle * Math.PI) / 180
    const headX = size / 2 + r * Math.cos(rad)
    const headY = size / 2 + r * Math.sin(rad)

    return (
        <div className="sr-ring sr-ring--pulse" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    {/* 主渐变：蓝 -> 品红 */}
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"  stopColor="var(--sr-primary)" />
                        <stop offset="100%" stopColor="var(--sr-danger)" />
                    </linearGradient>
                    {/* 柔光滤镜 */}
                    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 背景玻璃环 */}
                <circle
                    cx={size/2} cy={size/2} r={r}
                    className="sr-ring__bg"
                    strokeWidth={strokeWidth}
                />

                {/* 前景进度环（渐变+发光） */}
                <g filter={`url(#${glowId})`}>
                    <circle
                        cx={size/2} cy={size/2} r={r}
                        className="sr-ring__fg"
                        stroke={`url(#${gradId})`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={dash}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size/2} ${size/2})`}
                    />
                </g>

                {/* ===== 充能波纹头部 =====
            在进度头部位置叠加多层扩散的圆圈，形成“能量向外涌动”的效果 */}
                <g className="sr-ring__ripples" transform={`translate(${headX}, ${headY})`}>
                    {/* 三层相位错开的涟漪（循环动画） */}
                    <circle className="sr-ripple r1" r={strokeWidth * 0.5} />
                    <circle className="sr-ripple r2" r={strokeWidth * 0.5} />
                    <circle className="sr-ripple r3" r={strokeWidth * 0.5} />
                    {/* 中心亮核（更有能量感） */}
                    <circle className="sr-ripple-core" r={strokeWidth * 0.55} />
                </g>
            </svg>

            {/* 顶部小标题（可选） */}
            {label ? <div className="sr-ring__label">{label}</div> : null}

            {/* 中心读数：保证完全居中 */}
            <div className="sr-ring__center">
                <div className="sr-ring__time">{leftText}</div>
                <div className="sr-ring__percent">{percent}%</div>
            </div>
        </div>
    )
}
