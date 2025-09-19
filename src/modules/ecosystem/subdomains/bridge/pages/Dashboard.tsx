import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../api/bridgeApi';

type ChainAsset = {
    chain: string;
    symbol: string;
    amount: string;
    usd: string;
    share: string; // e.g. '36.5%'
    icon?: string;
};
type Portfolio = {
    totalUsd: string;   // '$123,456.78'
    totalInTrx: string; // '≈ 1,543,210.99 TRX'
    chains: ChainAsset[];
};

type TxItem = {
    id: string;
    asset: string;     // '1,000 USDT'
    path: string;      // 'TRON → Ethereum'
    time: string;      // '2小时前'
    status: 'success' | 'processing' | 'failed';
    txHash: string;
};

export default function Dashboard() {
    const { t, i18n } = useTranslation('bridge');

    const [pf, setPf] = useState<Portfolio | null>(null);
    const [txs, setTxs] = useState<TxItem[]>([]);
    const [tab, setTab] = useState<'all' | 'success' | 'failed' | 'processing'>('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [p, r] = await Promise.all([api.getPortfolio(), api.getRecentTxs()]);
                setPf(p);
                setTxs(r.items);
            } finally {
                setLoading(false);
            }
        })();
    }, [i18n.language]);

    const filtered = useMemo(() => {
        if (tab === 'all') return txs;
        return txs.filter(x => x.status === tab);
    }, [txs, tab]);

    const refresh = async () => {
        setLoading(true);
        try {
            const p = await api.getPortfolio({ bypassMock: true }); // 支持真实/混合请求
            setPf(p);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bridge-dashboard">
            {/* 页头 */}
            <div className="bridge-page-title">
                <div className="title">{t('title')}</div>
                <div className="sub">{t('subtitle')}</div>
            </div>

            {/* 总资产卡（左） + 资产分布圈图（右/占位） */}
            <section className="bridge-panel neon">
                <div className="bridge-panel-grid">
                    {/* 左侧：资产列表 */}
                    <div className="bridge-portfolio">
                        <div className="row between">
                            <div className="card-title">{t('portfolio.title')}</div>
                            <button className="icon-btn" onClick={refresh} title={t('actions.refresh')!}>⟳</button>
                        </div>

                        <div className="total">
                            <div className="total-usd">{pf?.totalUsd ?? '--'}</div>
                            <div className="total-trx">{pf?.totalInTrx ?? ''}</div>
                        </div>

                        <button className="btn primary">{t('actions.smartSwap')}</button>

                        <div className="chain-list">
                            {pf?.chains.map((c) => (
                                <div className="chain-row" key={c.chain}>
                                    <div className="chain-left">
                                        <div className="chain-icon">{c.icon ?? c.chain.slice(0,2)}</div>
                                        <div className="chain-meta">
                                            <div className="chain-name">{c.chain}</div>
                                            <div className="chain-amt">
                                                {c.amount} {c.symbol}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chain-right">
                                        <div className="usd">{c.usd}</div>
                                        <div className="share">{t('portfolio.share', { val: c.share })}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="muted small" style={{marginTop:8}}>{t('portfolio.more')}</div>
                    </div>

                    {/* 右侧：分布图占位（你后续可换成实际图表） */}
                    <div className="bridge-chart">
                        <div className="chart-placeholder">
                            <div className="chart-title">{t('chart.title')}</div>
                            <div className="chart-big">{t('chart.chains', { count: pf?.chains.length ?? 0 })}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 近期跨链活动 */}
            <section className="bridge-panel">
                <div className="row between">
                    <div className="card-title">{t('recent.title')}</div>
                    <div className="tabs">
                        {(['all','success','failed','processing'] as const).map(k => (
                            <button
                                key={k}
                                className={`tab ${tab===k?'active':''}`}
                                onClick={() => setTab(k)}
                            >
                                {t(`recent.tabs.${k}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="table">
                    <div className="thead">
                        <div className="th w200">{t('recent.cols.asset')}</div>
                        <div className="th">{t('recent.cols.path')}</div>
                        <div className="th w140">{t('recent.cols.time')}</div>
                        <div className="th w120">{t('recent.cols.status')}</div>
                        <div className="th w220">{t('recent.cols.hash')}</div>
                    </div>

                    <div className="tbody">
                        {filtered.map((r) => (
                            <div className="tr" key={r.id}>
                                <div className="td w200">
                                    <span className="bubble">◎</span> {r.asset}
                                </div>
                                <div className="td">{r.path}</div>
                                <div className="td w140">{r.time}</div>
                                <div className="td w120">
                  <span className={`badge ${r.status}`}>
                    {r.status==='success' ? t('status.success'):
                        r.status==='processing' ? t('status.processing'):
                            t('status.failed')}
                  </span>
                                </div>
                                <div className="td w220">
                                    <code className="hash">{r.txHash}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {loading ? <div className="loading-mask">{t('common.loading')}</div> : null}
        </div>
    );
}
