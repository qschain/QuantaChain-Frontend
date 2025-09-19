import Card from '../components/Card'
import { useDashboardData } from '../model/DashboardContext'
import { useTranslation } from 'react-i18next'

export default function MainAssetsCard(){
    const { mainAssets } = useDashboardData()
    const { t } = useTranslation(['wallet'])
    return (
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
    )
}
