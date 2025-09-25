import SectionHeader from '../../components/SectionHeader'
import { useTranslation } from 'react-i18next'

export default function ResourcesPage() {
  const { t } = useTranslation('dapps')
  return (
    <div className="dapps-container-vertical">
      <SectionHeader
        title={t('resources.title')}
       
      />

      {/* Tabs */}
      <div className="dapps-tabs dapps-row dapps-gap-8">
        <button className="dapps-btn ghost active">{t('resources.tab.learn')}</button>
        <button className="dapps-btn ghost">{t('resources.tab.report')}</button>
      </div>

      {/* Resource cards */}
      <div className="dapps-grid dapps-grid-3 dapps-gap-16">
        {['web3Wallet', 'dappGuide', 'smartContract', 'nftBasics'].map((k) => (
          <div key={k} className="dapps-panel dapps-tall">
            <div className="dapps-panel-title">
              {t(`resources.cards.${k}.title`)}
            </div>
            <div className="dapps-progress">
              <div
                className="dapps-progress__bar"
                style={{
                  width:
                    k === 'nftBasics'
                      ? '100%'
                      : k === 'dappGuide'
                      ? '40%'
                      : '70%',
                }}
              />
            </div>
            <button className="dapps-btn">{t(`resources.cards.${k}.cta`)}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
