// src/app/router/AppRoutes.tsx
import { Suspense, useEffect, useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import type { ModuleDefinition } from '../registry/types';
import { loadAllModules } from '../registry/ModuleRegistry';
import i18n from '../../core/i18n/i18n';          // ★ 引入全局 i18n 实例
import '../registry/modules'; // 执行注册副作用

export default function AppRoutes() {
    const [mods, setMods] = useState<ModuleDefinition[] | null>(null);

    useEffect(() => {
        (async () => {
            const loaded = await loadAllModules();

            // ★ 先把各模块的 i18n 词条注册到全局实例
            loaded.forEach((m) => {
                m.i18n?.forEach((b) => {
                    if (b.resources.zh) i18n.addResourceBundle('zh', b.ns, b.resources.zh, true, true);
                    if (b.resources.en) i18n.addResourceBundle('en', b.ns, b.resources.en, true, true);
                });
            });

            setMods(loaded); // ★ 再触发路由渲染
        })();
    }, []);

    if (!mods) return <div className="container">加载中…</div>;

    // 把每个模块包装成一个根 RouteObject：{ path: basePath, children: module.routes }
    const moduleRoots = mods.map((m) => ({
        path: m.basePath,
        children: m.routes,
    }));

    // 如果没有显式的 "/" 模块，就把根重定向到第一个模块
    const hasHome = mods.some((m) => m.basePath === '/');
    const defaultRedirect = hasHome
        ? []
        : [
            {
                path: '/',
                element: <Navigate to={mods[0]?.basePath ?? '/'} replace />,
            },
        ];

    const routes = [
        ...moduleRoots,
        ...defaultRedirect,
        { path: '*', element: <div style={{ padding: 24 }}>Not Found</div> },
    ];

    // 用 useRoutes 来渲染 RouteObject 数组
    const element = useRoutes(routes);

    return <Suspense fallback={<div className="container">加载中…</div>}>{element}</Suspense>;
}
