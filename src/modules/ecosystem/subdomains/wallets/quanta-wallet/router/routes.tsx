import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import { PrivateRoute } from './guards'
import WalletI18nProvider from '../WalletI18nProvider'
import { WalletSessionProvider } from '../state/WalletSessionProvider' // ← 钱包专用会话

const AuthLayout        = lazy(() => import('../AuthLayout'))
const DashboardLayout   = lazy(() => import('../pages/DashboardLayout'))

const Login             = lazy(() => import('../pages/auth/Login'))
const Register          = lazy(() => import('../pages/auth/Register'))
const ForgotPassword    = lazy(() => import('../pages/auth/ForgotPassword'))

const Dashboard         = lazy(() => import('../pages/Dashboard'))

const AssetDetail       = lazy(() => import('../pages/asset/AssetDetail'))
const SendAsset         = lazy(() => import('../pages/asset/SendAsset'))
const ReceiveAsset      = lazy(() => import('../pages/asset/ReceiveAsset'))
const DepositAsset      = lazy(() => import('../pages/asset/DepositAsset'))
const WithdrawAsset     = lazy(() => import('../pages/asset/WithdrawAsset'))
const SwapAsset         = lazy(() => import('../pages/asset/SwapAsset'))
const BridgeTokens      = lazy(() => import('../pages/asset/BridgeTokens'))

const SettingsLayout    = lazy(() => import('../pages/settings/SettingsLayout'))
const AccountOverview   = lazy(() => import('../pages/settings/AccountOverview'))
const PrivacySecurity   = lazy(() => import('../pages/settings/PrivacySecurity'))
const Permissions       = lazy(() => import('../pages/settings/Permissions'))
const NetworkManagement = lazy(() => import('../pages/settings/NetworkManagement'))
const Appearance        = lazy(() => import('../pages/settings/Appearance'))
const Notifications     = lazy(() => import('../pages/settings/Notifications'))
const About             = lazy(() => import('../pages/settings/About'))

const GlobePage         = lazy(() => import('../pages/atlas/Globe'))
const RegionOverview    = lazy(() => import('../pages/atlas/RegionOverview'))
const NotFound          = lazy(() => import('../pages/NotFound'))

// 顶层：钱包模块命名空间 Provider（只作用于本模块）
const WalletShell = () => (
    <WalletSessionProvider>
        <WalletI18nProvider>
            <Outlet />
        </WalletI18nProvider>
    </WalletSessionProvider>
)

export const routes: RouteObject[] = [
    {
        // /ecosystem/wallets/quanta/* （假设你的模块是挂在这个前缀下）
        element: <WalletShell />,     // ← 会话与 i18n 只包住钱包模块
        children: [
            // 未登录域：/auth/*
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> },
                    { path: 'forgot', element: <ForgotPassword /> },
                ],
            },

            // 登录后域：需要鉴权
            {
                element: (
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                ),
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: 'dashboard', element: <Dashboard /> },

                    { path: 'bridge', element: <BridgeTokens /> },
                    { path: 'swap', element: <SwapAsset /> },

                    { path: 'asset', element: <AssetDetail /> },
                    { path: 'asset/send', element: <SendAsset /> },
                    { path: 'asset/receive', element: <ReceiveAsset /> },
                    { path: 'asset/deposit', element: <DepositAsset /> },
                    { path: 'asset/withdraw', element: <WithdrawAsset /> },

                    {
                        path: 'settings',
                        element: <SettingsLayout />,
                        children: [
                            { index: true, element: <AccountOverview /> },
                            { path: 'privacy', element: <PrivacySecurity /> },
                            { path: 'permissions', element: <Permissions /> },
                            { path: 'network', element: <NetworkManagement /> },
                            { path: 'appearance', element: <Appearance /> },
                            { path: 'notifications', element: <Notifications /> },
                            { path: 'about', element: <About /> },
                        ],
                    },

                    { path: 'atlas', element: <GlobePage /> },
                    { path: 'atlas/:region', element: <RegionOverview /> },
                ],
            },

            { path: '*', element: <NotFound /> },
        ],
    },
]
