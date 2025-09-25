import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import Globe from 'react-globe.gl';
import { useNodes } from '../../model/atlas/NodesStore';
import type { AtlasPoint } from '../../types';

/** ---- 非 Hook 版 RAF 节流：用 useMemo 只创建一次，身份稳定 ---- */
function createRafThrottle(fn: (...a: any[]) => void, delayMs = 60) {
    let ticking = false;
    let last = 0;
    return (...args: any[]) => {
        const now = performance.now();
        if (ticking) return;
        if (now - last < delayMs) return;
        ticking = true;
        requestAnimationFrame(() => {
            fn(...args);
            last = now;
            ticking = false;
        });
    };
}

/** ---- 水塘抽样，避免一次性渲染过多点 ---- */
function reservoirSample<T>(arr: T[], k: number): T[] {
    if (arr.length <= k) return arr;
    const res = arr.slice(0, k);
    for (let i = k; i < arr.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        if (j < k) res[j] = arr[i];
    }
    return res;
}

export default function GlobePage() {
    const { loading, error, points } = useNodes();
    const globeRef = useRef<any>(null);
    const nav = useNavigate();

    const [autoRotate, setAutoRotate] = useState(true);
    const [level, setLevel] = useState(3);              // 聚合分档
    const [hoverKey, setHoverKey] = useState<string | null>(null);
    const [vw, setVw] = useState(() => window.innerWidth);
    const [vh, setVh] = useState(() => window.innerHeight);
    const didInit = useRef(false);                      // ✅ 防止相机反复初始化

    /** 主题色 */
    const theme = useMemo(() => ({
        point: getComputedStyle(document.documentElement).getPropertyValue('--primary')?.trim() || '#f54d4d',
        grid:  getComputedStyle(document.documentElement).getPropertyValue('--line')?.trim()    || '#2a2a2a',
        panel: getComputedStyle(document.documentElement).getPropertyValue('--bg-panel')?.trim() || '#0f1318',
        muted: getComputedStyle(document.documentElement).getPropertyValue('--muted')?.trim() || '#8a97a6',
    }), []);

    /** 点量保护 */
    const RENDER_CAP = 12000;
    const renderPoints = useMemo(
        () => (points.length > RENDER_CAP ? reservoirSample(points, RENDER_CAP) : points),
        [points]
    );

    /** 分档规则（只根据 altitude 变化） */
    const alt2level = useCallback((alt: number) => (
        alt > 2.2 ? 7 : alt > 1.8 ? 6 : alt > 1.4 ? 5 : alt > 1.1 ? 4 : 3
    ), []);

    /** 相机变更回调（稳定身份，不用 Hook） */
    const onCameraChange = useMemo(() => createRafThrottle(() => {
        const g = globeRef.current; if (!g) return;
        const alt = g.pointOfView().altitude ?? 1.8;
        const next = alt2level(alt);
        setLevel(prev => (prev === next ? prev : next));
    }, 60), [alt2level]);

    /** 窗口尺寸回调（稳定身份） */
    const onResize = useMemo(() => createRafThrottle(() => {
        setVw(window.innerWidth);
        setVh(window.innerHeight);
    }, 120), []);

    /** 初始化相机 + 绑定控制器（只跑一次） */
    useEffect(() => {
        const g = globeRef.current;
        if (!g) return;

        if (!didInit.current) {
            // ✅ 仅首次设置 POV，后续不再重置
            g.pointOfView({ lat: 20, lng: 100, altitude: 1.8 }, 0);
            didInit.current = true;
        }

        const controls = g.controls();
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.6;
        controls.minDistance = 150;
        controls.maxDistance = 1200;

        controls.addEventListener('change', onCameraChange);
        return () => {
            controls.removeEventListener('change', onCameraChange);
        };
        // 监听 autoRotate 切换 + 稳定回调
    }, [autoRotate, onCameraChange]);

    /** 监听窗口尺寸（稳定回调，挂载一次） */
    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [onResize]);

    /** 悬浮节流（稳定版） */
    const setHoverThrottled = useMemo(
        () => createRafThrottle((k: string | null) => setHoverKey(k), 60),
        []
    );

    /** 点击：先飞入，再切路由（确保重新启用交互） */
    const flyToAndGo = useCallback((lat: number, lng: number, id?: string) => {
        const g = globeRef.current; if (!g) return;
        g.enablePointerInteraction(false);
        g.pointOfView({ lat, lng, altitude: 0.6 }, 1200);
        setTimeout(() => {
            g.enablePointerInteraction(true);
            if (id) nav(`/ecosystem/explorer/nodes/${encodeURIComponent(id)}`);
        }, 1250);
    }, [nav]);

    /** 近用点、远用 Hexbin */
    const useHex = level >= 4;
    const hexResolution = level;

    /** 颜色/高度 accessor（稳定） */
    const hexTopColor = useMemo(() => (hex: any) => {
        const key = `${hex?.center?.lat?.toFixed(3)}_${hex?.center?.lng?.toFixed(3)}_${hex?.points?.length ?? 0}`;
        return key === hoverKey ? '#ff7a7a' : theme.point;
    }, [hoverKey, theme.point]);
    const hexSideColor = theme.panel;
    const hexAltitude = useMemo(() => (d: any) =>
        Math.max(0.02, Math.log((d.points?.length || 1) + 2) * 0.05), []);

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 72px)', position: 'relative', overflow: 'hidden' }}>
            {/* 顶部操作（按钮不再消失，zIndex 提高） */}
            <div style={{position:'absolute', right:20, top:16, zIndex: 10}} className="row">
                <button className="btn ghost" onClick={()=>setAutoRotate(a=>!a)}>
                    {autoRotate ? '暂停自转' : '恢复自转'}
                </button>
                <button className="btn ghost" onClick={()=>{
                    const g = globeRef.current; if (!g) return;
                    g.pointOfView({ lat: 20, lng: 100, altitude: 1.8 }, 600);
                }}>重置视角</button>
            </div>

            {/* 状态提示 */}
            {error && <div className="card" style={{position:'absolute', left:20, top:16, zIndex:10, color:'#ff5a7a'}}>加载失败：{error}</div>}
            {loading && <div className="card" style={{position:'absolute', left:20, top:16, zIndex:10}}>加载中…</div>}

            <Globe
                ref={globeRef}
                width={vw}
                height={vh - 72}
                animateIn={false}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                showAtmosphere
                atmosphereColor={theme.point}
                atmosphereAltitude={0.25}
                showGraticules
                rendererConfig={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                waitForGlobeReady
                enablePointerInteraction

                /* 原子点（近） */
                pointsData={useHex ? [] : renderPoints}
                pointAltitude={0.02}
                pointRadius={0.8}
                pointColor={() => theme.point}
                pointLabel={(o: any) => {
                    const d = o as AtlasPoint;
                    return `${d.name}\n${d.raw.country}${d.raw.province ? ' · '+d.raw.province : ''}${d.raw.city ? ' · '+d.raw.city : ''}\n${d.raw.ip}`;
                }}
                onPointClick={(o: any) => {
                    const d = o as AtlasPoint;
                    flyToAndGo(d.lat, d.lng, d.id);
                }}

                /* Hexbin（远） */
                hexBinPointsData={useHex ? renderPoints : []}
                hexBinPointWeight={() => 1}
                hexBinResolution={hexResolution}
                hexTopColor={hexTopColor}
                hexSideColor={hexSideColor}
                hexAltitude={hexAltitude}
                hexMargin={0.2}
                hexLabel={(d: any) => `共 ${d.points?.length || 0} 个节点`}
                onHexHover={(hex: any) => {
                    if (!hex) { setHoverThrottled(null); return; }
                    const key = `${hex?.center?.lat?.toFixed(3)}_${hex?.center?.lng?.toFixed(3)}_${hex?.points?.length ?? 0}`;
                    setHoverThrottled(key);
                }}
                onHexClick={(hex: any) => {
                    const { center = { lat: 0, lng: 0 }, points: mem = [] } = hex || {};
                    if (Array.isArray(mem) && mem.length === 1) {
                        const p = mem[0] as AtlasPoint;
                        flyToAndGo(p.lat, p.lng, p.id);
                    } else {
                        flyToAndGo(center.lat, center.lng);
                    }
                }}
            />
        </div>
    );
}
