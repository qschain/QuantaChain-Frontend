import React from 'react'
import { useTranslation } from 'react-i18next'
import useWitnessStatistics from '../../hooks/useWitnessStatistics'
import NeonDualLineChart from './NeonDualLineChart'

export default function TrendsPanel() {
    const { t } = useTranslation('sr')
    const { days, setDays, loading, error, stats, kpi, refresh } = useWitnessStatistics(7)

    return (
        <section className="sr-panel">
            <div className="sr-panel__head">
                <div>
                    <div className="sr-panel__title">{t('analytics.trends.title')}</div>
                    <div className="sr-muted" style={{ marginTop: 4 }}>{t('analytics.subtitle')}</div>
                </div>
                <div className="sr-row sr-gap-8">
                    {[7, 30, 90].map(d => (
                        <button
                            key={d}
                            className={`sr-chip ${d===days ? 'sr-btn active' : ''}`}
                            onClick={() => setDays(d)}
                            style={{ height: 32 }}
                        >
                            {d===7 ? '过去7天' : d===30 ? '过去30天' : '过去90天'}
                        </button>
                    ))}
                    <button className="sr-btn ghost" onClick={refresh}>↻</button>
                </div>
            </div>

            {/* 图表/占位/错误 */}
            <div className="sr-card" style={{ padding: 16 }}>
                {error ? (
                    <div className="sr-badge danger">{error}</div>
                ) : loading ? (
                    <div className="sr-skeleton" style={{ height: 260 }}>
                        <div className="sr-skel-line" style={{ height: 260 }} />
                    </div>
                ) : stats && stats.points.length ? (
                    <NeonDualLineChart data={stats.points} height={260} />
                ) : (
                    <div className="sr-center" style={{ height: 220, color:'var(--sr-muted)' }}>
                        {t('common.chartPlaceholder')}
                    </div>
                )}
            </div>

            {/* KPI 四格 */}
            <div className="sr-auto-grid" style={{ marginTop: 12 }}>
                <KpiCard title={t('analytics.trends.maxStakeRate')} value={kpi?.maxFreeze ?? '—'} accent="cyan" />
                <KpiCard title={t('analytics.trends.minStakeRate')} value={kpi?.minFreeze ?? '—'} accent="cyan" />
                <KpiCard title={t('analytics.trends.maxApy')} value={kpi?.maxApy ?? '—'} accent="violet" />
                <KpiCard title={t('analytics.trends.minApy')} value={kpi?.minApy ?? '—'} accent="violet" />
            </div>
        </section>
    )
}

function KpiCard({ title, value, accent }:{ title:string; value:string; accent:'cyan'|'violet' }) {
    const bar = accent==='cyan'
        ? 'linear-gradient(90deg,#00e5ff,#05ffd2)'
        : 'linear-gradient(90deg,#a78bfa,#7c3aed)'
    return (
        <div className="sr-card" style={{ position:'relative' }}>
            <div className="sr-muted">{title}</div>
            <div className="sr-number-md" style={{ marginTop: 4 }}>{value}</div>
            <div style={{
                position:'absolute', left:12, right:12, bottom:10, height:3,
                background: bar, borderRadius: 999
            }} />
        </div>
    )
}
