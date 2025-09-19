import { useTranslation } from 'react-i18next';

export default function VotePage() {
    const { t } = useTranslation('sr');

    return (
        <div className="sr-page sr-vote">
            <header className="sr-header">
                <h1 className="title-neon">{t('vote.title')}</h1>
                <p className="desc">{t('vote.subtitle')}</p>
            </header>

            <div className="row gap-16">
                <div className="col flex-1">
                    {/* 工具条 */}
                    <div className="toolbar">
                        <input className="input" placeholder={t('vote.searchPlaceholder')!} />
                        <button className="btn">{t('vote.sort')}</button>
                        <button className="btn ghost">{t('vote.filters')}</button>

                        <div className="chips">
                            <span className="chip">{t('vote.quick.recommended')}</span>
                            <span className="chip">{t('vote.quick.highApy')}</span>
                            <span className="chip">{t('vote.quick.highActive')}</span>
                            <span className="chip">{t('vote.quick.newlyListed')}</span>
                        </div>
                    </div>

                    {/* 列表 */}
                    <SrRow name="TronLink" apy="8.5%" votes="15.2M" online="99.8%" people="2,456" />
                    <SrRow name="Binance Staking" apy="7.8%" votes="18.7M" online="99.9%" people="3,128" />
                    <SrRow name="TRON Foundation" apy="9.2%" votes="12.3M" online="98.5%" people="1,892" />

                    <div className="center" style={{ marginTop: 12 }}>
                        <button className="btn ghost">{t('common.loadMore')}</button>
                    </div>
                </div>

                {/* 右侧投票篮 */}
                <aside className="vote-basket">
                    <div className="panel sticky">
                        <div className="panel__title">{t('vote.basket.title')}</div>
                        <div className="slider">
                            <div className="row space-between">
                                <div className="muted">{t('vote.basket.amount')}</div>
                                <div className="muted">1000 TRX</div>
                            </div>
                            <div className="slider__track"><div className="slider__thumb" style={{ left: '35%' }} /></div>
                        </div>

                        <div className="card">
                            <div className="card__title">{t('vote.basket.incomePreview')}</div>
                            <div className="muted">APY 8.5% · 日/周/月收益估算</div>
                        </div>

                        <div className="card">
                            <div className="card__title">{t('vote.basket.selected')}</div>
                            <div className="muted">{t('vote.basket.none')}</div>
                        </div>

                        <div className="col gap-8">
                            <button className="btn primary">{t('vote.actions.confirm')}</button>
                            <button className="btn">{t('vote.actions.batch')}</button>
                            <button className="btn ghost">{t('vote.actions.simulate')}</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function SrRow({ name, apy, votes, online, people }:{
    name:string; apy:string; votes:string; online:string; people:string;
}) {
    return (
        <div className="card row space-between align-center">
            <div className="row align-center" style={{ gap: 12 }}>
                <div className="avatar">SR</div>
                <div>
                    <div className="card__title">{name}</div>
                    <div className="muted">TLy…K7ZH</div>
                    <div className="row gap-6" style={{ marginTop: 6 }}>
                        <span className="badge">推荐</span>
                        <span className="badge">高收益</span>
                    </div>
                </div>
            </div>

            <div className="row gap-24">
                <KV k="APY" v={apy} />
                <KV k="得票数" v={votes} />
                <KV k="在线率" v={online} />
                <KV k="投票人数" v={people} />
            </div>

            <button className="btn">{'一键投票'}</button>
        </div>
    );
}
function KV({ k, v }:{k:string; v:string}) {
    return (
        <div className="kv">
            <div className="muted">{k}</div>
            <div className="number-md">{v}</div>
        </div>
    );
}
