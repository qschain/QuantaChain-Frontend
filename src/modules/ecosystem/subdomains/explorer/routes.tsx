import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import ExplorerLayout from './ExplorerLayout';
import {UnderConstruction} from '../../../../pages/UnderConstruction'
const ExplorerHome   = lazy(() => import('./pages/ExplorerHome'));
const BlockDetail    = lazy(() => import('./pages/BlockDetail'));
const TxDetail       = lazy(() => import('./pages/TxDetail'));
const ExplorerStats  = lazy(() => import('./pages/ExplorerStats'));
const TokensList     = lazy(() => import('./pages/TokensList'));
const SearchRedirect = lazy(() => import('./pages/SearchRedirect'));
const ApiDocs       = lazy(() => import('./pages/ApiDocs'));

export const routes: RouteObject[] = [
    { index: true, element: <ExplorerHome /> },
    { path: 'block/:height', element: <BlockDetail /> },
    { path: 'tx/:hash',     element: <TxDetail /> },
    { path: 'search',       element: <SearchRedirect /> },

    {
        element: <ExplorerLayout />,
        children: [
            { path: 'stats',  element: <ExplorerStats /> },
            { path: 'tokens', element: <TokensList /> },
            { path: 'api',    element: <ApiDocs /> },
            { path: 'transactions',    element: <UnderConstruction /> },
            { path: 'blocks',    element: <UnderConstruction /> },
        ],
    },
];
