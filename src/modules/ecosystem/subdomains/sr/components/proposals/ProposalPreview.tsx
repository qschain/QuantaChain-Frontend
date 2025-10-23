import {ProposalItem} from "../../shared/api/srApi";

type Props = {
    p: ProposalItem
    t: any
    /** 详情链接（优先），例如 `/ecosystem/sr/proposals#prop-101` */
    detailHref?: string
    /** 点击回调（与 detailHref 二选一） */
    onDetailClick?: () => void
    /** 是否交互态（决定手形、文本不可选等）。默认 true */
    interactive?: boolean
    /** 是否隐藏右下角“查看详情”按钮。默认 false */
    hideDetailButton?: boolean
}

export default function ProposalPreview({
                                            p, t, detailHref, onDetailClick, interactive = true, hideDetailButton = false
                                        }: Props) {
    const badge = statusBadgeClass(p.status)
    const prog = calcPercent(p.percent)
    const { start, end } = parseTimeRange(p.time)

    return (
        <div
            className={`sr-card sr-prop-card ${interactive ? 'interactive' : ''}`}
            onClick={() => {
                if (!interactive) return
                if (hideDetailButton) {
                    if (detailHref) window.location.hash = detailHref.replace(/^.*#/, '')
                    else onDetailClick?.()
                }
            }}
        >
            <div className="sr-row sr-space-between" style={{ marginBottom: 6 }}>
                <div className="sr-muted">#{p.number}</div>
                <span className={`sr-badge ${badge}`}>{(p.status || '').toUpperCase() || '-'}</span>
            </div>

            <div
                className="sr-card__title"
                title={p.content}
                style={{
                    display:'-webkit-box',
                    WebkitLineClamp:2,
                    WebkitBoxOrient:'vertical',
                    overflow:'hidden',
                    lineHeight:'1.35',
                    marginBottom:8
                }}
            >
                {p.content || '-'}
            </div>

            <div className="sr-muted" style={{ marginBottom: 8 }}>
                {(t('rewards.simulator.inputs.sr') ?? 'SR') + '：'}{p.proposer || '-'}
            </div>

            {/*<div className="sr-progress" style={{ marginBottom: 4 }}>*/}
            {/*    <div className="sr-progress__bar" style={{ width: `${prog}%` }} />*/}
            {/*</div>*/}
            {/*<div className="sr-row sr-space-between sr-muted" style={{ fontSize:12, marginBottom: 34 }}>*/}
            {/*    <span>{p.percent || '-'}</span>*/}
            {/*    <span>{(t('common.date') ?? 'Date') + ': '}{start || '?'} ~ {end || '?'}</span>*/}
            {/*</div>*/}

            {!hideDetailButton && interactive ? (
                detailHref ? (
                    <a className="sr-btn primary sr-prop-detail-btn" href={detailHref}>
                        {t('dashboard.actions.viewDetails')}
                    </a>
                ) : (
                    <button className="sr-btn primary sr-prop-detail-btn" onClick={(e) => { e.stopPropagation(); onDetailClick?.() }}>
                        {t('dashboard.actions.viewDetails')}
                    </button>
                )
            ) : null}
        </div>
    )
}

/* 工具 */
function parseTimeRange(s?: string) {
    if (!s) return { start: '', end: '' }
    const [a, b] = String(s).split('->')
    return { start: (a || '').trim(), end: (b || '').trim() }
}
function calcPercent(p?: string) {
    if (!p) return 0
    const [x, y] = String(p).split('/').map(Number)
    if (!Number.isFinite(x) || !Number.isFinite(y) || y <= 0) return 0
    return Math.max(0, Math.min(100, (x / y) * 100))
}
function statusBadgeClass(status?: string) {
    const s = (status || '').toUpperCase()
    return s.includes('DISAPPROVED') ? 'danger'
        : s.includes('APPROVED')   ? 'success'
            : 'info'
}
