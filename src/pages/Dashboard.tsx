import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Sparkline from '../components/Sparkline'
import Donut from '../components/Donut'
import QuickActions from '../components/QuickActions'
import { api } from '../services/api'
import { useTranslation } from 'react-i18next'

type TotalOverview = { totalUSD:number; diffUSD:number; diffPct:number; series:number[] }
type MainAsset = { icon:string; name:string; symbol:string; amount:number; usd:number;changePct:number }
type MarketRow = { pair:string; price:number; changePct:number }
type Activity = { type:'接收'|'发送'|'兑换'; asset:string; amount:string; time:string; delta?:string }

export default function Dashboard() {
    const [overview, setOverview] = useState<TotalOverview>()
    const [mainAssets, setMainAssets] = useState<MainAsset[]>([])
    const [market, setMarket] = useState<MarketRow[]>([])
    const [distribution, setDistribution] = useState<{label:string; value:number; color:string}[]>([])
    const [activities, setActivities] = useState<Activity[]>([])
    const { t, i18n } = useTranslation(['common'])

    useEffect(() => {
        api.getDashboard().then(d => {
            setOverview(d.overview)
            setMainAssets(d.mainAssets)
            setMarket(d.market)
            setDistribution(d.distribution)
            setActivities(d.activities)
        })
    }, [])

    const fmtCurrency = (n:number|undefined) =>
        (n ?? 0).toLocaleString(i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US', { style:'currency', currency:'USD' })

    const activityTypeText = (type: Activity['type']) => {
        switch (type) {
            case '接收': return t('activity.receive')
            case '发送': return t('activity.send')
            case '兑换': return t('activity.swap')
            default: return String(type)
        }
    }

    return (
        <div className="grid" style={{gap:'var(--space-6)'}}>
            {/* 顶部三卡片 */}
            <div className="grid" style={{gridTemplateColumns:'1.2fr 1fr 1fr', gap:'var(--space-6)'}}>
                <Card title={t('totalOverview')} right={<ToolbarSmall t={t} />}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 160px', gap:16, alignItems:'center'}}>
                        <div>
                            <div style={{fontSize:32, fontWeight:800}}>
                                {fmtCurrency(overview?.totalUSD)}
                            </div>
                            <div className="badge green" style={{marginTop:8}}>
                                +{fmtCurrency(overview?.diffUSD)} · +{overview?.diffPct}% 24h
                            </div>
                        </div>
                        <Sparkline values={overview?.series || []}/>
                    </div>
                </Card>

                <Card title={t('mainAssets')} right={<a className="secondary" href="/asset">↗</a>}>
                    <div className="grid" style={{gap:10}}>
                        {mainAssets.map(a=>(
                            <div key={a.symbol} className="row space-between card" style={{padding:'12px 14px', background:'var(--bg-surface)'}}>
                                <div className="row" style={{gap:10}}>
                                    <span className="badge">{a.symbol}</span>
                                    <div>
                                        <div style={{fontWeight:700}}>{a.name}</div>
                                        <div className="secondary">{a.amount} {a.symbol}</div>
                                    </div>
                                </div>
                                <div style={{textAlign:'right'}}>
                                    <div>{a.usd.toLocaleString(undefined,{style:'currency',currency:'USD'})}</div>
                                    <div className={`badge ${a.changePct>=0?'green':'red'}`} style={{marginTop:4}}>
                                        {a.changePct>=0?'+':''}{a.changePct}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title={t('marketSnapshot')} right={<RefreshBtn t={t} />}>
                    <div className="grid" style={{gap:10}}>
                        {market.map(m=>(
                            <div key={m.pair} className="row space-between card" style={{padding:'12px 14px', background:'var(--bg-surface)'}}>
                                <div>{m.pair}</div>
                                <div style={{textAlign:'right'}}>
                                    <div className={m.changePct>=0?'green-text':'red-text'} style={{fontWeight:600}}>
                                        ${m.price.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="secondary">
                            {t('marketCap')} <strong>$1.2T</strong>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 中部两卡片 */}
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)'}}>
                <Card title={t('assetDistribution')} right={<SelectGhost label={t('allAssets')} />}>
                    <div style={{display:'grid', gridTemplateColumns:'360px 1fr', gap:24}}>
                        <Donut data={distribution}/>
                        <div className="grid" style={{gap:10, alignContent:'start'}}>
                            {distribution.map(d=>(
                                <div key={d.label} className="row space-between">
                                    <div className="row" style={{gap:8}}>
                                        <span className="badge" style={{background:d.color, borderColor:d.color, color:'#0b0e11'}}>●</span>
                                        <div>{d.label}</div>
                                    </div>
                                    <div className="secondary">{d.value}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card title={t('latestActivities')} right={<SelectGhost label={t('all')} />}>
                    <div className="grid" style={{gap:10}}>
                        {activities.map((a, i)=>(
                            <div key={i} className="row space-between card" style={{padding:'12px 14px', background:'var(--bg-surface)'}}>
                                <div className="row" style={{gap:10}}>
                                    <span className={`badge ${a.type==='接收'?'green':a.type==='发送'?'':'blue'}`}>{activityTypeText(a.type)}</span>
                                    <div className="secondary">{a.time}</div>
                                </div>
                                <div className={a.delta?.includes('+')?'green-text':'red-text'}>{a.delta || a.amount}</div>
                            </div>
                        ))}
                        <div style={{textAlign:'center'}} className="secondary">{t('loadMoreActivities')}</div>
                    </div>
                </Card>
            </div>

            {/* 底部快捷操作条 */}
            <Card title={t('quickActions')}>
                <QuickActions />
            </Card>
        </div>
    )
}

function ToolbarSmall({ t }:{ t:(k:string)=>string }){
    return (
        <div className="row" style={{gap:8}}>
            <button className="btn ghost">⚙</button>
            <button className="btn ghost">⟳ {t('refresh')}</button>
        </div>
    )
}
function RefreshBtn({ t }:{ t:(k:string)=>string }){ return <button className="btn ghost">⟳ {t('refresh')}</button> }
function SelectGhost({label}:{label:string}){ return <button className="btn ghost">{label} ▾</button> }
