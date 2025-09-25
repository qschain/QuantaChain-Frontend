// src/modules/ecosystem/features/dapps/pages/Account/AccountPage.tsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../../components/SectionHeader'
import * as api from '../../api/dappApi'
import type { Dapp } from '../../types'

export default function AccountPage() {
  const { t } = useTranslation('dapps')
  const [favorites, setFavorites] = useState<Dapp[]>([])
  const [portfolio, setPortfolio] = useState<any>()

  useEffect(() => {
    api.getFavorites().then(setFavorites)
    api.getPortfolio().then(setPortfolio)
  }, [])

  return (
    <div className="dapps-container-vertical">
      <SectionHeader
        title={t('account.title')}
        right={<button className="dapps-btn ghost">{t('common.backHome')}</button>}
      />

      {/* 收藏夹 */}
      <div className="dapps-panel">
        <div className="dapps-panel-title">{t('account.favTitle')}</div>
        <div className="dapps-grid cols-4 gap">
          {favorites.map((d) => (
            <div key={d.id} className="dapps-fav-card">
              <div className="logo sm" />
              <div className="name">{d.name}</div>
              <div className="tag muted">{d.category}</div>
              <button className="dapps-btn tiny">{t('common.view')}</button>
            </div>
          ))}
        </div>
      </div>

      {/* 投资组合 */}
      <div className="dapps-grid cols-2 gap">
        <div className="dapps-panel tall">
          <div className="dapps-panel-title">{t('account.portfolio')}</div>
          <div className="dapps-kpi-row">
            <div className="dapps-kpi">
              <div className="dapps-kpi-label">{t('account.totalValue')}</div>
              <div className="dapps-kpi-value">{portfolio?.value ?? '$24,580.32'}</div>
              <div className="dapps-kpi-delta up">+2.1%</div>
            </div>
            <div className="dapps-kpi">
              <div className="dapps-kpi-label">{t('account.activeCount')}</div>
              <div className="dapps-kpi-value">{portfolio?.active ?? 8}</div>
            </div>
            <div className="dapps-kpi">
              <div className="dapps-kpi-label">{t('account.roi')}</div>
              <div className="dapps-kpi-value">+18.7%</div>
            </div>
          </div>
          <div className="dapps-chart-placeholder">{t('common.chartPlaceholder')}</div>
        </div>

        <div className="dapps-panel tall">
          <div className="dapps-panel-title">{t('account.assetDist')}</div>
          <div className="dapps-list">
            {(portfolio?.dist ?? [
              { name: 'Uniswap', value: '$8,240.12' },
              { name: 'Aave', value: '$6,890.45' },
              { name: 'Compound', value: '$5,120.88' },
              { name: 'Others', value: '$4,328.87' },
            ]).map((it: any) => (
              <div key={it.name} className="dapps-row space-between dapps-item">
                <div>{it.name}</div>
                <div className="muted">{it.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 告警设置 */}
      <div className="dapps-panel">
        <div className="dapps-panel-title">{t('account.alerts')}</div>
        <div className="dapps-list">
          {[
            t('account.alert.price') || '价格告警',
            t('account.alert.tvl') || 'TVL 变化',
            t('account.alert.security') || '安全事件',
          ].map((name, i) => (
            <div key={i} className="dapps-row space-between dapps-item">
              <div>{name}</div>
              <div>
                <label className="dapps-switch">
                  <input type="checkbox" defaultChecked={i !== 1} />
                  <span />
                </label>
              </div>
            </div>
          ))}
        </div>
        <button className="dapps-btn right">{t('account.addAlert')}</button>
      </div>
    </div>
  )
}
