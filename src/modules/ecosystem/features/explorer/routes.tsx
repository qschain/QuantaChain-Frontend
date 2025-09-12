import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import ExplorerLayout from './ExplorerLayout';

const ExplorerHome   = lazy(() => import('./pages/ExplorerHome'));
const BlockDetail    = lazy(() => import('./pages/BlockDetail'));
const TxDetail       = lazy(() => import('./pages/TxDetail'));
const ExplorerStats  = lazy(() => import('./pages/ExplorerStats'));
const TokensList     = lazy(() => import('./pages/TokensList'));
const SearchRedirect = lazy(() => import('./pages/SearchRedirect'));
const ApiDocs       = lazy(() => import('./pages/ApiDocs'));

export const routes: RouteObject[] = [
    { index: true, element: <ExplorerHome /> },                 // 图1/2

    { path: 'block/:height', element: <BlockDetail /> },        // 图3
    { path: 'tx/:hash',     element: <TxDetail /> },            // 图4
    { path: 'search',       element: <SearchRedirect /> },

    {
        element: <ExplorerLayout />,                               // 侧边栏壳（图5/6/7/8/9）
        children: [
            { path: 'stats',  element: <ExplorerStats /> },          // 图5/6
            { path: 'tokens', element: <TokensList /> },             // 图7
            { path: 'api',    element: <ApiDocs /> },          // 占位：如需 API 文档完整交互，见下方说明
        ],
    },
];
