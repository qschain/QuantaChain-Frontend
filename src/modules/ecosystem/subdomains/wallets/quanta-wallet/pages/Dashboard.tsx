import { RequireDashboardData } from '../model/DashboardContext'
import OverviewCard from '../ui/OverviewCard'
import MainAssetsCard from '../ui/MainAssetsCard'
import MarketCard from '../ui/MarketCard'
import DistributionCard from '../ui/DistributionCard'
import ActivitiesCard from '../ui/ActivitiesCard'
import Card from '../components/Card'
import QuickActions from '../components/QuickActions'

export default function Dashboard(){
    return (
        <RequireDashboardData
            fallback={<div style={{padding:16}}>Loading dashboard…</div>}
            errorFallback={(msg)=> <div style={{padding:16}}>加载失败：{msg}</div>}
        >
            <div className="grid" style={{gap:'var(--space-6)'}}>
                <div className="grid" style={{gridTemplateColumns:'1.2fr 1fr 1fr', gap:'var(--space-6)'}}>
                    <OverviewCard />
                    <MainAssetsCard />
                    <MarketCard />
                </div>

                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)'}}>
                    <DistributionCard />
                    <ActivitiesCard />
                </div>

                <Card title="Quick Actions">
                    <QuickActions />
                </Card>
            </div>
        </RequireDashboardData>
    )
}
