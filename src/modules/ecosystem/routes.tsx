import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import SrLayout from './features/sr/SrLayout';
import { routes as srRoutes } from './features/sr/routes';
import { routes as walletRoutes } from './features/wallets/routes';
import { routes as explorerRoutes } from './features/explorer/routes';
// 可选：/ecosystem 顶部介绍页（先占位）
const EcosystemHome = lazy(() => import('./pages/EcosystemHome'));

export const routes: RouteObject[] = [
    { index: true, element: <EcosystemHome /> },
    { path: 'wallets',  children: walletRoutes },     // 钱包集成域
    { path: 'sr', children: srRoutes},
    { path: 'explorer', children: explorerRoutes},
    { path: 'dapps',    element: <div style={{padding:24}}>DApp 浏览与监测占位</div> },
    { path: 'bridge',   element: <div style={{padding:24}}>跨链方案集成占位</div> },
];
