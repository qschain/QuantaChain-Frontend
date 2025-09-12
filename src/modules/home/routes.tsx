import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Landing = lazy(() => import('./pages/Landing'));

export const routes: RouteObject[] = [
    { index: true, element: <Landing /> }, // '/'
];
