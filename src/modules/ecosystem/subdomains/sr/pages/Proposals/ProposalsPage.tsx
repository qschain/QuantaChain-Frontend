import { useTranslation } from 'react-i18next';

export default function ProposalsPage() {
  const { t } = useTranslation('sr');

  return (
    <div className="sr-page">
      <header className="sr-header">
        <h1 className="sr-title-neon">{t('proposals.title')}</h1>
      </header>

      {/* 工具栏 */}
      <div className="sr-toolbar">
        <button className="sr-btn">{t('proposals.filters.status')}</button>
        <button className="sr-btn">{t('proposals.filters.type')}</button>
        <button className="sr-btn">{t('proposals.filters.progress')}</button>
        <button className="sr-btn ghost">{t('proposals.filters.sort')}</button>
        <div className="sr-flex-1" />
        <input
          className="sr-input"
          placeholder={t('proposals.searchPlaceholder')!}
        />
        <button className="sr-btn">{t('common.search')}</button>
      </div>

      {/* 提案列表：自适应网格 */}
      <div className="sr-auto-grid lg sr-gap-16">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProposalCard key={i} i={i} />
        ))}
      </div>

      {/* 翻页 */}
      <div className="sr-center" style={{ marginTop: 12 }}>
        <div className="sr-row sr-gap-8">
          <button className="sr-btn ghost">«</button>
          <button className="sr-btn active">1</button>
          <button className="sr-btn ghost">2</button>
          <button className="sr-btn ghost">…</button>
          <button className="sr-btn ghost">12</button>
          <button className="sr-btn ghost">»</button>
        </div>
      </div>
    </div>
  );
}

function ProposalCard({ i }: { i: number }) {
  const states = ['进行中', '已通过', '已拒绝'] as const;
  const s = states[i % states.length];

  return (
    <div className="sr-card">
      <div className="sr-row sr-space-between" style={{ marginBottom: 6 }}>
        <div className="sr-muted">#{20250901 + i}</div>
        <span
          className={
            'sr-badge ' +
            (s === '进行中'
              ? 'success'
              : s === '已通过'
              ? 'info'
              : 'danger')
          }
        >
          {s}
        </span>
      </div>

      <div className="sr-card__title">提案标题占位 {i + 1}</div>
      <div className="sr-muted">
        发起人：TDev · 时间：2025-09-01 ~ 2025-09-10
      </div>

      <div className="sr-progress" style={{ margin: '8px 0' }}>
        <div
          className="sr-progress__bar"
          style={{ width: `${30 + (i * 7) % 60}%` }}
        />
      </div>

      <div className="sr-row sr-gap-8">
        <button className="sr-btn primary">参与投票</button>
        <button className="sr-btn ghost">查看结果</button>
      </div>
    </div>
  );
}
