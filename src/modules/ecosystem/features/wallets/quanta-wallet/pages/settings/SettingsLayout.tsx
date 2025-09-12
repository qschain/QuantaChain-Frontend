import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SettingsLayout() {
    const { t } = useTranslation(['wallet'])
    return (
        <div className="grid" style={{gridTemplateColumns:'320px 1fr', gap:'var(--space-6)'}}>
            <div className="card">
                <h2 style={{marginTop:0}}>{t('settings.center')}</h2>
                <div className="nav" style={{marginTop:14, display:'grid', gap:8}}>
                    <NavLink to="">{t('settings.accountOverview')}</NavLink>
                    <NavLink to="privacy">{t('settings.privacy')}</NavLink>
                    <NavLink to="permissions">{t('settings.permissions')}</NavLink>
                    <NavLink to="network">{t('settings.network')}</NavLink>
                    <NavLink to="appearance">{t('settings.appearance')}</NavLink>
                    <NavLink to="notifications">{t('settings.notifications')}</NavLink>
                    <NavLink to="about">{t('settings.about')}</NavLink>
                </div>
            </div>
            <div><Outlet /></div>
        </div>
    )
}
