import Card from '../components/Card'
import Sparkline from '../components/Sparkline'
import { useDashboardData } from '../model/DashboardContext'
import { useTranslation } from 'react-i18next'

export default function OverviewCard(){
    const { overview } = useDashboardData()
    const { t, i18n } = useTranslation(['wallet'])
    const fmt = (n:number|undefined) =>
        (n ?? 0).toLocaleString(i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US', { style:'currency', currency:'USD' })

    return (
        <Card title={t('totalOverview')} right={<ToolbarSmall t={(k)=>t(k)} />}>
            <div style={{ display:'grid', gridTemplateRows:'auto auto', gap:12 }}>
                <div>
                    <div style={{ fontSize:32, fontWeight:800 }}>{fmt(overview.totalUSD)}</div>
                    <div className="badge green" style={{ marginTop:8 }}>
                        +{fmt(overview.diffUSD)} · +{overview.diffPct}% 24h
                    </div>
                </div>
                <div style={{ width:'100%', maxWidth:600 }}>
                    <Sparkline values={overview.series || []} />
                </div>
            </div>
        </Card>
    )
}

function ToolbarSmall({ t }:{ t:(k:string)=>string }) {
    return (
        <div className="row" style={{gap:8}}>
            <button className="btn ghost">⚙</button>
            <button className="btn ghost">⟳ {t('refresh')}</button>
        </div>
    )
}
