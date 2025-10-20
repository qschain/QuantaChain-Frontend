import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../../shared/lib/i18n/i18n';
import { useSession } from '../../session/PlatformSessionProvider'; // ← 平台/钱包的 useSession 导出路径
import './topnav.css';

const LOGIN_PATH = '/auth/login';

export default function TopNav() {
    const [open, setOpen] = useState<string | null>(null);
    const [drawer, setDrawer] = useState(false);
    const { t, i18n } = useTranslation('common');
    const { authed, user, logout, loading } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const onLangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await changeAppLanguage(e.target.value as 'en' | 'zh');
    };

    // 小屏切回大屏时，自动关闭抽屉与子菜单
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 900px)');
        const handle = () => { setDrawer(false); setOpen(null); };
        mql.addEventListener?.('change', handle);
        return () => mql.removeEventListener?.('change', handle);
    }, []);

    const isMobile =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

    const toggleSection = (key: string) => {
        if (!isMobile) return;
        setOpen((cur) => (cur === key ? null : key));
    };
    const closeDrawer = () => setDrawer(false);

    // 登录按钮点击：把 from 带过去，登录成功可跳回
    const toLogin = () => {
        navigate(LOGIN_PATH, { replace: false, state: { from: location } });
        closeDrawer();
    };

    // 登出动作：调用全局会话登出并收起抽屉
    const onLogout = async () => {
        try {
            await logout();
        } finally {
            closeDrawer();
            // 也可以跳回首页或保持在原页：
            // navigate('/', { replace: true });
        }
    };

    // 显示名（兜底）
    const displayName = useMemo(() => {
        return user?.name || t('actions.guest') || 'Guest';
    }, [user?.name, t]);

    return (
        <header
            className={`qc-topbar ${drawer ? 'is-open' : ''}`}
            onMouseLeave={() => !isMobile && setOpen(null)}
            role="banner"
        >
            <div className="qc-topbar__inner">
                {/* 品牌 */}
                <Link to="/" className="qc-topbar__logo" aria-label={t('brand') || 'QuantaChain'}>
                    <span className="qc-topbar__logo-dot" /> {t('brand')}
                </Link>

                {/* 汉堡按钮（小屏显示） */}
                <button
                    className="qc-topbar__burger"
                    aria-label={
                        drawer ? t('actions.closeMenu') ?? 'Close menu' : t('actions.openMenu') ?? 'Open menu'
                    }
                    aria-expanded={drawer}
                    aria-controls="qc-topbar-drawer"
                    onClick={() => setDrawer((v) => !v)}
                >
                    {drawer ? '✕' : '☰'}
                </button>

                {/* 桌面导航 */}
                <nav className="qc-topbar__nav" aria-label="Primary">
                    <div
                        className={`qc-topbar__nav-item ${open === 'ecosystem' ? 'is-open' : ''}`}
                        onMouseEnter={() => !isMobile && setOpen('ecosystem')}
                    >
                        <button
                            className="qc-topbar__nav-btn "
                            onClick={() => toggleSection('ecosystem')}
                            aria-expanded={open === 'ecosystem'}
                        >
                            {t('nav.ecosystem')} ▾
                        </button>
                        {open === 'ecosystem' && (
                            <div className="qc-topbar__menu" role="menu">
                                <Link to="/ecosystem/sr" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.sr')}
                                </Link>
                                <Link to="/ecosystem/wallets" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.wallets')}
                                </Link>
                                <Link
                                    to="/ecosystem/explorer"
                                    className="qc-topbar__menu-item"
                                    onClick={closeDrawer}
                                >
                                    {t('nav.explorer')}
                                </Link>
                                <Link to="/ecosystem/dapps" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.dapps')}
                                </Link>
                                <Link to="/ecosystem/bridge" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.bridge')}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div
                        className={`qc-topbar__nav-item ${open === 'token' ? 'is-open' : ''}`}
                        onMouseEnter={() => !isMobile && setOpen('token')}
                    >
                        <button
                            className="qc-topbar__nav-btn"
                            onClick={() => toggleSection('token')}
                            aria-expanded={open === 'token'}
                        >
                            {t('nav.token')} ▾
                        </button>
                        {open === 'token' && (
                            <div className="qc-topbar__menu" role="menu">
                                <Link to="/token/trx" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.trx')}
                                </Link>
                                <Link
                                    to="/ecosystem/explorer/tokens"
                                    className="qc-topbar__menu-item"
                                    onClick={closeDrawer}
                                >
                                    {t('nav.commonTokens')}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div
                        className={`qc-topbar__nav-item ${open === 'developer' ? 'is-open' : ''}`}
                        onMouseEnter={() => !isMobile && setOpen('developer')}
                    >
                        <button
                            className="qc-topbar__nav-btn"
                            onClick={() => toggleSection('developer')}
                            aria-expanded={open === 'developer'}
                        >
                            {t('nav.developer')} ▾
                        </button>
                        {open === 'developer' && (
                            <div className="qc-topbar__menu" role="menu">
                                <Link to="/dev/whitepaper" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.whitepaper')}
                                </Link>
                                <Link to="/dev/github" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.github')}
                                </Link>
                                <Link to="/dev/security" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.security')}
                                </Link>
                                <Link to="/dev/bounty" className="qc-topbar__menu-item" onClick={closeDrawer}>
                                    {t('nav.bounty')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* AI 探索 */}
                    <div className="qc-topbar__nav-item">
                        <Link to="/ai/explore" className="qc-topbar__nav-btn" onClick={closeDrawer}>
                            {t('nav.ai')}
                        </Link>
                    </div>
                </nav>

                {/* 桌面动作区 */}
                <div className="qc-topbar__actions">
                    {/* 语言切换 */}
                    <select
                        className="qc-topbar__select qc-topbar__select--compact"
                        value={i18n.language?.startsWith('zh') ? 'zh' : 'en'}
                        onChange={onLangChange}
                        aria-label={t('actions.changeLanguage') || 'Change language'}
                    >
                        <option value="zh">简体中文</option>
                        <option value="en">English</option>
                    </select>

                    {/* 搜索框：按钮固定可见 */}
                    <div className="qc-topbar__search qc-topbar__search--compact" role="search">
                        <input
                            placeholder={t('actions.searchPlaceholder') || 'Search…'}
                            aria-label={t('actions.search') || 'Search'}
                        />
                        <button type="button" aria-label={t('actions.search') || 'Search'}>
                            🔍
                        </button>
                    </div>

                    {/* 登录态切换 */}
                    {!loading && authed ? (
                        <>
                            <div className="qc-topbar__user" title={displayName} aria-label={displayName}>
                                <span>您好</span>
                                <span className="qc-topbar__user-name">{displayName}</span>
                            </div>
                            <button
                                className="qc-topbar__btn qc-topbar__btn--ghost"
                                onClick={onLogout}
                                aria-label={t('actions.logout') || 'Logout'}
                            >
                                {t('actions.logout') || '登出'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to={LOGIN_PATH}
                                className="qc-topbar__btn qc-topbar__btn--ghost"
                                onClick={closeDrawer}
                            >
                                {t('actions.connectWallet')}
                            </Link>
                            <button
                                className="qc-topbar__btn qc-topbar__btn--primary"
                                onClick={toLogin}
                                aria-label={t('actions.login') || 'Login'}
                            >
                                {t('actions.login') || 'Login'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 小屏抽屉容器（样式控制显示） */}
            <div id="qc-topbar-drawer" className="qc-topbar__drawer" aria-hidden={!drawer} />
        </header>
    );
}
