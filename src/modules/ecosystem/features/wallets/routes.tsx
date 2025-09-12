import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as yourRoutes } from './quanta-wallet/routes';

const WalletsDirectory = lazy(() => import('./pages/WalletsDirectory'));

export const routes: RouteObject[] = [
    { index: true, element: <WalletsDirectory /> }, // /ecosystem/wallets
    { path: 'quanta', children: yourRoutes },         // /ecosystem/wallets/your/*
];
