import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card'
import { getSwapQuote, getSwapHistory, type SwapHistoryItem } from '../../services/api'
import { useTranslation } from 'react-i18next'

type Token = 'BTC'|'ETH'

export default function SwapAsset() {
    const [from, setFrom] = useState<Token>('BTC')
    const [to, setTo] = useState<Token>('ETH')
    const [amountIn, setAmountIn] = useState<number>(0.5)
    const [quote, setQuote] = useState<{rate:number; outAmount:number; feeUSD:number; balance:number}>()
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<SwapHistoryItem[]>([])
    const { t } = useTranslation(['common'])

    // 报价
    async function fetchQuote() {
        setLoading(true)
        try { setQuote(await getSwapQuote({ from, to, amount: amountIn || 0 })) }
        finally { setLoading(false) }
    }
    useEffect(()=>{ fetchQuote() }, [from, to, amountIn])

    // 历史
    useEffect(()=>{ getSwapHistory().then(setHistory) }, [])

    // 互换
    function flip() {
        setFrom(to); setTo(from)
    }

    const disabled = !amountIn || amountIn<=0 || loading

    const rateText = useMemo(()=>{
        if (!quote) return '--'
        const r = quote.rate
        return from==='BTC'
            ? `1 BTC ≈ ${r.toFixed(3)} ETH`
            : `1 ETH ≈ ${(1/r).toFixed(5)} BTC`
    }, [quote, from])

    return (
        <div className="container" style={{maxWidth:1100}}>
            <div className="card" style={{maxWidth:840, margin:'24px auto'}}>
                <h2 style={{textAlign:'center', marginTop:0}}>{t('swap.title')}</h2>

                {/* 支付卡 */}
                <div className="card" style={{background:'var(--bg-surface)', padding:16, position:'relative'}}>
                    <div className="secondary">{t('swap.from')}</div>
                    <div className="row space-between" style={{marginTop:10}}>
                        <div className="row" style={{gap:10}}>
                            <select className="select" value={from} onChange={e=>setFrom(e.target.value as Token)}>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                            </select>
                            <div className="secondary">{t('sendAsset.balance')} {quote?.balance?.toFixed(4)} {from}</div>
                        </div>
                        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:10, alignItems:'center'}}>
                            <input className="input" value={amountIn} onChange={e=>setAmountIn(+e.target.value || 0)} />
                            <button className="btn secondary" onClick={()=>setAmountIn(+(quote?.balance || 0).toFixed(4))}>MAX</button>
                        </div>
                    </div>

                    {/* 中间切换按钮 */}
                    <button
                        className="btn ghost"
                        onClick={flip}
                        style={{
                            position:'absolute', left:'50%', transform:'translate(-50%, -50%)',
                            top:'100%', borderRadius:'50%', width:40, height:40
                        }}
                        title={t('swap.title')}
                    >↕</button>
                </div>

                {/* 获得卡 */}
                <div className="card" style={{background:'var(--bg-surface)', padding:16, marginTop:28}}>
                    <div className="secondary">{t('swap.to')}</div>
                    <div className="row space-between" style={{marginTop:10}}>
                        <div className="row" style={{gap:10}}>
                            <select className="select" value={to} onChange={e=>setTo(e.target.value as Token)}>
                                <option value="ETH">ETH</option>
                                <option value="BTC">BTC</option>
                            </select>
                            <div className="secondary">≈ ${(quote ? (quote.outAmount*2450).toFixed(2) : '--')}</div>
                        </div>
                        <div style={{fontSize:28, fontWeight:800}}>
                            {quote?.outAmount ?? '0.0000'}
                        </div>
                    </div>
                </div>

                {/* 汇率与费用 */}
                <div className="row space-between" style={{marginTop:18}}>
                    <div className="secondary">{t('swap.rate')}</div>
                    <div><a className="secondary">{rateText}</a></div>
                </div>
                <div className="row space-between" style={{marginTop:6}}>
                    <div className="secondary">{t('sendAsset.estimatedFee')} <span className="badge">i</span></div>
                    <div className="secondary">${quote?.feeUSD ?? '--'}</div>
                </div>

                {/* 操作区 */}
                <div className="row" style={{gap:12, justifyContent:'center', marginTop:18}}>
                    <button className="btn ghost">{t('cancel')}</button>
                    <button className="btn" disabled={disabled}>
                        ⚡ {t('swap.execute')}
                    </button>
                </div>
            </div>

            {/* 历史记录 */}
            <div className="card" style={{maxWidth:1100, margin:'0 auto'}}>
                <h3 style={{marginTop:0}}>{t('history')}</h3>
                <table className="table">
                    <thead>
                    <tr><th>{t('pair')}</th><th>{t('amount')}</th><th>{t('status')}</th><th>{t('time')}</th><th>{t('txHash')}</th></tr>
                    </thead>
                    <tbody>
                    {history.map((h, idx)=>(
                        <tr key={idx}>
                            <td>{h.pair}</td>
                            <td>{h.amount}</td>
                            <td>
                                <span className={`badge ${h.status==='成功'?'green':'red'}`}>
                                    {h.status==='成功'?t('status.success'):t('status.failed')}
                                </span>
                            </td>
                            <td>{h.time}</td>
                            <td className="secondary">{h.hash}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div style={{textAlign:'center', marginTop:10}} className="secondary">{t('loadMoreActivities')}</div>
            </div>
        </div>
    )
}
