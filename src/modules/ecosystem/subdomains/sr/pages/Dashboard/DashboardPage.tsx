import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation('sr');
  return (
    <div className="sr-page">
      <header className="sr-header">
        <h1 className="sr-title-neon">{t('dashboard.title')}</h1>
        <p className="sr-desc">{t('dashboard.subtitle')}</p>
      </header>

      {/* 顶部三卡片：自适应列 */}
      <section className="sr-auto-grid lg">
        <StatCard title={t('dashboard.cards.myVotes.title')} action={t('dashboard.actions.viewDetails')} />
        <StatCard title={t('dashboard.cards.estIncome.title')} action={t('dashboard.actions.viewIncome')} />
        <StatCard title={t('dashboard.cards.toClaim.title')}  action={t('dashboard.actions.claimNow')} />
      </section>

      {/* 网络状态 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('dashboard.network.title')}</div>
        </div>
        <div className="sr-auto-grid sm">
          <MetricCard label={t('dashboard.network.activeSr')} value="27" />
          <MetricCard label={t('dashboard.network.blockRate')} value="98.7%" />
          <MetricCard label={t('dashboard.network.blockHeight')} value="#47,893" />
        </div>
      </section>

      {/* 趋势图 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('dashboard.trend.title')}</div>
          <div className="sr-row sr-gap-8">
            <button className="sr-btn ghost">24h</button>
            <button className="sr-btn ghost">7d</button>
            <button className="sr-btn ghost">30d</button>
          </div>
        </div>
        {/* 用卡片占位，避免依赖未定义的占位类 */}
        <div className="sr-card" style={{height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--sr-muted)'}}>
          {t('common.chartPlaceholder')}
        </div>
      </section>

      {/* 提案概览 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('dashboard.proposalsOverview.title')}</div>
          <a href="#/ecosystem/sr/proposals">查看全部 →</a>
        </div>
        <div className="sr-auto-grid">
          <ProposalStrip />
          <ProposalStrip status="pending" />
        </div>
      </section>

      {/* 近期活动与通知 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('dashboard.activity.title')}</div>
        </div>
        <div className="sr-timeline">
          <Node t="投票成功" sub="向 TronLink 投票 50,000 TRX" />
          <Node t="奖励到账" sub="获得 125.50 TRX 投票奖励" />
          <Node t="系统通知" sub="新的治理提案已发布" />
        </div>
      </section>

      {/* 新闻与更新 */}
      <section className="sr-panel">
        <div className="sr-panel__head">
          <div className="sr-panel__title">{t('dashboard.news.title')}</div>
        </div>
        <div className="sr-auto-grid">
          <NewsCard tag="官方公告" title="TRON 网络升级完成，性能提升 30%" />
          <NewsCard tag="社区教程" title="如何优化您的 SR 投票策略" />
        </div>
      </section>
    </div>
  );
}

/* ------- 子组件（统一 sr- 前缀） ------- */

function StatCard({ title, action }: { title: string; action: string }) {
  return (
    <div className="sr-card sr-card-neon">
      <div className="sr-card__title">{title}</div>
      <div className="sr-number-big">—</div>
      <button className="sr-btn">{action}</button>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="sr-card">
      <div className="sr-muted">{label}</div>
      <div className="sr-number-xl">{value}</div>
    </div>
  );
}

function ProposalStrip({ status = 'running' }: { status?: 'running' | 'pending' }) {
  return (
    <div className="sr-card">
      <div className="sr-row sr-space-between" style={{ marginBottom: 8 }}>
        <div className="sr-muted">#2025-0904-001</div>
        <span className={'sr-badge ' + (status === 'running' ? 'success' : '')}>
          {status === 'running' ? '进行中' : '等待中'}
        </span>
      </div>
      <div className="sr-card__title">提案：网络拥塞优化</div>
      <div className="sr-progress">
        <div className="sr-progress__bar" style={{ width: status === 'running' ? '73%' : '45%' }} />
      </div>
      <div className="sr-row sr-gap-8">
        <button className="sr-btn primary">支持</button>
        <button className="sr-btn ghost">反对</button>
      </div>
    </div>
  );
}

function Node({ t, sub }: { t: string; sub: string }) {
  return (
    <div className="sr-node">
      <div className="sr-node__dot" />
      <div className="sr-node__body">
        <div className="sr-node__title">{t}</div>
        <div className="sr-muted">{sub}</div>
      </div>
    </div>
  );
}

function NewsCard({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="sr-card">
      <div className="sr-badge">{tag}</div>
      <div className="sr-card__title" style={{ marginTop: 8 }}>{title}</div>
      <div className="sr-muted">这是新闻摘要内容，用于展示列表中的简介文本…</div>
    </div>
  );
}
