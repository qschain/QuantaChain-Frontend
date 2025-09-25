import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '../../api/dappApi'
import type { Dapp } from '../../api/dappApi'
import SectionHeader from '../../components/SectionHeader'
import StatCard from '../../components/StatCard'
import RankPanel from '../../components/RankPanel'
import DappCard from '../../components/DappCard'

export default function HomePage() {
  const { t } = useTranslation('dapps')
  const [stats, setStats] = useState<{ apps: number; users24h: number; vol24h: string; volTotal: string }>()
  const [ranks, setRanks] = useState<{ dau: Dapp[]; vol: Dapp[]; growth: Dapp[] }>({ dau: [], vol: [], growth: [] })
  const [featured, setFeatured] = useState<Dapp[]>([])

  useEffect(() => {
    api.getOverview().then(setStats)
    api.getRankings().then(setRanks as any)
    api.getFeatured().then(setFeatured)
  }, [])

  return (
    <div className="dapps-col dapps-gap-16">
      <SectionHeader title={t('home.title')} sub={t('home.sub')} />

      {/* 顶部四个统计卡片 */}
      <div className="dapps-grid dapps-grid-4">
        <StatCard label={t('home.stats.apps')}     value={stats ? stats.apps.toLocaleString() : '—'} delta="+12.5%" icon="apps" />
        <StatCard label={t('home.stats.users24h')} value={(stats?.users24h ?? 0).toLocaleString()}   delta="+2.8%"  icon="users" />
        <StatCard label={t('home.stats.vol24h')}   value={stats?.vol24h ?? '$—'}                     delta="-2.1%"  icon="tx24" />
        <StatCard label={t('home.stats.volTotal')} value={stats?.volTotal ?? '$—'}                   delta="+15.7%" icon="total" />
      </div>

      {/* 热门分类（用自适应网格） */}
      <SectionHeader title={t('home.hotCategories')} sub={t('home.hotCategoriesSub')} />
      <div className="dapps-auto-grid">
        {['DeFi', 'GameFi', 'NFTs', 'Social', 'Tools'].map((c) => (
          <button key={c} className="dapps-category-card">
            <span className="cat-ic" />
            <span className="cat-tit">{c}</span>
            <span className="cat-sub">{t('home.catSub')}</span>
          </button>
        ))}
      </div>

      {/* 排行榜 */}
      <SectionHeader
        title={t('home.rankings')}
        sub={t('home.rankingsSub')}
        right={
          <div className="dapps-toolbar">
            <input className="dapps-input" placeholder={t('common.searchDapp') as string} />
            <button className="dapps-btn ghost">{t('common.search')}</button>
            <button className="dapps-btn ghost">{t('common.sort')}</button>
            <button className="dapps-btn ghost">{t('common.timeRange')}</button>
          </div>
        }
      />
      <div className="dapps-grid dapps-grid-3">
        <RankPanel title={t('home.rank.dau')}    items={ranks.dau} />
        <RankPanel title={t('home.rank.vol24h')} items={ranks.vol} />
        <RankPanel title={t('home.rank.growth')} items={ranks.growth} />
      </div>

      {/* 合辑与精选 */}
      <SectionHeader title={t('home.collections')} sub={t('home.collectionsSub')} />
      <div className="dapps-grid dapps-grid-2">
        <div className="dapps-panel tall">
          <div className="dapps-panel__head">{t('home.browseByCategory')}</div>
          <div className="dapps-browse-grid">
            {[['DeFi', 234], ['GameFi', 156], ['NFTs', 89], ['Social', 67], ['Tools', 45], ['Analytics', 23]].map(([k, c]) => (
              <button key={k as string} className="dapps-pill">
                <span className="dot" />
                <span className="k">{k as string}</span>
                <span className="c">{c as number}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dapps-panel tall">
          <div className="dapps-panel__head">{t('home.curatedCollections')}</div>
          <div className="dapps-curated-list">
            {[
              { title: t('home.curated.highYieldDeFi'), count: 8, chips: ['JS', 'SUN', 'JL', '+5'] },
              { title: t('home.curated.latestGameFi'), count: 12, chips: ['TR', 'TW', 'TC', '+9'] },
              { title: t('home.curated.hotNFT'),      count: 6, chips: ['AP', 'TN', 'NM', '+3'] },
            ].map((s, idx) => (
              <div key={idx} className="dapps-curated-item">
                <div>
                  <div className="dapps-ci-title">{s.title}</div>
                  <div className="dapps-ci-chips">
                    {s.chips.map((c, i) => (
                      <span key={i} className="dapps-chip">{c}</span>
                    ))}
                  </div>
                </div>
                <button className="dapps-btn ghost sm">
                  {s.count}{t('home.curated.dapps')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Dapps */}
      <SectionHeader title={t('home.featuredTitle')} sub={t('home.featuredSub')} />
      <div className="dapps-grid dapps-grid-4">
        {featured.map((d) => (
          <DappCard key={d.id} dapp={d} />
        ))}
      </div>
    </div>
  )
}
