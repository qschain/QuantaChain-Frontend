import type { RouteObject } from 'react-router-dom';
import type { ComponentType, ReactNode } from 'react';

export type ModuleId = 'home' | 'ecosystem' | 'token' | 'developer' | string;

export interface ModuleInitContext {
    services: { apiBase?: string }
}

export type AppRouteObject = RouteObject & {
    handle?: { requiresAuth?: boolean };
};

export interface ModuleDefinition {
    id: ModuleId;
    title: string;
    basePath: string;
    routes: AppRouteObject[];
    menu?: NavItem[];
    providers?: ComponentType<{ children: ReactNode }>[];
    i18n?: { ns: string; resources: { en?: any; zh?: any } }[];
    mswHandlers?: any[];
    onInit?(ctx: ModuleInitContext): void;
}

export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
    children?: NavItem[];
}
