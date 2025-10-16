import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import './styles/ai.css';

export default function AiLayout() {
    const { t } = useTranslation('ai');
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="ai-shell">
            <div className="ai-main">
                <aside className={`ai-sider ${collapsed ? 'rail' : ''}`}>
                    <button
                        className="ai-sider-toggle-btn"
                        onClick={() => setCollapsed(v => !v)}
                        aria-label="Toggle sidebar"
                    >
                        {collapsed ? '→' : '←'}
                    </button>

                    <div className="ai-sider-title">{t('nav.ai')}</div>

                    <SiderItem to="/ai/explore" end icon={<IconCompass />}>
                        {t('nav.explore')}
                    </SiderItem>
                    <SiderItem to="/ai/labs" icon={<IconFlask />}>
                        {t('nav.labs')}
                    </SiderItem>

                    <div className="ai-sider-sub">{t('nav.extra') ?? ''}</div>
                </aside>

                <main className="ai-content">
                    <div className="ai-content-inner">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

function SiderItem({
                       to, children, icon, end = false,
                   }: {
    to: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    end?: boolean;
}) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `ai-sider-item ${isActive ? 'active' : ''}`}
        >
            <span className="ai-ic">{icon}</span>
            <span className="ai-txt">{children}</span>
        </NavLink>
    );
}

/* ====== inline icons（currentColor 自动继承主题色） ====== */
function IconCompass() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <path d="M15.5 8.5 10 10l-1.5 5.5L14 14z" />
            <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}
function IconFlask() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 2v4l-5 9a4 4 0 0 0 3.5 6h7a4 4 0 0 0 3.5-6l-5-9V2" />
            <path d="M9 6h6" />
        </svg>
    );
}
