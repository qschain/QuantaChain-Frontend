import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../state/SessionProvider'
import { useTranslation } from 'react-i18next'

export default function Sidebar() {
    const nav = useNavigate()
    const { logout } = useSession()
    const { t } = useTranslation(['common'])
    return (
        <aside className="sidebar">
            <div className="section">
                <div className="row space-between">
                    <div style={{fontWeight:700}}>{t('navMenu')}</div>
                    <button className="btn ghost" onClick={()=>{logout(); nav('/auth/login')}}>{t('logout')}</button>
                </div>
                <div className="secondary" style={{marginTop:8}}>{t('totalValuation')}</div>
                <div style={{fontSize:22, fontWeight:700}}>$12,458.32</div>
                <div className="badge green">+2.34% (24h)</div>
            </div>

            <div className="section nav">
                <NavLink to="/">📊 {t('dashboard')}</NavLink>
                <NavLink to="/atlas">🌐 {t('atlas')}</NavLink>
                <NavLink to="/asset">💰 {t('assets')}</NavLink>
                <NavLink to="/settings">⚙️ {t('settings.title')}</NavLink>
            </div>

            <div className="section">
                <div className="row" style={{gap:10}}>
                    <button className="btn" onClick={()=>nav('/asset/send')}>▶ {t('send')}</button>
                    <button className="btn" onClick={()=>nav('/asset/receive')}>📥{t('receive')}</button>
                </div>
                <div className="row" style={{gap:10, marginTop:10}}>
                    <button className="btn secondary" onClick={()=>nav('/asset/deposit')}>⬆ {t('deposit')}</button>
                    <button className="btn secondary" onClick={()=>nav('/asset/withdraw')}>⬇ {t('withdraw')}</button>
                </div>

                <div style={{marginTop:16}} className="badge green">{t('quantumSecureStorage')}</div>
            </div>
        </aside>
    )
}
