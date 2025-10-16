// src/modules/wallet/app/router/routes.tsx  （你的这份文件）
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import PrivateRoute from '../../../../../../app/router/guards'
import WalletI18nProvider from '../WalletI18nProvider'
import { DashboardProvider } from '../model/DashboardContext'
//节点缓存 Provider
import { NodesProvider } from '../model/atlas/NodesStore'

const DashboardLayout   = lazy(() => import('../pages/DashboardLayout'))
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


const ExplorerLanding   = lazy(() => import('../pages/atlas/ExplorerLanding'))
const NodeDetailPage    = lazy(() => import('../pages/atlas/NodeDetailPage'))
const RegionOverview    = lazy(() => import('../pages/atlas/NodeDetailPage'))

const NotFound          = lazy(() => import('../pages/NotFound'))

const WalletShell = () => (
        <WalletI18nProvider>
            <Outlet />
        </WalletI18nProvider>
)

export const routes: RouteObject[] = [
    {
        element: <WalletShell />,
        children: [
            {
                element: (
                    <PrivateRoute>
                        <DashboardProvider real>
                            <DashboardLayout />
                        </DashboardProvider>
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

                    // ⭐ atlas 域：挂上 NodesProvider（只影响 atlas 子树）
                    {
                        path: 'atlas',
                        element: (
                            <NodesProvider>
                                <Outlet />
                            </NodesProvider>
                        ),
                        children: [
                            { index: true, element: <ExplorerLanding /> },              // 第一屏地球 + 第二屏排行
                            { path: 'nodes/:id', element: <NodeDetailPage /> },         // 节点详情（id=ip）
                            { path: ':region', element: <RegionOverview /> },           // 你原来的区域概览路由，保留
                        ],
                    },
                ],
            },
            { path: '*', element: <NotFound /> },
        ],
    },
]
