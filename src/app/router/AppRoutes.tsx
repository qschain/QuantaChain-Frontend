// src/app/router/AppRoutes.tsx
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useRoutes, type RouteObject } from 'react-router-dom';
import PrivateRoute from './guards';

import type { ModuleDefinition } from '../registry/types';
import { loadAllModules } from '../registry/ModuleRegistry';
import i18n, {registerBundles} from '../../shared/lib/i18n/i18n';
import '../registry/modules'; // 执行注册副作用（模块自注册）

import AuthLayout from '../../pages/auth/AuthLayout';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import ForgotPassword from '../../pages/auth/ForgotPassword';

import zhAuth from '../../shared/i18n/zh/auth.zh.json';
import enAuth from '../../shared/i18n/en/auth.en.json';

// 扩展 RouteObject，允许使用 handle.requiresAuth 作为鉴权标记（不破坏已有类型）
type AppRouteObject = RouteObject & {
    handle?: { requiresAuth?: boolean };
};

/** 递归包装：对 handle.requiresAuth = true 的路由节点包上 <PrivateRoute> */
// ✅ 只在有 children 时才写入 children，避免 TS 把它视为非法的 IndexRouteObject
function wrapWithGuards(routes: AppRouteObject[]): RouteObject[] {
    return routes.map((r) => {
        const element = r.element ?? <Outlet />;
        const guarded = r.handle?.requiresAuth
            ? <PrivateRoute>{element}</PrivateRoute>
            : element;

        // 按需拷贝可选字段，避免把 children: undefined 写进去
        const out: RouteObject = {
            element: guarded,
            ...(r.path ? { path: r.path } : {}),
            ...(r.index ? { index: true } : {}),
            ...(r.id ? { id: r.id } : {}),
            ...(r.caseSensitive !== undefined ? { caseSensitive: r.caseSensitive } : {}),
            ...(r.loader ? { loader: r.loader } : {}),
            ...(r.action ? { action: r.action } : {}),
            ...(r.errorElement ? { errorElement: r.errorElement } : {}),
            ...(r.hasErrorBoundary ? { hasErrorBoundary: r.hasErrorBoundary } : {}),
            ...(r.shouldRevalidate ? { shouldRevalidate: r.shouldRevalidate } : {}),
            ...(r.handle ? { handle: r.handle } : {}),
            ...(r.lazy ? { lazy: r.lazy } : {}),
        };

        if (r.children && r.children.length > 0) {
            out.children = wrapWithGuards(r.children as AppRouteObject[]);
        }

        return out;
    });
}


export default function AppRoutes() {
    const [mods, setMods] = useState<ModuleDefinition[] | null>(null);

    useEffect(() => {
        (async () => {
            const loaded = await loadAllModules();

            // 注册所有模块的 i18n 词条
            loaded.forEach((m) => {
                m.i18n?.forEach((b) => {
                    if (b.resources.zh) i18n.addResourceBundle('zh', b.ns, b.resources.zh, true, true);
                    if (b.resources.en) i18n.addResourceBundle('en', b.ns, b.resources.en, true, true);
                });
            });

            registerBundles([{ ns: 'auth', resources: { zh: zhAuth, en: enAuth } }]);

            setMods(loaded);
        })();
    }, []);

    const routes = useMemo<RouteObject[]>(() => {
        // 加载中：提供占位路由，避免 useRoutes 拿到空数组
        if (!mods) {
            return [{ path: '*', element: <div className="container">加载中…</div> }];
        }

        // A) 平台级公共 Auth 路由（不做鉴权，任何模块的 Guard 未登录都应重定向到这里）
        const authBranch: RouteObject = {
            path: '/auth',
            element: <AuthLayout />, // 内部必须 <Outlet/>
            children: [
                { index: true, element: <Navigate to="login" replace /> },
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
                { path: 'forgot', element: <ForgotPassword /> },
            ],
        };

        // B) 把每个模块的相对 routes 包装并挂到它的 basePath 下
        const moduleRoots: RouteObject[] = mods.map((m) => ({
            path: m.basePath,       // 例如：'/'、'/wallets'、'/explorer'、'/dapps' ...
            element: <Outlet />,    // 模块根要能承载子路由
            children: wrapWithGuards(m.routes as AppRouteObject[]),
        }));

        // C) 如果不存在以 '/' 为 basePath 的模块，则把根路径重定向到第一个模块
        const hasHome = mods.some((m) => m.basePath === '/');
        const defaultRedirect: RouteObject[] = hasHome
            ? []
            : [{ path: '/', element: <Navigate to={mods[0]?.basePath ?? '/'} replace /> }];

        // D) 兜底 404
        const notFound: RouteObject = { path: '*', element: <div style={{ padding: 24 }}>Not Found</div> };

        return [authBranch, ...moduleRoots, ...defaultRedirect, notFound];
    }, [mods]);

    const element = useRoutes(routes);
    return <Suspense fallback={<div className="container">加载中…</div>}>{element}</Suspense>;
}
