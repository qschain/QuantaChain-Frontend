import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from "../../app/layouts/AppLayout";

const TRX = lazy(() => import('./pages/TRX'));
const CommonTokens = lazy(() => import('./pages/CommonTokens'));

export const routes: RouteObject[] = [
    {
        element:<AppLayout/>,
        children: [
                { path: 'trx', element: <TRX /> },
                { path: 'common', element: <CommonTokens /> }
            ]
    }
];
