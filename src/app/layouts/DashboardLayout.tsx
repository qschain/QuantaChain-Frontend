import { Outlet } from 'react-router-dom'
import Sidebar from '../../modules/ecosystem/features/wallets/quanta-wallet/components/Sidebar'
import Topbar from '../../modules/ecosystem/features/wallets/quanta-wallet/components/Topbar'
import FooterBar from '../../modules/ecosystem/features/wallets/quanta-wallet/components/FooterBar'

export default function DashboardLayout() {
    return (
        <div style={{display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100%'}}>
            <Sidebar />
            <div style={{display:'grid', gridTemplateRows:'56px 1fr 42px', minHeight:'100%'}}>
                <Topbar />
                <div style={{padding: 'var(--space-6)'}}>
                    <Outlet />
                </div>
                <FooterBar />
            </div>
        </div>
    )
}
