import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AppLayout from "../../app/layouts/AppLayout";

const Landing = lazy(() => import('./pages/Landing'));

export const routes: RouteObject[] = [

    {
        element:<AppLayout/>,
        children: [
            {index: true, element: <Landing /> }
        ]
    }
];
