import { useTranslation } from 'react-i18next';

export default function VotePage() {
  const { t } = useTranslation('sr');

  return (
    <div className="sr-page sr-vote">
      <header className="sr-header">
        <h1 className="sr-title-neon">{t('vote.title')}</h1>
        <p className="sr-desc">{t('vote.subtitle')}</p>
      </header>

      <div className="sr-row sr-gap-16">
        <div className="sr-col sr-flex-1">
          {/* 工具条 */}
          <div className="sr-toolbar">
            <input
              className="sr-input"
              placeholder={t('vote.searchPlaceholder')!}
            />
            <button className="sr-btn">{t('vote.sort')}</button>
            <button className="sr-btn ghost">{t('vote.filters')}</button>

            <div className="sr-chips">
              <span className="sr-chip">{t('vote.quick.recommended')}</span>
              <span className="sr-chip">{t('vote.quick.highApy')}</span>
              <span className="sr-chip">{t('vote.quick.highActive')}</span>
              <span className="sr-chip">{t('vote.quick.newlyListed')}</span>
            </div>
          </div>

          {/* 列表 */}
          <SrRow name="TronLink" apy="8.5%" votes="15.2M" online="99.8%" people="2,456" />
          <SrRow name="Binance Staking" apy="7.8%" votes="18.7M" online="99.9%" people="3,128" />
          <SrRow name="TRON Foundation" apy="9.2%" votes="12.3M" online="98.5%" people="1,892" />

          <div className="sr-center" style={{ marginTop: 12 }}>
            <button className="sr-btn ghost">{t('common.loadMore')}</button>
          </div>
        </div>

        {/* 右侧投票篮 */}
        <aside className="sr-vote-basket">
          <div className="sr-panel sr-sticky">
            <div className="sr-panel__title">{t('vote.basket.title')}</div>

            <div className="sr-slider">
              <div className="sr-row sr-space-between">
                <div className="sr-muted">{t('vote.basket.amount')}</div>
                <div className="sr-muted">1000 TRX</div>
              </div>
              <div className="sr-slider__track">
                <div className="sr-slider__thumb" style={{ left: '35%' }} />
              </div>
            </div>

            <div className="sr-card">
              <div className="sr-card__title">{t('vote.basket.incomePreview')}</div>
              <div className="sr-muted">APY 8.5% · 日/周/月收益估算</div>
            </div>

            <div className="sr-card">
              <div className="sr-card__title">{t('vote.basket.selected')}</div>
              <div className="sr-muted">{t('vote.basket.none')}</div>
            </div>

            <div className="sr-col sr-gap-8">
              <button className="sr-btn primary">{t('vote.actions.confirm')}</button>
              <button className="sr-btn">{t('vote.actions.batch')}</button>
              <button className="sr-btn ghost">{t('vote.actions.simulate')}</button>
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
    <div className="sr-card sr-row sr-space-between sr-align-center">
      <div className="sr-row sr-align-center" style={{ gap: 12 }}>
        <div className="sr-avatar">SR</div>
        <div>
          <div className="sr-card__title">{name}</div>
          <div className="sr-muted">TLy…K7ZH</div>
          <div className="sr-row sr-gap-6" style={{ marginTop: 6 }}>
            <span className="sr-badge">推荐</span>
            <span className="sr-badge">高收益</span>
          </div>
        </div>
      </div>

      <div className="sr-row sr-gap-24">
        <KV k="APY" v={apy} />
        <KV k="得票数" v={votes} />
        <KV k="在线率" v={online} />
        <KV k="投票人数" v={people} />
      </div>

      <button className="sr-btn">{'一键投票'}</button>
    </div>
  );
}

function KV({ k, v }:{k:string; v:string}) {
  return (
    <div className="sr-kv">
      <div className="sr-muted">{k}</div>
      <div className="sr-number-md">{v}</div>
    </div>
  );
}
