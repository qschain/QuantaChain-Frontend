import {ProposalItem} from "../../shared/api/srApi";

type OverlayProps = { p: ProposalItem; t: any }

export default function ProposalOverlay({ p, t }: OverlayProps) {
    const status = (p.status || '').toUpperCase()
    const { start, end } = parseTimeRange(p.time)
    const prog = calcPercent(p.percent)
    const badgeClass = status.includes('DISAPPROVED') ? 'danger'
        : status.includes('APPROVED')   ? 'success'
            : 'info'

    return (
        <section id={`prop-${p.number}`} className="sr-prop-overlay">
            <div className="sr-prop-dialog">
                <div className="sr-prop-dlg-head">
                    <div>
                        <div className="sr-prop-title">#{p.number}</div>
                        <div className="sr-prop-sub">{p.proposer || '-'}</div>
                    </div>
                    <a href="#" className="sr-btn ghost">{t('common.close')}</a>
                </div>

                <div className="sr-card__title" style={{ marginBottom: 8 }}>{p.content || '-'}</div>

                <div className="sr-prop-meta">
                    <span className={`sr-badge ${badgeClass}`}>{(t('common.status') ?? 'Status') + ': ' + (status || '-')}</span>
                    <span className="sr-badge">{`k=${p.k || '-'}`}</span>
                    <span className="sr-badge">{`v=${p.value || '-'}`}</span>
                    <span className="sr-badge">{(t('list.realtimeVotes') ?? 'Votes') + ': ' + (p.percent || '-')}</span>
                    <span className="sr-badge">{(t('common.date') ?? 'Date') + ': ' + ((start || '?') + ' ~ ' + (end || '?'))}</span>
                </div>

                <div className="sr-progress" style={{ margin: '8px 0' }}>
                    <div className="sr-progress__bar" style={{ width: `${prog}%` }} />
                </div>
                <div className="sr-row sr-space-between">
                    <div className="sr-muted">{p.percent || '-'}</div>
                    <div className="sr-number-md">{prog.toFixed(1)}%</div>
                </div>
            </div>
        </section>
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
