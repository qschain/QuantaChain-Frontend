import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from "../../app/layouts/AppLayout";
import UnderConstruction from '../../pages/UnderConstruction'

const Whitepaper = lazy(() => import('./pages/Whitepaper'));
const GithubCode = lazy(() => import('./pages/GithubCode'));
const Security   = lazy(() => import('./pages/SecurityReports'));
const Bounty     = lazy(() => import('./pages/Bounty'));

export const routes: RouteObject[] = [
    {
        element:<AppLayout/>,
        children:[
        { path: 'whitepaper', element: <UnderConstruction /> },
        { path: 'github',     element: <UnderConstruction /> },
        { path: 'security',   element: <UnderConstruction /> },
        { path: 'bounty',     element: <UnderConstruction /> }
    ]
    }
];
