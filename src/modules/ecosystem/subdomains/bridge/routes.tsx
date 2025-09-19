import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import BridgeLayout from './BridgeLayout';

// 单页：仪表盘（Dashboard）
const Dashboard = lazy(() => import('./pages/Dashboard'));

export const bridgeRoutes: RouteObject[] = [
    {
        element: <BridgeLayout />,  // 无侧边栏
        children: [
            { index: true, element: <Dashboard /> }, // /ecosystem/bridge
        ],
    },
];
