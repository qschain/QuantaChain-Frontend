import { useTranslation } from 'react-i18next';

export default function RewardsPage() {
    const { t } = useTranslation('sr');

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="title-neon">{t('rewards.title')}</h1>
            </header>

            <section className="grid grid-3 gap-16">
                <MiniCard title={t('rewards.cards.total')} value="1,234,567 TRX" />
                <MiniCard title={t('rewards.cards.lastTime')} value="2025-09-03 14:30" />
                <MiniCard title={t('rewards.cards.pending')} value="8,888 TRX" />
            </section>

            <section className="panel">
                <div className="panel__head">
                    <div className="panel__title">{t('rewards.table.title')}</div>
                    <div className="row gap-8">
                        <button className="btn">{t('rewards.filters.byDate')}</button>
                        <button className="btn ghost">{t('rewards.filters.byType')}</button>
                    </div>
                </div>
                <div className="table">
                    <div className="table__row head">
                        <div>奖励日期</div><div>SR 名称</div><div>奖励金额 (TRX)</div><div>状态</div><div>详情</div>
                    </div>
                    {[
                        ['2025-09-03 14:30','TronLink','+543.21','已领取','—'],
                        ['2025-09-02 11:15','Binance Staking','+602.78','已领取','—'],
                        ['2025-09-01 08:00','Poloniex','+150.00','待领取','—'],
                    ].map((r,i)=>(
                        <div key={i} className="table__row">
                            {r.map((c,ci)=><div key={ci}>{c}</div>)}
                        </div>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel__title">{t('rewards.simulator.title')}</div>
                <div className="grid grid-2 gap-16">
                    <div className="card">
                        <label className="label">{t('rewards.simulator.inputs.amount')}</label>
                        <input className="input" placeholder="100000" />
                        <label className="label">{t('rewards.simulator.inputs.sr')}</label>
                        <select className="input"><option>选择一个超级代表</option></select>
                        <label className="label">{t('rewards.simulator.inputs.lock')}</label>
                        <select className="input"><option>不锁仓</option></select>
                        <button className="btn primary" style={{ marginTop: 12 }}>
                            {t('rewards.simulator.actions.simulate')}
                        </button>
                    </div>
                    <div className="card">
                        <div className="card__title">{t('rewards.simulator.result.title')}</div>
                        <div className="chart-placeholder" style={{ height: 220 }} />
                        <div className="muted note">{t('rewards.simulator.note')}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
function MiniCard({ title, value }:{title:string; value:string}) {
    return (
        <div className="card">
            <div className="muted">{title}</div>
            <div className="number-xl">{value}</div>
        </div>
    );
}
