import type { RouteObject } from 'react-router-dom';
import { routes as srRoutes } from './subdomains/sr/routes';
import { routes as walletRoutes } from './subdomains/wallets/routes';
import { routes as explorerRoutes } from './subdomains/explorer/routes';
import { routes as dappsRoutes } from './subdomains/dapps/routes';
import AppLayout from "../../app/layouts/AppLayout";
import { bridgeRoutes } from './subdomains/bridge/routes';

export const routes: RouteObject[] = [
    {
        element:<AppLayout/>,
        children:[
            { path: 'wallets',  children: walletRoutes },
            { path: 'sr', children: srRoutes},
            { path: 'explorer', children: explorerRoutes},
            { path: 'dapps',    children: dappsRoutes },
            { path: 'bridge',   children: bridgeRoutes },
        ]
    }

];

