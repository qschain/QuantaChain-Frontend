import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './styles/dapps.css'

export default function DappsLayout() {
    const { t } = useTranslation('dapps')

    return (
        <div className="dapps-scope qc-shell">
            {/* 左侧 Dapps 菜单 + 右侧内容 */}
            <div className="qc-main">
                <aside className="qc-sider">
                    <div className="sider-title">{t('nav.title')}</div>

                    <SiderItem to="/ecosystem/dapps" end icon={<IconHome />}>
                        {t('nav.home')}
                    </SiderItem>

                    <SiderItem to="/ecosystem/dapps/discover" icon={<IconDiscover />}>
                        {t('nav.discover')}
                    </SiderItem>

                    <SiderItem to="/ecosystem/dapps/account" icon={<IconAccount />}>
                        {t('nav.account')}
                    </SiderItem>

                    <SiderItem to="/ecosystem/dapps/resources" icon={<IconBook />}>
                        {t('nav.resources')}
                    </SiderItem>

                    <SiderItem to="/ecosystem/dapps/dev" icon={<IconDev />}>
                        {t('nav.devCenter')}
                    </SiderItem>

                    <div className="sider-sub">{t('nav.extra')}</div>
                </aside>

                <main className="qc-content">
                    <Outlet />
                </main>
            </div>

            {/* 统一底部栏 */}
            <footer className="qc-footer">
                <div className="footer-inner">
                    <div className="brand">QUANTACHAIN</div>
                    <div className="desc">{t('footer.desc')}</div>
                    <div className="meta">© 2025 QuantaChain Technologies Ltd.</div>
                </div>
            </footer>
        </div>
    )
}

function SiderItem({
                       to, children, icon, end = false,
                   }: { to: string; children: React.ReactNode; icon?: React.ReactNode; end?: boolean }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `sider-item ${isActive ? 'active' : ''}`}
        >
            <span className="ic">{icon}</span>
            <span className="txt">{children}</span>
        </NavLink>
    )
}

/* === inline icons：stroke="currentColor" 会跟随 .sider-item/.active 变色 === */
function IconHome() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M6 10.5V20h12v-9.5" />
        </svg>
    )
}
function IconDiscover() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
            <path d="M8 14l2-6 6-2-2 6-6 2z" />
        </svg>
    )
}
function IconAccount() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3" />
            <path d="M4 20c1.8-4 6-6 8-6s6.2 2 8 6" />
        </svg>
    )
}
function IconBook() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5z" />
            <path d="M7 5v11a3 3 0 0 0 3 3h9" />
        </svg>
    )
}
function IconDev() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 9 4 12l4 3" />
            <path d="m16 9 4 3-4 3" />
            <path d="M12 4 9 20" />
        </svg>
    )
}
