import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../core/i18n/i18n';
import './topnav.css';

export default function TopNav() {
    const [open, setOpen] = useState<string | null>(null);
    const { t, i18n } = useTranslation('common');

    const onLangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await changeAppLanguage(e.target.value as 'en' | 'zh');
    };

    return (
        <header className="qc-header" onMouseLeave={() => setOpen(null)}>
            <div className="qc-header__inner">
                <Link to="/" className="qc-logo">
                    <span className="qc-logo__dot" /> {t('brand')}
                </Link>

                <nav className="qc-nav">
                    <div className="qc-nav__item" onMouseEnter={() => setOpen('ecosystem')}>
                        <button className="qc-nav__btn">{t('nav.ecosystem')} ▾</button>
                        {open === 'ecosystem' && (
                            <div className="qc-menu">
                                <Link to="/ecosystem/sr" className="qc-menu__item">{t('nav.sr')}</Link>
                                <Link to="/ecosystem/wallets" className="qc-menu__item">{t('nav.wallets')}</Link>
                                <Link to="/ecosystem/explorer" className="qc-menu__item">{t('nav.explorer')}</Link>
                                <Link to="/ecosystem/dapps" className="qc-menu__item">{t('nav.dapps')}</Link>
                                <Link to="/ecosystem/bridge" className="qc-menu__item">{t('nav.bridge')}</Link>
                            </div>
                        )}
                    </div>

                    <div className="qc-nav__item" onMouseEnter={() => setOpen('token')}>
                        <button className="qc-nav__btn">{t('nav.token')} ▾</button>
                        {open === 'token' && (
                            <div className="qc-menu">
                                <Link to="/token/trx" className="qc-menu__item">{t('nav.trx')}</Link>
                                <Link to="/token/common" className="qc-menu__item">{t('nav.commonTokens')}</Link>
                            </div>
                        )}
                    </div>

                    <div className="qc-nav__item" onMouseEnter={() => setOpen('developer')}>
                        <button className="qc-nav__btn">{t('nav.developer')} ▾</button>
                        {open === 'developer' && (
                            <div className="qc-menu">
                                <Link to="/dev/whitepaper" className="qc-menu__item">{t('nav.whitepaper')}</Link>
                                <Link to="/dev/github" className="qc-menu__item">{t('nav.github')}</Link>
                                <Link to="/dev/security" className="qc-menu__item">{t('nav.security')}</Link>
                                <Link to="/dev/bounty" className="qc-menu__item">{t('nav.bounty')}</Link>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="qc-actions">
                    <select className="qc-select" value={i18n.language?.startsWith('zh') ? 'zh' : 'en'} onChange={onLangChange}>
                        <option value="zh">简体中文</option>
                        <option value="en">English</option>
                    </select>

                    <div className="qc-search">
                        <input placeholder={t('actions.searchPlaceholder')} />
                        <button>🔍</button>
                    </div>

                    <Link to="/ecosystem/wallets/your/auth/login" className="qc-btn ghost">{t('actions.connectWallet')}</Link>
                    <Link to="/ecosystem/wallets/your/auth/login" className="qc-btn primary">{t('actions.login')}</Link>
                </div>
            </div>
        </header>
    );
}
