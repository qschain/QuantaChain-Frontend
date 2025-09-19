import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../state/WalletSessionProvider'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api } from '../shared/api/api'

type TotalOverview = { totalUSD:number; diffUSD:number; diffPct:number; series:number[] }

export default function Sidebar() {
    const nav = useNavigate()
    const { logout } = useSession()
    const { t, i18n } = useTranslation(['wallet'])
    const [overview, setOverview] = useState<TotalOverview>()



    const fmtCurrency = (n:number|undefined) =>
        (n ?? 0).toLocaleString(
            i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US',
            { style:'currency', currency:'USD' }
        )

    return (
        <aside className="sidebar">
            <div className="section">
                <div className="row space-between">
                    <div style={{fontWeight:700}}>{t('navMenu')}</div>
                    <button
                        className="btn ghost"
                        onClick={()=>{ logout(); nav('auth/login') }}
                    >
                        {t('logout')}
                    </button>
                </div>

                <div className="secondary" style={{marginTop:8}}>
                    {t('totalValuation')}
                </div>

                {/* 总资产取真实 overview */}
                <div style={{fontSize:22, fontWeight:700}}>
                    {fmtCurrency(overview?.totalUSD)}
                </div>
                <div
                    className={`badge ${overview?.diffPct && overview.diffPct >= 0 ? 'green':'red'}`}
                >
                    {overview ? `${overview.diffPct >= 0 ? '+' : ''}${overview.diffPct}% (24h)` : ''}
                </div>
            </div>

            <div className="section nav">
                <NavLink to="dashboard">📊 {t('dashboard')}</NavLink>
                <NavLink to="atlas">🌐 {t('atlas')}</NavLink>
                <NavLink to="asset">💰 {t('assets')}</NavLink>
                <NavLink to="settings">⚙️ {t('settings.title')}</NavLink>
            </div>

            <div className="section">
                <div className="row" style={{gap:10}}>
                    <button className="btn" onClick={()=>nav('asset/send')}>▶ {t('send')}</button>
                    <button className="btn" onClick={()=>nav('asset/receive')}>📥 {t('receive')}</button>
                </div>
                <div className="row" style={{gap:10, marginTop:10}}>
                    <button className="btn secondary" onClick={()=>nav('asset/deposit')}>⬆ {t('deposit')}</button>
                    <button className="btn secondary" onClick={()=>nav('asset/withdraw')}>⬇ {t('withdraw')}</button>
                </div>

                <div style={{marginTop:16}} className="badge green">
                    {t('quantumSecureStorage')}
                </div>
            </div>
        </aside>
    )
}

