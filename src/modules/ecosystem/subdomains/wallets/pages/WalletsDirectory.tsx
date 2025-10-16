// src/modules/ecosystem/features/wallets/pages/WalletsDirectory.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './WalletsDirectory.css';

type Platform = 'web' | 'mobile' | 'desktop';
type Category = Platform | 'all';
type Tag = 'official' | 'featured' | 'new' | 'hardware';

type Wallet = {
    id: string;
    name: string;
    desc: string;
    tags?: Tag[];
    platforms: Platform[];
    site?: string;
    download?: string;
    isYourWallet?: boolean; // 你的钱包
};

const CATS: Category[] = ['all', 'web', 'mobile', 'desktop'];

export default function WalletsDirectory() {
    const { t } = useTranslation('wallets');
    const nav = useNavigate();
    const [cat, setCat] = useState<Category>('all');

    const wallets: Wallet[] = useMemo(
        () => [
            {
                id: 'quanta',
                name: t('cards.quanta.title'),
                desc: t('cards.quanta.desc'),
                tags: ['new','official', 'featured'],
                platforms: ['web'],
                isYourWallet: true,
            },
            {
                id: 'tronlink',
                name: 'TronLink',
                desc: t('cards.tronlink.desc'),
                tags: ['featured'],
                platforms: ['web', 'mobile', 'desktop'],
                site: 'https://www.tronlink.org',
            },
            {
                id: 'tokenpocket',
                name: 'TokenPocket',
                desc: t('cards.tp.desc'),
                tags: ['featured'],
                platforms: ['mobile', 'web'],
                site: 'https://www.tokenpocket.pro',
            },
            {
                id: 'imtoken',
                name: 'imToken',
                desc: t('cards.imtoken.desc'),
                platforms: ['mobile', 'web'],
                site: 'https://token.im',
            },
            {
                id: 'ledger',
                name: 'Ledger',
                desc: t('cards.ledger.desc'),
                tags: ['hardware', 'new'],
                platforms: ['desktop', 'mobile'],
                site: 'https://www.ledger.com',
            }
        ],
        [t]
    );

    const filtered = wallets.filter(w => (cat === 'all' ? true : w.platforms.includes(cat)));

    return (
        <div className="wallets-page">
            {/* 顶部 Hero */}
            <section className="wallets-hero">
                <div className="wallets-hero__inner">
                    <h1 className="wallets-hero__title">{t('hero.title')}</h1>
                    <p className="wallets-hero__subtitle">{t('hero.subtitle')}</p>
                    <div className="wallets-hero__tip">{t('hero.tip')}</div>
                </div>
            </section>

            {/* 类别切换 */}
            <div className="wallets-tabs">
                {CATS.map(c => (
                    <button
                        key={c}
                        className={`tab ${cat === c ? 'active' : ''}`}
                        onClick={() => setCat(c)}
                    >
                        {t(`tabs.${c}`)}
                    </button>
                ))}
                <div className="wallets-tabs__right">
                    <button className="pill">{t('sort.popular')} ▾</button>
                </div>
            </div>

            {/* 列表 */}
            <div className="wallets-grid">
                {filtered.map(w => (
                    <div key={w.id} className="wallet-card">
                        <div className="wallet-card__header">
                            <div className="wallet-avatar" aria-hidden />
                            <div className="wallet-title">
                                <div className="name">{w.name}</div>
                                <div className="tags">
                                    {w.tags?.includes('official') && <span className="tag tag-blue">{t('tags.official')}</span>}
                                    {w.tags?.includes('featured') && <span className="tag tag-purple">{t('tags.featured')}</span>}
                                    {w.tags?.includes('new') && <span className="tag tag-green">{t('tags.new')}</span>}
                                    {w.tags?.includes('hardware') && <span className="tag tag-cyan">{t('tags.hardware')}</span>}
                                </div>
                            </div>
                        </div>

                        <p className="wallet-desc">{w.desc}</p>

                        <div className="wallet-platforms">
                            <PlatformIcon p="web" active={w.platforms.includes('web')} />
                            <PlatformIcon p="mobile" active={w.platforms.includes('mobile')} />
                            <PlatformIcon p="desktop" active={w.platforms.includes('desktop')} />
                        </div>

                        <div className="wallet-actions">
                            {w.isYourWallet ? (
                                <a
                                    className="link"
                                    onClick={e => {
                                        e.preventDefault();
                                        nav('/ecosystem/wallets/quanta/dashboard');
                                    }}
                                    href="/ecosystem/wallets/quanta/dashboard"
                                >
                                    {t('actions.enter')}
                                </a>
                            ) : (
                                <>
                                    <a className="link" href={w.site ?? '#'} target="_blank" rel="noreferrer">
                                        {t('actions.visit')}
                                    </a>
                                    <button className="btn-download">{t('actions.download')}</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 提交/支持 & FAQ */}
            <section className="wallets-help">
                <h2 className="wallets-help__title">{t('cta.title')}</h2>
                <p className="wallets-help__subtitle">{t('cta.subtitle')}</p>
                <div className="wallets-cta">
                    <button className="btn-cta">{t('cta.submit')}</button>
                    <button className="btn-cta ghost">{t('cta.support')}</button>
                </div>

                <h3 className="faq-title">{t('faq.title')}</h3>
                <Accordion
                    items={[
                        { id: 'q1', title: t('faq.q1.title'), content: t('faq.q1.content') },
                        { id: 'q2', title: t('faq.q2.title'), content: t('faq.q2.content') },
                        { id: 'q3', title: t('faq.q3.title'), content: t('faq.q3.content') },
                    ]}
                />
            </section>
        </div>
    );
}

function PlatformIcon({ p, active }: { p: Platform; active: boolean }) {
    const map: Record<Platform, string> = { web: '🌐', mobile: '📱', desktop: '🖥' };
    return (
        <span className={`plat ${active ? 'on' : ''}`} title={p}>
      {map[p]}
    </span>
    );
}

function Accordion({ items }: { items: { id: string; title: string; content: string }[] }) {
    const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
    return (
        <div className="faq">
            {items.map(it => (
                <div key={it.id} className="faq-item">
                    <button className="faq-head" onClick={() => setOpen(open === it.id ? null : it.id)}>
                        <span>{it.title}</span>
                        <span className="sign">{open === it.id ? '−' : '+'}</span>
                    </button>
                    {open === it.id && <div className="faq-body">{it.content}</div>}
                </div>
            ))}
        </div>
    );
}
