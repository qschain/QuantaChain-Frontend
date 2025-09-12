import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import SelectNetwork from '../../components/SelectNetwork'
import { bridgeQuote } from '../../../../../../../services/api'
import { useTranslation } from 'react-i18next'

export default function BridgeTokens(){
    const [fromNet, setFromNet] = useState<string>()
    const [toNet, setToNet]     = useState<string>()
    const [amount, setAmount]   = useState<number>(0)
    const [quote, setQuote]     = useState<{send:number; gasUSD:number; bridgeFeePct:number; totalUSD:number} | undefined>()
    const { t} = useTranslation(['wallet'])

    useEffect(()=>{
        if (fromNet && toNet && amount>0) {
            bridgeQuote({ from: fromNet, to: toNet, amount }).then(setQuote)
        } else {
            setQuote(undefined)
        }
    }, [fromNet, toNet, amount])

    return (
        <div className="container" style={{maxWidth:960}}>
            <div className="card" style={{padding:'18px 22px'}}>
                <div className="row space-between">
                    <div>
                        <h2 style={{margin:'4px 0'}}>{t('bridge.title')}</h2>
                        <div className="secondary">{t('bridge.title')}</div>
                    </div>
                    <div className="row" style={{gap:8}}>
                        <button className="btn ghost">❓</button>
                        <button className="btn ghost">⚙</button>
                    </div>
                </div>

                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)', marginTop:16}}>
                    {/* 左列 */}
                    <div className="card soft" style={{padding:16}}>
                        <div className="secondary">{t('bridge.source')}</div>
                        <div style={{marginTop:8}}>
                            <SelectNetwork value={fromNet} onChange={setFromNet} placeholder={t('select.network')}/>
                        </div>

                        <div className="secondary" style={{marginTop:16}}>{t('bridge.amount')}</div>
                        <input
                            className="input"
                            placeholder="0.00"
                            value={amount ? amount : ''}
                            onChange={e=>setAmount(+e.target.value || 0)}
                        />
                    </div>

                    {/* 右列 */}
                    <div className="card soft" style={{padding:16}}>
                        <div className="secondary">{t('bridge.target')}</div>
                        <div style={{marginTop:8}}>
                            <SelectNetwork value={toNet} onChange={setToNet} placeholder={t('select.network')}/>
                        </div>

                        <div className="row" style={{justifyContent:'center', marginTop:22}}>
                            <button
                                className="btn ghost"
                                onClick={()=>{ const a=fromNet; setFromNet(toNet); setToNet(a||toNet) }}
                            >
                                {t('bridge.swapNetworks')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 费用合计 */}
                <div className="card" style={{marginTop:18}}>
                    <div className="secondary">{t('bridge.total')}</div>
                    <div style={{fontSize:28, fontWeight:900, marginTop:6}}>${quote?.totalUSD ?? 0}</div>
                    <div className="secondary" style={{marginTop:6}}>
                        {t('bridge.includesFee', { pct: quote?.bridgeFeePct ?? 0, gas: quote?.gasUSD ?? 0 })}
                    </div>
                </div>

                {/* 连接钱包 / 发起跨链 */}
                <div className="card" style={{marginTop:16, padding:0}}>
                    <button className="btn" style={{
                        width:'100%', height:54, display:'flex', alignItems:'center', justifyContent:'center',
                        background:'#fff', color:'#111', borderRadius:'var(--card-radius)'
                    }}>
                        {t('bridge.transfer')}
                    </button>
                </div>
            </div>
        </div>
    )
}
