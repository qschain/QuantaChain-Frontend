import { lazy } from 'react'

// 布局
const Pages = {
    AuthLayout:        lazy(() => import('../layouts/AuthLayout')),
    DashboardLayout:   lazy(() => import('../layouts/DashboardLayout')),
    SettingsLayout:    lazy(() => import('../pages/settings/SettingsLayout')),

    // 认证
    Login:             lazy(() => import('../pages/auth/Login')),
    Register:          lazy(() => import('../pages/auth/Register')),
    ForgotPassword:    lazy(() => import('../pages/auth/ForgotPassword')),

    // 业务页
    Dashboard:         lazy(() => import('../pages/Dashboard')),
    AssetDetail:       lazy(() => import('../pages/asset/AssetDetail')),
    SendAsset:         lazy(() => import('../pages/asset/SendAsset')),
    ReceiveAsset:      lazy(() => import('../pages/asset/ReceiveAsset')),
    DepositAsset:      lazy(() => import('../pages/asset/DepositAsset')),
    WithdrawAsset:     lazy(() => import('../pages/asset/WithdrawAsset')),
    SwapAsset:         lazy(() => import('../pages/swap/SwapAsset')),
    BridgeTokens:      lazy(() => import('../pages/bridge/BridgeTokens')),
    GlobePage:         lazy(() => import('../pages/atlas/Globe')),
    RegionOverview:    lazy(() => import('../pages/atlas/RegionOverview')),

    // 设置
    AccountOverview:   lazy(() => import('../pages/settings/AccountOverview')),
    PrivacySecurity:   lazy(() => import('../pages/settings/PrivacySecurity')),
    Permissions:       lazy(() => import('../pages/settings/Permissions')),
    NetworkManagement: lazy(() => import('../pages/settings/NetworkManagement')),
    Appearance:        lazy(() => import('../pages/settings/Appearance')),
    Notifications:     lazy(() => import('../pages/settings/Notifications')),
    About:             lazy(() => import('../pages/settings/About')),

    // 兜底
    NotFound:          lazy(() => import('../pages/NotFound')),
}

export default Pages
