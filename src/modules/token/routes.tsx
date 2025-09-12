import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const TRX = lazy(() => import('./pages/TRX'));
const CommonTokens = lazy(() => import('./pages/CommonTokens'));

export const routes: RouteObject[] = [
    { index: true, element: <TRX /> },           // /token
    { path: 'trx', element: <TRX /> },
    { path: 'common', element: <CommonTokens /> },
];
