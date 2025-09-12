import { useTranslation } from 'react-i18next';

export default function AnalyticsPage() {
    const { t } = useTranslation('sr');

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="title-neon">{t('analytics.title')}</h1>
                <p className="desc">{t('analytics.subtitle')}</p>
            </header>

            <section className="grid grid-3 gap-16">
                <Kpi title={t('analytics.kpi.totalVotes')} value="2,847,392,156" />
                <Kpi title={t('analytics.kpi.totalStakeRate')} value="67.8%" />
                <Kpi title={t('analytics.kpi.avgApy')} value="4.12%" />
            </section>

            <section className="panel">
                <div className="panel__title">{t('analytics.distribution.title')}</div>
                <div className="row gap-16">
                    <div className="card flex-1">
                        <div className="chart-placeholder" style={{ height: 240 }} />
                    </div>
                    <div className="card" style={{ width: 360 }}>
                        <div className="card__title">{t('analytics.distribution.ranking')}</div>
                        <ul className="list">
                            <li>TRON Foundation — 15.2%</li>
                            <li>Binance Staking — 12.8%</li>
                            <li>Huobi Staking — 8.9%</li>
                            <li>其他SR — 63.1%</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="panel">
                <div className="panel__head">
                    <div className="panel__title">{t('analytics.trends.title')}</div>
                    <button className="btn ghost">{t('analytics.trends.range')}</button>
                </div>
                <div className="chart-placeholder" style={{ height: 260 }} />
                <div className="grid grid-4 gap-16" style={{ marginTop: 12 }}>
                    <Kpi small title={t('analytics.trends.maxStakeRate')} value="69.2%" />
                    <Kpi small title={t('analytics.trends.minStakeRate')} value="66.8%" />
                    <Kpi small title={t('analytics.trends.maxApy')} value="4.35%" />
                    <Kpi small title={t('analytics.trends.minApy')} value="3.98%" />
                </div>
            </section>

            <section className="panel">
                <div className="panel__head">
                    <div className="panel__title">{t('analytics.userHistory.title')}</div>
                    <div className="row gap-8">
                        <button className="btn">{t('common.filter')}</button>
                        <button className="btn ghost">{t('common.export')}</button>
                    </div>
                </div>
                <div className="table">
                    <div className="table__row head">
                        <div>投票时间</div><div>目标SR</div><div>投票数量</div><div>预计收益</div><div>状态</div><div>操作</div>
                    </div>
                    {[
                        ['2025-01-15 14:32','TRON Foundation','1,250,000','+142.5 TRX','活跃','👁'],
                        ['2025-01-12 09:15','Binance Staking','800,000','+89.6 TRX','活跃','👁'],
                        ['2025-01-08 16:45','Huobi Staking','500,000','+55.2 TRX','待确认','👁']
                    ].map((r,i)=>(
                        <div key={i} className="table__row">
                            {r.map((c,ci)=><div key={ci}>{c}</div>)}
                        </div>
                    ))}
                </div>
                <div className="center" style={{ marginTop: 12 }}>
                    <div className="pagination">
                        <button className="btn ghost">«</button>
                        <button className="btn active">1</button>
                        <button className="btn ghost">2</button>
                        <button className="btn ghost">3</button>
                        <button className="btn ghost">»</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Kpi({ title, value, small }:{title:string; value:string; small?:boolean}) {
    return (
        <div className={'card' + (small?' small':'')}>
            <div className="muted">{title}</div>
            <div className="number-xl">{value}</div>
        </div>
    );
}
