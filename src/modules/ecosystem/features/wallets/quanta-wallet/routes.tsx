import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { PrivateRoute } from '../../../../../app/router/guards';
import WalletI18nProvider from './WalletI18nProvider';
// 推荐继续复用平台外壳里的布局
const AuthLayout      = lazy(() => import('../../../../../app/layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('../../../../../app/layouts/DashboardLayout'));

// === 你的页面：路径相对 ./pages ===
const Login           = lazy(() => import('./pages/auth/Login'));
const Register        = lazy(() => import('./pages/auth/Register'));
const ForgotPassword  = lazy(() => import('./pages/auth/ForgotPassword'));

const Dashboard       = lazy(() => import('./pages/Dashboard'));

const AssetDetail     = lazy(() => import('./pages/asset/AssetDetail'));
const SendAsset       = lazy(() => import('./pages/asset/SendAsset'));
const ReceiveAsset    = lazy(() => import('./pages/asset/ReceiveAsset'));
const DepositAsset    = lazy(() => import('./pages/asset/DepositAsset'));
const WithdrawAsset   = lazy(() => import('./pages/asset/WithdrawAsset'));
const SwapAsset       = lazy(() => import('./pages/asset/SwapAsset'));
const BridgeTokens    = lazy(() => import('./pages/asset/BridgeTokens'));

const SettingsLayout  = lazy(() => import('./pages/settings/SettingsLayout'));
const AccountOverview = lazy(() => import('./pages/settings/AccountOverview'));
const PrivacySecurity = lazy(() => import('./pages/settings/PrivacySecurity'));
const Permissions     = lazy(() => import('./pages/settings/Permissions'));
const NetworkManagement = lazy(() => import('./pages/settings/NetworkManagement'));
const Appearance      = lazy(() => import('./pages/settings/Appearance'));
const Notifications   = lazy(() => import('./pages/settings/Notifications'));
const About           = lazy(() => import('./pages/settings/About'));

const GlobePage      = lazy(() => import('./pages/atlas/Globe'));
const RegionOverview = lazy(() => import('./pages/atlas/RegionOverview'));
const NotFound        = lazy(() => import('./pages/NotFound'));

export const routes: RouteObject[] = [
    // 未登录域：/ecosystem/wallets/your/auth/*
    {
        path: 'auth',
        element: (
            <WalletI18nProvider>
                <AuthLayout />
            </WalletI18nProvider>
        ),
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'forgot', element: <ForgotPassword /> },
        ],
    },
    // 登录后域：/ecosystem/wallets/quanta/*
    {
        element:(
            <WalletI18nProvider>
                <PrivateRoute>
                    <DashboardLayout />
                </PrivateRoute>
            </WalletI18nProvider>
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
];
