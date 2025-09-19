import Card from '../components/Card'
import Donut from '../components/Donut'
import { useDashboardData } from '../model/DashboardContext'
import { useTranslation } from 'react-i18next'

export default function DistributionCard(){
    const { distribution, overview } = useDashboardData()
    const { t, i18n } = useTranslation(['wallet'])
    return (
        <Card title={t('assetDistribution')} right={<button className="btn ghost">{t('allAssets')} ▾</button>}>
            <div style={{display:'grid', gridTemplateColumns:'360px 1fr', gap:24}}>
                <Donut
                    data={distribution}
                    total={overview.totalUSD}
                    centerLabel={t('totalValue') || '总价值'}
                    format={(n)=>
                        (n ?? 0).toLocaleString(
                            i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US',
                            { style:'currency', currency:'USD' }
                        )
                    }
                />
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
    )
}
