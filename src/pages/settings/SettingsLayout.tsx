import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SettingsLayout() {
    const { t } = useTranslation(['common'])
    return (
        <div className="grid" style={{gridTemplateColumns:'320px 1fr', gap:'var(--space-6)'}}>
            <div className="card">
                <h2 style={{marginTop:0}}>{t('settings.center')}</h2>
                <div className="nav" style={{marginTop:14, display:'grid', gap:8}}>
                    <NavLink to="/settings">{t('settings.accountOverview')}</NavLink>
                    <NavLink to="/settings/privacy">{t('settings.privacy')}</NavLink>
                    <NavLink to="/settings/permissions">{t('settings.permissions')}</NavLink>
                    <NavLink to="/settings/network">{t('settings.network')}</NavLink>
                    <NavLink to="/settings/appearance">{t('settings.appearance')}</NavLink>
                    <NavLink to="/settings/notifications">{t('settings.notifications')}</NavLink>
                    <NavLink to="/settings/about">{t('settings.about')}</NavLink>
                </div>
            </div>
            <div><Outlet /></div>
        </div>
    )
}
