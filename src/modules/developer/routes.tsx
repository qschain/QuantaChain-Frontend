import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Whitepaper = lazy(() => import('./pages/Whitepaper'));
const GithubCode = lazy(() => import('./pages/GithubCode'));
const Security   = lazy(() => import('./pages/SecurityReports'));
const Bounty     = lazy(() => import('./pages/Bounty'));

export const routes: RouteObject[] = [
    { index: true, element: <Whitepaper /> },      // /dev
    { path: 'whitepaper', element: <Whitepaper /> },
    { path: 'github',     element: <GithubCode /> },
    { path: 'security',   element: <Security /> },
    { path: 'bounty',     element: <Bounty /> },
];
