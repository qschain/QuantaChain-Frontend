import { useTranslation } from 'react-i18next';

export default function RewardsPage() {
  const { t } = useTranslation('sr');

  return (
    <div className="sr-page">
      <header className="sr-header">
        <h1 className="sr-title-neon">{t('rewards.title')}</h1>
      </header>

      {/* 顶部三张卡片 */}
      <section className="sr-auto-grid lg sr-gap-16">
        <MiniCard title={t('rewards.cards.total')} value="1,234,567 TRX" />
        <MiniCard title={t('rewards.cards.lastTime')} value="2025-09-03 14:30" />
        <MiniCard title={t('rewards.cards.pending')} value="8,888 TRX" />
      </section>

      {/* 奖励明细表格 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('rewards.table.title')}</div>
          <div className="sr-row sr-gap-8">
            <button className="sr-btn">{t('rewards.filters.byDate')}</button>
            <button className="sr-btn ghost">{t('rewards.filters.byType')}</button>
          </div>
        </div>
        <div className="sr-table">
          <div
            className="sr-table__row head"
            style={{ gridTemplateColumns: '1.6fr 2fr 1.4fr 1fr .8fr' }}
          >
            <div>奖励日期</div>
            <div>SR 名称</div>
            <div>奖励金额 (TRX)</div>
            <div>状态</div>
            <div>详情</div>
          </div>
          {[
            ['2025-09-03 14:30','TronLink','+543.21','已领取','—'],
            ['2025-09-02 11:15','Binance Staking','+602.78','已领取','—'],
            ['2025-09-01 08:00','Poloniex','+150.00','待领取','—'],
          ].map((r,i)=>(
            <div
              key={i}
              className="sr-table__row"
              style={{ gridTemplateColumns: '1.6fr 2fr 1.4fr 1fr .8fr' }}
            >
              {r.map((c,ci)=><div key={ci}>{c}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* 奖励模拟器 */}
      <section className="sr-panel">
        <div className="sr-panel__title">{t('rewards.simulator.title')}</div>
        <div className="sr-auto-grid sr-gap-16">
          {/* 输入面板 */}
          <div className="sr-card">
            <label className="sr-label">{t('rewards.simulator.inputs.amount')}</label>
            <input className="sr-input" placeholder="100000" />
            <label className="sr-label">{t('rewards.simulator.inputs.sr')}</label>
            <select className="sr-input"><option>选择一个超级代表</option></select>
            <label className="sr-label">{t('rewards.simulator.inputs.lock')}</label>
            <select className="sr-input"><option>不锁仓</option></select>
            <button className="sr-btn primary" style={{ marginTop: 12 }}>
              {t('rewards.simulator.actions.simulate')}
            </button>
          </div>

          {/* 结果面板 */}
          <div className="sr-card">
            <div className="sr-card__title">{t('rewards.simulator.result.title')}</div>
            <div className="chart-placeholder" style={{ height: 220 }} />
            <div className="sr-muted sr-note">{t('rewards.simulator.note')}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniCard({ title, value }:{title:string; value:string}) {
  return (
    <div className="sr-card">
      <div className="sr-muted">{title}</div>
      <div className="sr-number-xl">{value}</div>
    </div>
  );
}
