type DonutItem = { label: string; value: number; color: string }

type DonutProps = {
    data: DonutItem[]
    /** 圆心要显示的总金额（例如 overview.totalUSD） */
    total?: number
    /** 圆心标题文字 */
    centerLabel?: string
    /** 金额格式化函数，默认按本地货币格式 */
    format?: (n: number) => string
}

export default function Donut({
                                  data,
                                  total = 0,
                                  centerLabel = '总价值',
                                  format = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
                              }: DonutProps) {
    const items: DonutItem[] = data?.length
        ? data
        : [
            { label: 'Bitcoin (BTC)', value: 70, color: '#41bdf7' },
            { label: 'Ethereum (ETH)', value: 30, color: '#19c37d' },
        ]

    const sum = items.reduce((s, i) => s + (Number(i.value) || 0), 0)
    const safeSum = sum > 0 ? sum : 1 // 防止除零
    let acc = 0

    const segments = items.map((i) => {
        const start = (acc / safeSum) * 360
        acc += Number(i.value) || 0
        const end = (acc / safeSum) * 360
        return { start, end, color: i.color }
    })

    return (
        <div style={{ width: 260, height: 260, borderRadius: '50%', position: 'relative' }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                {segments.map((s, idx) => {
                    const r = 16, cx = 18, cy = 18
                    const start = polar(cx, cy, r, s.start)
                    const end = polar(cx, cy, r, s.end)
                    const large = s.end - s.start > 180 ? 1 : 0
                    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
                    return <path key={idx} d={d} fill={s.color} opacity={0.85} />
                })}
            </svg>

            {/* 中心显示层 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, transparent 52%, var(--bg-elevated) 53%)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div className="secondary" style={{ fontSize: 12 }}>{centerLabel}</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>
                        {format(Number.isFinite(total) ? total : 0)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function polar(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
