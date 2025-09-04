import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './guards'
import { useSession } from '../state/SessionProvider'
import Pages from './pages'

// 根路径：根据登录态重定向
function IndexRedirect() {
    const { authed } = useSession()
    return <Navigate to={authed ? '/dashboard' : '/auth/login'} replace />
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<div className="container">加载中…</div>}>
            <Routes>
                {/* 认证域 */}
                <Route element={<Pages.AuthLayout />}>
                    <Route path="/auth/login" element={<Pages.Login />} />
                    <Route path="/auth/register" element={<Pages.Register />} />
                    <Route path="/auth/forgot" element={<Pages.ForgotPassword />} />
                </Route>

                {/* 根路径：公共入口 */}
                <Route path="/" element={<IndexRedirect />} />

                {/* 需要登录的业务域 */}
                <Route element={<PrivateRoute><Pages.DashboardLayout /></PrivateRoute>}>
                    {/* 地图 */}
                    <Route path="/atlas" element={<Pages.GlobePage />} />
                    <Route path="/atlas/:region" element={<Pages.RegionOverview />} />

                    {/* 交易功能 */}
                    <Route path="/bridge" element={<Pages.BridgeTokens />} />
                    <Route path="/swap" element={<Pages.SwapAsset />} />

                    {/* 仪表盘与资产 */}
                    <Route path="/dashboard" element={<Pages.Dashboard />} />
                    <Route path="/asset" element={<Pages.AssetDetail />} />
                    <Route path="/asset/send" element={<Pages.SendAsset />} />
                    <Route path="/asset/receive" element={<Pages.ReceiveAsset />} />
                    <Route path="/asset/deposit" element={<Pages.DepositAsset />} />
                    <Route path="/asset/withdraw" element={<Pages.WithdrawAsset />} />

                    {/* 设置中心（子路由） */}
                    <Route path="/settings" element={<Pages.SettingsLayout />}>
                        <Route index element={<Pages.AccountOverview />} />
                        <Route path="privacy" element={<Pages.PrivacySecurity />} />
                        <Route path="permissions" element={<Pages.Permissions />} />
                        <Route path="network" element={<Pages.NetworkManagement />} />
                        <Route path="appearance" element={<Pages.Appearance />} />
                        <Route path="notifications" element={<Pages.Notifications />} />
                        <Route path="about" element={<Pages.About />} />
                    </Route>
                </Route>

                {/* 兜底 404 */}
                <Route path="*" element={<Pages.NotFound />} />
            </Routes>
        </Suspense>
    )
}
