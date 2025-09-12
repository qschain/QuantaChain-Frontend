import type { ReactNode, ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';

export type ModuleId = 'home' | 'ecosystem' | 'token' | 'developer' | string;

export interface NavItem { id: string; label: string; to: string; icon?: ReactNode; }

export interface ModuleInitContext { services: { apiBase?: string } }

export interface ModuleDefinition {
    id: ModuleId;
    title: string;
    basePath: string;          // 如 '/', '/ecosystem'
    routes: RouteObject[];     // 相对 basePath 的子路由
    menu?: NavItem[];
    providers?: ComponentType<{ children: ReactNode }>[]; // 可选
    i18n?: { ns: string; resources: { en?: any; zh?: any } }[]; // 可选
    mswHandlers?: any[];       // 可选
    onInit?(ctx: ModuleInitContext): void;                    // 可选
}
