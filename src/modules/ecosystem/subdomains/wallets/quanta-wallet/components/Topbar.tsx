import { useTranslation } from 'react-i18next'
import i18n from '../../../../../../shared/lib/i18n/i18n'

export default function Topbar() {
    const { t } = useTranslation(['wallet'])
    const isZh = i18n.language?.startsWith('zh')

    return (
        <div className="topbar">
            <div className="search">
                <input className="input" placeholder={t('searchPlaceholder')} />
                <button className="btn secondary">{t('search')}</button>
            </div>
            <div className="row">
                <span className="badge green">{t('mainNetworkConnected')}</span>
                <button className="btn secondary">{t('quickActions')}</button>
                <button
                    className="btn ghost"
                    title={t('language')}
                    onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
                    aria-label={t('language')}
                >
                    {isZh ? '中文' : 'EN'}
                </button>
                <div className="badge">U</div>
            </div>
        </div>
    )
}