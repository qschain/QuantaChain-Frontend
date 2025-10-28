import { useTranslation } from 'react-i18next'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'
import { useNavigate } from 'react-router-dom'
import useAccountSummary from '../../hooks/useAccountSummary'
import useWitnessOverview from '../../hooks/useWitnessOverview'
import PieDonut from '../../components/analystic/PieDonut'
import TrendsPanel from '../../components/analystic/TrendsPanel'

export default function AnalyticsPage() {
    const { t } = useTranslation('sr')
    const { user } = useSession()
    const navigate = useNavigate()

    const { loading: accLoading, error: accError, voteTotal, pendingTRX } = useAccountSummary(user?.name)
    const { loading: wLoading, error: wError, sumVotes, freezeRatePct, avgApyPct, top10, othersPct, segments } = useWitnessOverview()

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="sr-title-neon">{t('analytics.title')}</h1>
                <p className="sr-desc">{t('analytics.subtitle')}</p>
            </header>

            {(accError || wError) ? <div className="sr-badge danger" style={{ marginBottom: 12 }}>{accError || wError}</div> : null}

            {/* 顶部 KPI */}
            <section className="sr-auto-grid lg">
                <StatCard title={t('analytics.kpi.totalVotes')} value={wLoading ? undefined : (sumVotes || 0).toLocaleString()} loading={wLoading}/>
                <StatCard title={t('analytics.kpi.totalStakeRate')} value={wLoading ? undefined : freezeRatePct} loading={wLoading}/>
                <StatCard title={t('analytics.kpi.avgApy')} value={wLoading ? undefined : avgApyPct} loading={wLoading}/>
            </section>

            {/* 分布+榜单 */}
            <section className="sr-panel">
                <div className="sr-panel__title">{t('analytics.distribution.title')}</div>
                <div className="sr-row sr-gap-16">
                    <div className="sr-card sr-flex-1">
                        {wLoading ? (
                            <div className="sr-skeleton" style={{ height: 240 }}><div className="sr-skel-line" style={{ height: 240 }} /></div>
                        ) : (
                            <PieDonut segments={segments} size={260} hole={80} showCenter />
                        )}
                    </div>
                    <div className="sr-card" style={{ width: 360 }}>
                        <div className="sr-card__title">{t('analytics.distribution.ranking')}</div>
                        {wLoading ? (
                            <div className="sr-skeleton" style={{ marginTop: 8 }}>
                                <div className="sr-skel-line" style={{ height: 16, margin: '8px 0' }} />
                                <div className="sr-skel-line" style={{ height: 16, margin: '8px 0' }} />
                                <div className="sr-skel-line" style={{ height: 16, margin: '8px 0' }} />
                            </div>
                        ) : (
                            <ul style={{ margin: '8px 0 0 14px', lineHeight: 1.9, color: 'var(--sr-text)' }}>
                                {top10.map((r, i) => (<li key={i}>{r.name} — {r.pct.toFixed(1)}%</li>))}
                                {othersPct > 0 ? <li>Others — {othersPct.toFixed(1)}%</li> : null}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* 质押率与APY趋势（霓虹玻璃折线图 + KPI） */}
            <TrendsPanel />

            {/* 新闻（保留框架） */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('dashboard.news.title')}</div>
                </div>
            </section>
        </div>
    )
}

function StatCard({ title, value, loading, unit = '' }: { title: string; value?: string; loading?: boolean; unit?: string }) {
    return (
        <div className="sr-card sr-card-neon">
            <div className="sr-card__title">{title}</div>
            {loading ? (
                <div className="sr-skeleton" style={{ margin: '6px 0 12px' }}>
                    <div className="sr-skel-line" style={{ height: 32, width: '60%' }} />
                </div>
            ) : (
                <div className="sr-number-big">{value ?? '—'}{value ? unit : ''}</div>
            )}
        </div>
    )
}
