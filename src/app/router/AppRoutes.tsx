// src/app/router/AppRoutes.tsx
import { Suspense, useEffect, useState, useMemo } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import type { ModuleDefinition } from '../registry/types';
import { loadAllModules } from '../registry/ModuleRegistry';
import i18n from '../../shared/lib/i18n/i18n';
import '../registry/modules'; // 执行注册副作用

export default function AppRoutes() {
    const [mods, setMods] = useState<ModuleDefinition[] | null>(null);

    useEffect(() => {
        (async () => {
            const loaded = await loadAllModules();

            // 注册 i18n 词条
            loaded.forEach((m) => {
                m.i18n?.forEach((b) => {
                    if (b.resources.zh) i18n.addResourceBundle('zh', b.ns, b.resources.zh, true, true);
                    if (b.resources.en) i18n.addResourceBundle('en', b.ns, b.resources.en, true, true);
                });
            });

            setMods(loaded);
        })();
    }, []);

    // 计算路由数组（未加载时给一套“加载中”占位路由）
    const routes = useMemo(() => {
        if (!mods) {
            return [
                { path: '*', element: <div className="container">加载中…</div> },
            ];
        }

        const moduleRoots = mods.map((m) => ({
            path: m.basePath,
            children: m.routes,
        }));

        const hasHome = mods.some((m) => m.basePath === '/');
        const defaultRedirect = hasHome
            ? []
            : [
                {
                    path: '/',
                    element: <Navigate to={mods[0]?.basePath ?? '/'} replace />,
                },
            ];

        return [
            ...moduleRoots,
            ...defaultRedirect,
            { path: '*', element: <div style={{ padding: 24 }}>Not Found</div> },
        ];
    }, [mods]);

    // ✅ 无论是否加载完成，useRoutes 都会被调用
    const element = useRoutes(routes);

    return <Suspense fallback={<div className="container">加载中…</div>}>{element}</Suspense>;
}
