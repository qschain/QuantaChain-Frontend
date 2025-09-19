// src/pages/asset/FiatRamp.tsx
import { useMemo, useState } from 'react'
import Card from '../../components/Card'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// ... existing code ...
type Mode = 'buy'|'sell'
const fiatPresets = [50,100,250,500,1000]

export default function FiatRamp({ defaultMode='buy' as Mode }: { defaultMode?: Mode }) {
    const [sp] = useSearchParams()
    const initial = (sp.get('tab') as Mode) || defaultMode
    const [mode, setMode] = useState<Mode>(initial)
    const [fiat, setFiat] = useState(100)
    const [region, setRegion] = useState('US')
    const [currency, setCurrency] = useState('USD')
    const [asset, setAsset] = useState('ETH')
    const nav = useNavigate()
    const { t } = useTranslation(['wallet'])

    const title = mode==='buy' ? t('ramp.buy') : t('ramp.sell')
    const bigText = useMemo(()=> {
        return mode==='buy'
            ? `$${fiat}`
            : `${(fiat/4415).toFixed(4)} ${asset}` // 简单演示换算（mock）
    }, [fiat, asset, mode])

    return (
        <div className="container" style={{maxWidth:900}}>
            {/* 顶部 Tab */}
            <div className="card" style={{padding:'18px 24px'}}>
                <div className="row" style={{gap:32, borderBottom:'1px solid var(--border)', paddingBottom:10}}>
                    <button className={`btn ghost ${mode==='buy'?'':'secondary'}`} onClick={()=>setMode('buy')}>
                        {t('ramp.buy')}
                    </button>
                    <button className={`btn ghost ${mode==='sell'?'':'secondary'}`} onClick={()=>setMode('sell')}>
                        {t('ramp.sell')}
                    </button>
                </div>

                {/* 第一行：账户/地区/法币 */}
                <div className="row" style={{gap:12, marginTop:16}}>
                    <div className="row" style={{gap:10, flex:1}}>
                        <div className="card" style={{background:'var(--bg-surface)', padding:'10px 12px', width:'100%'}}>
                            <div className="secondary">{t('ramp.connectAccount')}</div>
                            <div className="row space-between" style={{marginTop:6}}>
                                <div className="secondary">{t('ramp.notConnected')}</div>
                                <span className="badge">▾</span>
                            </div>
                        </div>
                    </div>
                    <select className="select" value={region} onChange={e=>setRegion(e.target.value)} style={{width:120}}>
                        <option value="CN">{t('ramp.region.cn')}</option>
                        <option value="US">{t('ramp.region.us')}</option>
                        <option value="EU">{t('ramp.region.eu')}</option>
                    </select>
                    <select className="select" value={currency} onChange={e=>setCurrency(e.target.value)} style={{width:120}}>
                        <option value="CNY">{t('ramp.currency.cny')}</option>
                        <option value="USD">{t('ramp.currency.usd')}</option>
                        <option value="EUR">{t('ramp.currency.eur')}</option>
                    </select>
                </div>

                {/* 大额展示 */}
                <div style={{textAlign:'center', fontSize:48, fontWeight:900, margin:'28px 0'}}>
                    {bigText}
                </div>

                {/* 预设金额 */}
                {mode==='buy' && (
                    <div className="row" style={{
                        gap:0, justifyContent:'center', border:'1px solid var(--border)',
                        borderRadius:22, overflow:'hidden', width:'fit-content', margin:'0 auto 18px'
                    }}>
                        {fiatPresets.map((x,i)=>(
                            <button key={x}
                                    className="btn ghost"
                                    style={{
                                        border:'none', borderRight: i===fiatPresets.length-1?'none':'1px solid var(--border)',
                                        borderRadius:0, padding:'8px 22px',
                                        background: x===fiat ? '#ffffff11' : 'transparent'
                                    }}
                                    onClick={()=>setFiat(x)}
                            >
                                ${x}
                            </button>
                        ))}
                    </div>
                )}

                {/* 资产选择 */}
                <div className="card" style={{background:'var(--bg-elevated)', padding:16, marginBottom:14}}>
                    <div className="row space-between">
                        <div className="row" style={{gap:10}}>
                            <div className="badge">◎</div>
                            <div>
                                <div style={{fontSize:18, fontWeight:800}}>Ethereum</div>
                                <div className="secondary">{t('ramp.network.ethereumMainnet')}</div>
                            </div>
                        </div>
                        <div className="row" style={{gap:12}}>
                            {mode==='sell' && <div className="secondary">0 {asset}</div>}
                            <select className="select" value={asset} onChange={e=>setAsset(e.target.value)}>
                                <option value="ETH">ETH</option>
                                <option value="BTC">BTC</option>
                                <option value="USDT">USDT</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 支付方式卡片 */}
                <div className="card" style={{background:'var(--bg-elevated)', padding:16}}>
                    <div className="row space-between">
                        <div className="row" style={{gap:10}}>
                            <span className="badge">💳</span>
                            <div style={{fontWeight:700}}>{t('ramp.payment.card')}</div>
                        </div>
                        <button className="btn ghost">{t('ramp.change')}</button>
                    </div>
                    <div className="row" style={{gap:8, marginTop:12}}>
                        <span className="badge">VISA</span>
                        <span className="badge">Mastercard</span>
                        <span className="badge">UnionPay</span>
                    </div>
                </div>

                {/* 连接钱包按钮 */}
                <div className="card" style={{
                    marginTop:16, background:'#ffffff0c', border:'1px solid var(--border)',
                    borderRadius:16, padding:0
                }}>
                    <button className="btn" style={{
                        width:'100%', height:54, display:'flex', alignItems:'center', justifyContent:'center',
                        background:'#ffffff', color:'#111', borderRadius:16
                    }}>
                        {t('ramp.secureCta')}
                    </button>
                </div>

                {/* 底部说明/返回 */}
                <div className="row space-between" style={{marginTop:16}}>
                    <button className="btn ghost" onClick={()=>nav('/asset')}>{t('ramp.backToAssets')}</button>
                    <div className="secondary">{t('ramp.note')}</div>
                </div>
            </div>
        </div>
    )
}