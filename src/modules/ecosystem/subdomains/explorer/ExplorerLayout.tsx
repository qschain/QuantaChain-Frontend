import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import TopNav from '../../../../app/layouts/TopNav/TopNav';
import './styles/explorer.css';

export default function ExplorerLayout() {
  const { t } = useTranslation('explorer');
  const [collapsed, setCollapsed] = useState(false); // 侧栏导轨折叠

  return (
    <div className="ex-shell">

      {/* 主体：左侧边栏 + 内容 */}
      <div className="ex-main with-topnav">
        <aside className={`ex-sider ${collapsed ? 'rail' : ''}`}>
          {/* 侧栏内部折叠按钮（与 SR/Dapps 一致） */}
          <button
            className="ex-sider-toggle-btn"
            onClick={() => setCollapsed(v => !v)}
            aria-label="Toggle sidebar"
            aria-pressed={collapsed}
            title={collapsed ? (t('nav.expand') ?? 'Expand') : (t('nav.collapse') ?? 'Collapse')}
          >
            {collapsed ? '→' : '←'}
          </button>

          <div className="ex-sider-title">{t('nav.title')}</div>

          <SiderItem to="/ecosystem/explorer" end icon={<IconHome />}>
            {t('nav.home')}
          </SiderItem>

          <SiderItem to="/ecosystem/explorer/tokens" icon={<IconTokens />}>
            {t('nav.tokens')}
          </SiderItem>

          <SiderItem to="/ecosystem/explorer/stats" icon={<IconStats />}>
            {t('nav.stats')}
          </SiderItem>

          <SiderItem to="/ecosystem/explorer/api" icon={<IconCode />}>
            {t('nav.api')}
          </SiderItem>

          <div className="ex-sider-sub">{t('nav.extra')}</div>
        </aside>

        <main className="ex-content">
          <div className="ex-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SiderItem({
  to,
  children,
  icon,
  end = false,
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
      className={({ isActive }) => `ex-sider-item ${isActive ? 'active' : ''}`}
    >
      <span className="ex-ic">{icon}</span>
      <span className="ex-txt">{children}</span>
    </NavLink>
  );
}

/* ====== inline icons（stroke=currentColor 随状态变色） ====== */
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9h14v-9" />
    </svg>
  );
}
function IconTokens() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v5c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 11v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
    </svg>
  );
}
function IconStats() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M2 20h20" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 16 4 12l4-4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M14 4 10 20" />
    </svg>
  );
}
