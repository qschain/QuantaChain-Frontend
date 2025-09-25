import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import './styles/sr.css';

export default function SrLayout() {
  const { t } = useTranslation('sr');
  const [collapsed, setCollapsed] = useState(false); // 侧栏是否折叠

  return (
    <div className="sr-shell">
      <div className="sr-main">
        <aside className={`sr-sider ${collapsed ? 'rail' : ''}`}>
          {/* 折叠按钮 */}
          <button
            className="sr-sider-toggle-btn"
            onClick={() => setCollapsed(v => !v)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? '→' : '←'}
          </button>

          <div className="sr-sider-title">{t('nav.title')}</div>

          <SiderItem to="/ecosystem/sr" end icon={<IconDashboard />}>
            {t('nav.dashboard')}
          </SiderItem>
          <SiderItem to="/ecosystem/sr/vote" icon={<IconVote />}>
            {t('nav.vote')}
          </SiderItem>
          <SiderItem to="/ecosystem/sr/rewards" icon={<IconRewards />}>
            {t('nav.rewards')}
          </SiderItem>
          <SiderItem to="/ecosystem/sr/proposals" icon={<IconProposals />}>
            {t('nav.proposals')}
          </SiderItem>
          <SiderItem to="/ecosystem/sr/analytics" icon={<IconAnalytics />}>
            {t('nav.analytics')}
          </SiderItem>
          <SiderItem to="/ecosystem/sr/learn" icon={<IconLearn />}>
            {t('nav.learn')}
          </SiderItem>

          <div className="sr-sider-sub">{t('nav.extra')}</div>
        </aside>

        <main className="sr-content">
          <div className="sr-content-inner">
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
      className={({ isActive }) => `sr-sider-item ${isActive ? 'active' : ''}`}
    >
      <span className="sr-ic">{icon}</span>
      <span className="sr-txt">{children}</span>
    </NavLink>
  );
}

/* ====== inline icons（currentColor 变色） ====== */
function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13h6V4H4z" />
      <path d="M14 20h6v-8h-6z" />
      <path d="M4 20h6v-5H4z" />
      <path d="M14 10h6V4h-6z" />
    </svg>
  );
}
function IconVote() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10h18v10H3z" />
      <path d="m9 10 3-6 3 6" />
    </svg>
  );
}
function IconRewards() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3" />
      <path d="M4 20c1.5-4 6.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function IconProposals() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h12v16H6z" />
      <path d="M9 8h6M9 12h6M9 16h6" />
    </svg>
  );
}
function IconAnalytics() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 20h18" />
      <path d="M7 16v-6" />
      <path d="M12 16V8" />
      <path d="M17 16v-3" />
    </svg>
  );
}
function IconLearn() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M21 10v6" />
      <path d="M3 10v6l9 4 9-4" />
    </svg>
  );
}
