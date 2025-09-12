// src/modules/ecosystem/features/explorer/pages/ExplorerHome.tsx
import TopNav from '../../../../../app/layouts/TopNav';
import { useTranslation } from 'react-i18next';
import ExplorerHero from '../components/ExplorerHero';
import OverviewCards from '../components/OverviewCards';
import SectionHead from '../components/SectionHead';
import LiveList from '../components/LiveList';
import { useExplorerOverview } from '../hooks/useExplorerOverview';
import { useLiveStream } from '../hooks/useLiveStream';
import '../styles/explorer.css';

export default function ExplorerHome() {
    const { t } = useTranslation('explorer');
    const { overview } = useExplorerOverview();
    const blocks = useLiveStream('blocks'); // 严格裁剪前10条，新增打标
    const txs    = useLiveStream('txs');

    return (
        <div className="qc-shell">
            <TopNav />
            <div className="home-wrap with-topnav" style={{ maxWidth:1200, margin:'0 auto', padding:'24px 16px' }}>
                <ExplorerHero />

                <OverviewCards overview={overview} />

                <div style={{ textAlign:'right', marginBottom:16 }}>
                    <a className="secondary" href="/ecosystem/explorer/stats">↗ {t('overview.viewMoreStats')}</a>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <section className="card" style={{ padding:16 }}>
                        <SectionHead title={t('overview.latestBlocks')} to="/ecosystem/explorer/stats" />
                        <LiveList data={blocks} kind="block" />
                    </section>

                    <section className="card" style={{ padding:16 }}>
                        <SectionHead title={t('overview.latestTxs')} to="/ecosystem/explorer/stats" />
                        <LiveList data={txs} kind="tx" />
                    </section>
                </div>
            </div>

            <footer className="qc-footer">
                <div className="footer-inner">
                    <div className="brand">QUANTACHAIN</div>
                    <div className="desc">区块链多功能集成平台，为用户提供一站式的生态系统访问和管理服务。连接多链世界，赋能数字未来。</div>
                    <div className="meta">© 2025 QuantaChain Technologies Ltd.</div>
                </div>
            </footer>
        </div>
    );
}
