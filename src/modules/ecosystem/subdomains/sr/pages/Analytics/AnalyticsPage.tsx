import { useTranslation } from 'react-i18next';

export default function AnalyticsPage() {
  const { t } = useTranslation('sr');

  return (
    <div className="sr-page">
      <header className="sr-header">
        <h1 className="title-neon">{t('analytics.title')}</h1>
        <p className="desc">{t('analytics.subtitle')}</p>
      </header>

      {/* 顶部 KPI：自适应列 */}
      <section className="sr-auto-grid lg">
        <Kpi title={t('analytics.kpi.totalVotes')} value="2,847,392,156" />
        <Kpi title={t('analytics.kpi.totalStakeRate')} value="67.8%" />
        <Kpi title={t('analytics.kpi.avgApy')} value="4.12%" />
      </section>

      {/* 分布：左图右榜 */}
      <section className="sr-panel">
        <div className="sr-panel__title">{t('analytics.distribution.title')}</div>
        <div className="sr-row sr-gap-16">
          <div className="sr-card sr-flex-1">
            <div className="chart-placeholder" style={{ height: 240 }} />
          </div>
          <div className="sr-card" style={{ width: 360 }}>
            <div className="sr-card__title">{t('analytics.distribution.ranking')}</div>
            <ul style={{ margin: '8px 0 0 14px', lineHeight: 1.9, color: 'var(--sr-text)' }}>
              <li>TRON Foundation — 15.2%</li>
              <li>Binance Staking — 12.8%</li>
              <li>Huobi Staking — 8.9%</li>
              <li>其他SR — 63.1%</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 趋势 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('analytics.trends.title')}</div>
          <button className="sr-btn ghost">{t('analytics.trends.range')}</button>
        </div>
        <div className="chart-placeholder" style={{ height: 260 }} />
        <div className="sr-auto-grid" style={{ marginTop: 12 }}>
          <Kpi small title={t('analytics.trends.maxStakeRate')} value="69.2%" />
          <Kpi small title={t('analytics.trends.minStakeRate')} value="66.8%" />
          <Kpi small title={t('analytics.trends.maxApy')} value="4.35%" />
          <Kpi small title={t('analytics.trends.minApy')} value="3.98%" />
        </div>
      </section>

      {/* 历史记录（表格 6 列） */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('analytics.userHistory.title')}</div>
          <div className="sr-row sr-gap-8">
            <button className="sr-btn">{t('common.filter')}</button>
            <button className="sr-btn ghost">{t('common.export')}</button>
          </div>
        </div>

        <div className="sr-table">
          {/* 表头：6 列 */}
          <div
            className="sr-table__row head"
            style={{ gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr .8fr' }}
          >
            <div>投票时间</div>
            <div>目标SR</div>
            <div>投票数量</div>
            <div>预计收益</div>
            <div>状态</div>
            <div>操作</div>
          </div>

          {[
            ['2025-01-15 14:32','TRON Foundation','1,250,000','+142.5 TRX','活跃','👁'],
            ['2025-01-12 09:15','Binance Staking','800,000','+89.6 TRX','活跃','👁'],
            ['2025-01-08 16:45','Huobi Staking','500,000','+55.2 TRX','待确认','👁']
          ].map((r,i)=>(
            <div
              key={i}
              className="sr-table__row"
              style={{ gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr .8fr' }}
            >
              {r.map((c,ci)=><div key={ci}>{c}</div>)}
            </div>
          ))}
        </div>

        {/* 翻页：用行+间距代替旧的 .pagination */}
        <div className="sr-center" style={{ marginTop: 12 }}>
          <div className="sr-row sr-gap-8">
            <button className="sr-btn ghost">«</button>
            <button className="sr-btn active">1</button>
            <button className="sr-btn ghost">2</button>
            <button className="sr-btn ghost">3</button>
            <button className="sr-btn ghost">»</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Kpi({ title, value, small }:{title:string; value:string; small?:boolean}) {
  return (
    <div className="sr-card">
      <div className="sr-muted">{title}</div>
      <div className={small ? 'sr-number-md' : 'sr-number-xl'}>{value}</div>
    </div>
  );
}
