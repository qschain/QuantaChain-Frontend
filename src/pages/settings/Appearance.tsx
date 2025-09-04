import Card from '../../components/Card'
import { useUI } from '../../state/UIProvider'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Appearance(){
    const { t, i18n } = useTranslation()
    const { theme, setTheme, language, setLanguage, currency, setCurrency } = useUI()

    // 注意：为了在切换语言后列表中的 name 文案也更新，这里监听 i18n.language 重建数组
    const [layout, setLayout] = useState(() => ([
        { key:'portfolio', name:t('appearance.widgets.portfolio'), visible:true },
        { key:'staking',   name:t('appearance.widgets.staking'),   visible:true },
        { key:'defi',      name:t('appearance.widgets.defi'),      visible:true },
        { key:'nft',       name:t('appearance.widgets.nft'),       visible:true },
        { key:'activity',  name:t('appearance.widgets.activity'),  visible:true },
    ]))
    useEffect(()=>{
        setLayout(ls => ls.map(x => ({ ...x, name: t(`appearance.widgets.${x.key}` as any) })))
    }, [i18n.language, t])

    const changeLang = (lng: 'zh' | 'en') => {
        setLanguage(lng as any)
        i18n.changeLanguage(lng)
    }

    const themes: Array<{key:'dark'|'deep'|'light'|'bright'; label:string}> = [
        { key:'dark',   label:t('theme.dark') },
        { key:'deep',   label:t('theme.deep') },
        { key:'light',  label:t('theme.light') },
        { key:'bright', label:t('theme.bright') },
    ]

    return (
        <div className="grid" style={{gridTemplateColumns:'1fr 360px', gap:'var(--space-6)'}}>

            <div className="grid" style={{gap:'var(--space-6)'}}>

                <Card title={t('appearance.themeTitle')}>
                    <div className="row" style={{gap:12}}>
                        {themes.map(ti=>(
                            <button
                                key={ti.key}
                                className={`btn ${theme===ti.key ? '' : 'secondary'}`}
                                aria-pressed={theme===ti.key}
                                onClick={()=>setTheme(ti.key)}
                                style={ theme===ti.key ? { background: 'var(--accent)', color:'#fff' } : undefined }
                            >
                                {ti.label}
                            </button>
                        ))}
                    </div>
                </Card>

                <Card title={t('appearance.homeLayout')} right={<span className="secondary">{t('appearance.reorderHint')}</span>}>
                    <div className="grid" style={{gap:10}}>
                        {layout.map((x, idx)=>(
                            <div key={x.key} className="row space-between card" style={{padding:'12px 16px'}}>
                                <div className="row" style={{gap:10}}>
                                    <span className="badge">☰</span>
                                    <div>{x.name}</div>
                                </div>
                                <div className="row" style={{gap:10}}>
                                    <button className="btn secondary" onClick={()=>{
                                        const copy=[...layout]; const i=Math.max(0, idx-1); [copy[i],copy[idx]]=[copy[idx],copy[i]]; setLayout(copy)
                                    }}>{t('actions.moveUp')}</button>
                                    <button className="btn secondary" onClick={()=>{
                                        const copy=[...layout]; const i=Math.min(layout.length-1, idx+1); [copy[i],copy[idx]]=[copy[idx],copy[i]]; setLayout(copy)
                                    }}>{t('actions.moveDown')}</button>
                                    <button className="btn ghost" onClick={()=>setLayout(layout.map(it=>it.key===x.key?{...it, visible:!it.visible}:it))}>
                                        {x.visible ? t('actions.hide') : t('actions.show')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title={t('appearance.langCurrency')}>
                    <div className="row" style={{gap:14}}>
                        <div>
                            <div className="mb-2">{t('appearance.language')}</div>
                            <select className="select" value={language} onChange={e=>changeLang(e.target.value as any)}>
                                <option value="zh">{t('lang.zh')}</option>
                                <option value="en">{t('lang.en')}</option>
                            </select>
                        </div>
                        <div>
                            <div className="mb-2">{t('appearance.currency')}</div>
                            <select className="select" value={currency} onChange={e=>setCurrency(e.target.value as any)}>
                                <option value="USD">{t('currency.usd')}</option>
                                <option value="CNY">{t('currency.cny')}</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <div className="row" style={{gap:10}}>
                    <button className="btn ghost">{t('actions.resetDefault')}</button>
                    <button className="btn">{t('actions.saveChanges')}</button>
                </div>
            </div>

            <Card title={t('appearance.livePreview')}>
                <div className="card" style={{background:'var(--bg-surface)', marginBottom:10}}>
                    <div className="row space-between"><div>{t('preview.portfolio')}</div><div className="secondary">$12,458.32</div></div>
                </div>
                <div className="card" style={{background:'var(--bg-surface)', marginBottom:10}}>
                    <div className="row space-between"><div>{t('preview.staking')}</div><div className="secondary">+5.2% APY</div></div>
                </div>
                <div className="card" style={{background:'var(--bg-surface)'}}>
                    <div className="row space-between"><div>{t('preview.defi')}</div><div className="secondary">3 {t('preview.protocols')}</div></div>
                </div>
                <div className="row" style={{gap:8, marginTop:12}}>
                    <div className="badge" style={{background:'var(--accent)', borderColor:'var(--accent)'}}>●</div>
                    <div className="badge green">●</div>
                    <div className="badge">●</div>
                </div>
            </Card>
        </div>
    )
}
