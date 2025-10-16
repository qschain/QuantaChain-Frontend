import { NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'
import { useTranslation } from 'react-i18next'
import { useDashboardCtx } from '../model/DashboardContext'

export default function Sidebar() {
    const nav = useNavigate()
    const { logout } = useSession()
    const { t, i18n } = useTranslation(['wallet'])
    const { data, loading, error } = useDashboardCtx()

    const fmtCurrency = (n?: number) =>
        (n ?? 0).toLocaleString(
            i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US',
            { style: 'currency', currency: 'USD' }
        )

    const overview = data?.overview
    const diffPct = overview?.diffPct ?? 0
    const diffBadgeClass = diffPct >= 0 ? 'green' : 'red'

    return (
        <aside className="sidebar">
            {/* 顶部操作区 —— 永远可见 */}
            <div className="section">
                <div className="row space-between">
                    <div style={{ fontWeight: 700 }}>{t('navMenu')}</div>
                    <button
                        className="btn ghost"
                        onClick={() => { logout(); nav('') }}
                    >
                        {t('logout')}
                    </button>
                </div>

                <div className="secondary" style={{ marginTop: 8 }}>
                    {t('totalValuation')}
                </div>

                {/* 状态与数据兜底 */}
                {loading && (
                    <div style={{ marginTop: 6, fontSize: 14 }}>{t('loading') || 'Loading…'}</div>
                )}

                {error && (
                    <div
                        style={{
                            marginTop: 8,
                            padding: 8,
                            borderRadius: 8,
                            fontSize: 12,
                            lineHeight: 1.4,
                            background: 'rgba(255,0,0,0.08)',
                            border: '1px solid rgba(255,0,0,0.25)',
                            wordBreak: 'break-all',
                        }}
                    >
                        {t('loadFailed') || '加载失败'}：{String(error)}
                    </div>
                )}

                {/* 数据就绪时展示总览 */}
                {!!data && (
                    <>
                        <div style={{ fontSize: 22, fontWeight: 700 }}>
                            {fmtCurrency(overview?.totalUSD)}
                        </div>
                        <div className={`badge ${diffBadgeClass}`}>
                            {`${diffPct >= 0 ? '+' : ''}${diffPct}% (24h)`}
                        </div>
                    </>
                )}
            </div>

            {/* 导航区 —— 不依赖数据，始终可用 */}
            <div className="section nav">
                <NavLink to="dashboard">📊 {t('dashboard')}</NavLink>
                <NavLink to="atlas">🌐 {t('atlas')}</NavLink>
                <NavLink to="asset">💰 {t('assets')}</NavLink>
                <NavLink to="settings">⚙️ {t('settings.title')}</NavLink>
            </div>

            {/* 快捷操作 —— 不依赖数据，始终可用 */}
            <div className="section">
                <div className="row" style={{ gap: 10 }}>
                    <button className="btn" onClick={() => nav('asset/send')}>▶ {t('send')}</button>
                    <button className="btn" onClick={() => nav('asset/receive')}>📥 {t('receive')}</button>
                </div>
                <div className="row" style={{ gap: 10, marginTop: 10 }}>
                    <button className="btn secondary" onClick={() => nav('asset/deposit')}>⬆ {t('deposit')}</button>
                    <button className="btn secondary" onClick={() => nav('asset/withdraw')}>⬇ {t('withdraw')}</button>
                </div>

                <div style={{ marginTop: 16 }} className="badge green">
                    {t('quantumSecureStorage')}
                </div>
            </div>
        </aside>
    )
}
