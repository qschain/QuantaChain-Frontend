import Card from '../components/Card'
import { useDashboardData } from '../model/DashboardContext'
import { useTranslation } from 'react-i18next'

export default function MarketCard(){
    const { market } = useDashboardData()
    const { t } = useTranslation(['wallet'])
    return (
        <Card title={t('marketSnapshot')} right={<button className="btn ghost">⟳ {t('refresh')}</button>}>
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
                <div className="secondary">{t('marketCap')} <strong>$1.2T</strong></div>
            </div>
        </Card>
    )
}
