import Card from '../../components/Card'
import { useWalletTheme } from '../../ThemeProvider'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type ThemeKey = 'dark' | 'light' | 'system'| 'bright'

export default function Appearance() {
    const { t, i18n } = useTranslation(['wallet'])
    const { theme, setTheme, language, setLanguage, currency, setCurrency } = useWalletTheme()

    // —— 布局项：根据语言变化更新 name —— //
    const [layout, setLayout] = useState(() => ([
        { key: 'portfolio', name: t('appearance.widgets.portfolio'), visible: true },
        { key: 'staking',   name: t('appearance.widgets.staking'),   visible: true },
        { key: 'defi',      name: t('appearance.widgets.defi'),      visible: true },
        { key: 'nft',       name: t('appearance.widgets.nft'),       visible: true },
        { key: 'activity',  name: t('appearance.widgets.activity'),  visible: true },
    ]))
    useEffect(() => {
        setLayout(ls => ls.map(x => ({ ...x, name: t(`appearance.widgets.${x.key}` as any) })))
    }, [i18n.language, t])

    const changeLang = (lng: 'zh' | 'en') => {
        setLanguage(lng as any)
        i18n.changeLanguage(lng)
    }

    // —— 主题选项：增加 system —— //
    const themes: Array<{ key: ThemeKey; label: string }> = useMemo(() => ([
        { key: 'system', label: t('theme.system') },
        { key: 'dark',   label: t('theme.dark') },
        { key: 'light',  label: t('theme.light') },
        { key: 'bright',  label: t('theme.bright') },
    ]), [t])

    // —— 如果 UIProvider 未设置 data-theme，这里兜底设置（可按需删除） —— //
    useEffect(() => {
        const resolveSystem = () =>
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

        const apply = (th: ThemeKey) => {
            const eff = th === 'system' ? resolveSystem() : th
            document.documentElement.setAttribute('data-theme', eff)
        }

        apply(theme as ThemeKey)

        // system 模式跟随系统
        if (theme === 'system') {
            const mql = window.matchMedia('(prefers-color-scheme: dark)')
            const onChange = () => apply('system')
            mql.addEventListener?.('change', onChange)
            return () => mql.removeEventListener?.('change', onChange)
        }
    }, [theme])

    return (
        <div className="grid" style={{ gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)' }}>

            <div className="grid" style={{ gap: 'var(--space-6)' }}>

                {/* —— 主题卡片 —— */}
                <Card title={t('appearance.themeTitle')}>
                    <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
                        {themes.map(ti => {
                            const active = theme === ti.key
                            return (
                                <button
                                    key={ti.key}
                                    className={`btn ${active ? '' : 'secondary'}`}
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setTheme(ti.key as any)}
                                    // 统一用 --primary，避免 --accent 未定义
                                    style={active ? { background: 'var(--primary)', color: '#fff' } : undefined}
                                >
                                    {ti.label}
                                </button>
                            )
                        })}
                    </div>
                </Card>

                {/* —— 首页布局顺序/显隐 —— */}
                <Card
                    title={t('appearance.homeLayout')}
                    right={<span className="secondary">{t('appearance.reorderHint')}</span>}
                >
                    <div className="grid" style={{ gap: 10 }}>
                        {layout.map((x, idx) => (
                            <div key={x.key} className="row space-between card" style={{ padding: '12px 16px' }}>
                                <div className="row" style={{ gap: 10 }}>
                                    <span className="badge" aria-hidden>☰</span>
                                    <div>{x.name}</div>
                                </div>
                                <div className="row" style={{ gap: 10 }}>
                                    <button
                                        className="btn secondary"
                                        onClick={() => {
                                            if (idx === 0) return
                                            const copy = [...layout]
                                            const i = Math.max(0, idx - 1)
                                            ;[copy[i], copy[idx]] = [copy[idx], copy[i]]
                                            setLayout(copy)
                                        }}
                                    >
                                        {t('actions.moveUp')}
                                    </button>
                                    <button
                                        className="btn secondary"
                                        onClick={() => {
                                            if (idx === layout.length - 1) return
                                            const copy = [...layout]
                                            const i = Math.min(layout.length - 1, idx + 1)
                                            ;[copy[i], copy[idx]] = [copy[idx], copy[i]]
                                            setLayout(copy)
                                        }}
                                    >
                                        {t('actions.moveDown')}
                                    </button>
                                    <button
                                        className="btn ghost"
                                        onClick={() => setLayout(layout.map(it => it.key === x.key ? { ...it, visible: !it.visible } : it))}
                                        aria-pressed={x.visible}
                                    >
                                        {x.visible ? t('actions.hide') : t('actions.show')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* —— 语言 & 计价货币 —— */}
                <Card title={t('appearance.langCurrency')}>
                    <div className="row" style={{ gap: 14, flexWrap: 'wrap' }}>
                        <div>
                            <div className="mb-2">{t('appearance.language')}</div>
                            <select className="select" value={language} onChange={e => changeLang(e.target.value as any)}>
                                <option value="zh">{t('lang.zh')}</option>
                                <option value="en">{t('lang.en')}</option>
                            </select>
                        </div>
                        <div>
                            <div className="mb-2">{t('appearance.currency')}</div>
                            <select className="select" value={currency} onChange={e => setCurrency(e.target.value as any)}>
                                <option value="USD">{t('currency.usd')}</option>
                                <option value="CNY">{t('currency.cny')}</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn ghost">{t('actions.resetDefault')}</button>
                    <button className="btn">{t('actions.saveChanges')}</button>
                </div>
            </div>

            {/* —— 右侧实时预览 —— */}
            <Card title={t('appearance.livePreview')}>
                <div className="card" style={{ background: 'var(--bg-surface)', marginBottom: 10 }}>
                    <div className="row space-between">
                        <div>{t('preview.portfolio')}</div>
                        <div className="secondary">$12,458.32</div>
                    </div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)', marginBottom: 10 }}>
                    <div className="row space-between">
                        <div>{t('preview.staking')}</div>
                        <div className="secondary">+5.2% APY</div>
                    </div>
                </div>
                <div className="card" style={{ background: 'var(--bg-surface)' }}>
                    <div className="row space-between">
                        <div>{t('preview.defi')}</div>
                        <div className="secondary">3 {t('preview.protocols')}</div>
                    </div>
                </div>
                <div className="row" style={{ gap: 8, marginTop: 12 }}>
                    {/* 统一用变量，避免硬编码 */}
                    <div className="badge" style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff' }}>●</div>
                    <div className="badge green">●</div>
                    <div className="badge">●</div>
                </div>
            </Card>
        </div>
    )
}
