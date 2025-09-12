import TopNav from '../../../app/layouts/TopNav';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './landing.css';

export default function Landing() {
    const { t } = useTranslation('home');
    const secondRef = useRef<HTMLElement | null>(null);
    const nav = useNavigate();

    const scrollToSecond = () => {
        const el = secondRef.current;
        if (!el) return;
        const header = document.querySelector('.qc-header') as HTMLElement | null;
        const offset = header?.offsetHeight ?? 72;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <div className="qc-landing-fullpage">
            <TopNav />

            {/* 第一屏：整屏 Hero */}
            <section className="qc-screen qc-hero-screen">
                <div className="qc-hero__content">
                    <h1 className="qc-hero__title">
                        <span>{t('hero.title1')}</span><br />
                        <span>{t('hero.title2')}</span>
                    </h1>
                    <p className="qc-hero__desc">{t('hero.subtitle')}</p>
                    <div className="qc-hero__cta">
                        <button className="qc-btn primary" onClick={scrollToSecond}>
                            {t('hero.cta')} →
                        </button>
                    </div>
                </div>
                <div className="qc-hero__scroll-hint">⌄</div>
            </section>

            {/* 第二屏：模块区（整屏） */}
            <section ref={secondRef} className="qc-screen qc-modules-screen" id="modules">
                <div className="qc-modules__grid">
                    <ModuleCard
                        icon="🛡"
                        title={t('modules.sr.title')}
                        desc={t('modules.sr.desc')}
                        onClick={() => nav('/sr')}
                    />
                    <ModuleCard
                        icon="👛"
                        title={t('modules.wallets.title')}
                        desc={t('modules.wallets.desc')}
                        onClick={() => nav('/ecosystem/wallets')}
                    />
                    <ModuleCard
                        icon="🔎"
                        title={t('modules.explorer.title')}
                        desc={t('modules.explorer.desc')}
                        onClick={() => nav('/ecosystem/explorer')}
                    />
                    <ModuleCard
                        icon="🧩"
                        title={t('modules.dapps.title')}
                        desc={t('modules.dapps.desc')}
                        onClick={() => nav('/ecosystem/dapps')}
                    />
                    <ModuleCard
                        icon="🔗"
                        title={t('modules.bridge.title')}
                        desc={t('modules.bridge.desc')}
                        onClick={() => nav('/ecosystem/bridge')}
                    />
                    <ModuleCard
                        icon="🖼"
                        title={t('modules.nft.title')}
                        desc={t('modules.nft.desc')}
                        onClick={() => {/* 未来跳转 */}}
                    />
                </div>

                {/* 开发者区（第二屏末尾，下滑还能看到下一段） */}
                <div className="qc-dev">
                    <h2 className="qc-dev__title">{t('dev.title')}</h2>
                    <p className="qc-dev__subtitle">{t('dev.subtitle')}</p>
                    <div className="qc-dev__grid">
                        <FeatureCard
                            icon="🛡"
                            title={t('dev.security.title')}
                            desc={t('dev.security.desc')}
                            onClick={() => nav('/dev/security')}
                        />
                        <FeatureCard
                            icon="🐞"
                            title={t('dev.bounty.title')}
                            desc={t('dev.bounty.desc')}
                            onClick={() => nav('/dev/bounty')}
                        />
                    </div>
                </div>
            </section>

            {/* 页脚（第二屏下滑继续可见） */}
            <footer className="qc-footer">
                <div className="qc-footer__content">
                    <div className="qc-footer__brand">
                        <div className="qc-footer__brand-title">{t('footer.brandTitle')}</div>
                        <p className="qc-footer__brand-desc">{t('footer.brandDesc')}</p>
                        <p className="qc-footer__brand-links">
                            {t('footer.summary')}
                            <br />
                            {t('footer.devTools')}
                            <br />
                            {t('footer.devLinks')}
                            <br />
                            {t('footer.contact')}
                        </p>
                    </div>
                    <div className="qc-footer__meta">
                        <span>{t('footer.lang')}</span>
                        <button className="qc-footer__theme">{t('footer.theme')}</button>
                        <span className="qc-footer__ver">{t('footer.version')} v2.1.0</span>
                    </div>
                </div>
                <div className="qc-footer__copy">
                    © 2025 QuantaChain Technologies Ltd. {t('footer.version')} v2.1.0
                </div>
            </footer>
        </div>
    );
}

function ModuleCard({ icon, title, desc, onClick }:{
    icon: string; title: string; desc: string; onClick: () => void;
}) {
    return (
        <button className="qc-card" onClick={onClick}>
            <div className="qc-card__icon">{icon}</div>
            <div className="qc-card__title">{title}</div>
            <div className="qc-card__desc">{desc}</div>
        </button>
    );
}

function FeatureCard({ icon, title, desc, onClick }:{
    icon: string; title: string; desc: string; onClick: () => void;
}) {
    return (
        <button className="qc-feature" onClick={onClick}>
            <div className="qc-feature__icon">{icon}</div>
            <div className="qc-feature__title">{title}</div>
            <div className="qc-feature__desc">{desc}</div>
        </button>
    );
}
