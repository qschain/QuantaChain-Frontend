import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import SrLayout from './SrLayout';

// 页面懒加载
const Dashboard  = lazy(() => import('./pages/Dashboard/DashboardPage'));
const Vote       = lazy(() => import('./pages/Vote/VotePage'));
const Rewards    = lazy(() => import('./pages/Rewards/RewardsPage'));
const Proposals  = lazy(() => import('./pages/Proposals/ProposalsPage'));
const Analytics  = lazy(() => import('./pages/Analytics/AnalyticsPage'));
const Learn      = lazy(() => import('./pages/Learn/LearnPage'));

/**
 * SR 子域路由：
 * - 使用与 explorer 一致的“布局壳 + children”结构
 * - index = 控制台首页，始终在 SrLayout 侧边栏壳内渲染
 */
export const routes: RouteObject[] = [
    {
        element: <SrLayout />,     // 左侧壳（保持顶栏、底栏一致）
        children: [
            { index: true, element: <Dashboard /> },   // /ecosystem/sr
            { path: 'vote',      element: <Vote /> },
            { path: 'rewards',   element: <Rewards /> },
            { path: 'proposals', element: <Proposals /> },
            { path: 'analytics', element: <Analytics /> },
            { path: 'learn',     element: <Learn /> },
        ],
    },
];
