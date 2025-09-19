import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import DappsLayout from "./DappsLayout";

const Home = lazy(() => import('./pages/DappBrowser/HomePage'));
const SearchDiscover = lazy(() => import('./pages/DappBrowser/./SearchDiscover'));
const Account = lazy(() => import('./pages/Account/AccountPage'));
const Resources = lazy(() => import('./pages/Resources/ResourcesPage'));
const DevCenter = lazy(() => import('./pages/DevCenter/DevCenterPage'));

export const routes: RouteObject[] = [
    {
        element:<DappsLayout/>,
        children:[
            { index: true, element: <Home /> },
            { path: 'browser', element: <Home /> }, // 备用入口
            { path: 'discover', element: <SearchDiscover /> },
            { path: 'account', element: <Account /> },
            { path: 'resources', element: <Resources /> },
            { path: 'dev', element: <DevCenter /> },
        ]
    }
];
