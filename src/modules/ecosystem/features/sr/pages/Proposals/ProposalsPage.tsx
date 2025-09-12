import { useTranslation } from 'react-i18next';

export default function ProposalsPage() {
    const { t } = useTranslation('sr');

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="title-neon">{t('proposals.title')}</h1>
            </header>

            <div className="toolbar">
                <button className="btn">{t('proposals.filters.status')}</button>
                <button className="btn">{t('proposals.filters.type')}</button>
                <button className="btn">{t('proposals.filters.progress')}</button>
                <button className="btn ghost">{t('proposals.filters.sort')}</button>
                <div className="flex-1" />
                <input className="input" placeholder={t('proposals.searchPlaceholder')!} />
                <button className="btn">{t('common.search')}</button>
            </div>

            <div className="grid grid-3 gap-16">
                {Array.from({length:9}).map((_,i)=><ProposalCard key={i} i={i} />)}
            </div>

            <div className="center" style={{ marginTop: 12 }}>
                <div className="pagination">
                    <button className="btn ghost">«</button>
                    <button className="btn active">1</button>
                    <button className="btn ghost">2</button>
                    <button className="btn ghost">…</button>
                    <button className="btn ghost">12</button>
                    <button className="btn ghost">»</button>
                </div>
            </div>
        </div>
    );
}

function ProposalCard({ i }:{i:number}) {
    const states = ['进行中','已通过','已拒绝'] as const;
    const s = states[i % states.length];
    return (
        <div className="card">
            <div className="row space-between">
                <div className="muted">#{20250901 + i}</div>
                <span className={'badge ' + (s==='进行中'?'success': s==='已通过'?'info':'danger')}>{s}</span>
            </div>
            <div className="card__title">提案标题占位 {i+1}</div>
            <div className="muted">发起人：TDev · 时间：2025-09-01 ~ 2025-09-10</div>
            <div className="progress"><div className="progress__bar" style={{ width: `${30 + (i*7)%60}%` }} /></div>
            <div className="row gap-8">
                <button className="btn primary">参与投票</button>
                <button className="btn ghost">查看结果</button>
            </div>
        </div>
    );
}
