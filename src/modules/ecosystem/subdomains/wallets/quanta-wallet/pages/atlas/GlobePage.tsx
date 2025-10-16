import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import Globe from 'react-globe.gl';
import { useNodes } from '../../model/atlas/NodesStore';
import type { AtlasPoint } from '../../types';

/** ========= 非 Hook 版 RAF 节流（身份稳定） ========= */
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

/** ========= 水塘抽样，避免一次性渲染过多点 ========= */
function reservoirSample<T>(arr: T[], k: number): T[] {
    if (arr.length <= k) return arr;
    const res = arr.slice(0, k);
    for (let i = k; i < arr.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        if (j < k) res[j] = arr[i];
    }
    return res;
}

const NODE_DETAIL_PATH = (id: string) =>
    `/ecosystem/wallets/quanta/atlas/nodes/${encodeURIComponent(id)}`;

export default function GlobePage() {
    const { loading, error, points } = useNodes();
    const globeRef = useRef<any>(null);
    const nav = useNavigate();

    // ✅ 用“容器尺寸”驱动，彻底避免横向滚动条
    const wrapRef = useRef<HTMLDivElement>(null);
    const [cw, setCw] = useState(0);
    const [ch, setCh] = useState(0);

    const [autoRotate, setAutoRotate] = useState(true);
    const [level, setLevel] = useState(3);              // 聚合分档：3..7
    const [hoverKey, setHoverKey] = useState<string | null>(null);
    const didInit = useRef(false);                      // 防止相机反复初始化
    const animatingRef = useRef(false);                 // 飞入动画护栏

    /** ===== 主题色（一次读取，避免频繁重渲染） ===== */
    const theme = useMemo(() => ({
        point: getComputedStyle(document.documentElement).getPropertyValue('--primary')?.trim() || '#4ddfc4',
        grid:  getComputedStyle(document.documentElement).getPropertyValue('--line')?.trim()    || 'rgba(42,42,42,0.01)',
        panel: getComputedStyle(document.documentElement).getPropertyValue('--bg-panel')?.trim() || 'rgba(15,19,24,0.01)',
        muted: getComputedStyle(document.documentElement).getPropertyValue('--muted')?.trim() || '#8a97a6',
    }), []);

    /** ===== 点量保护 ===== */
    const RENDER_CAP = 12000;
    const renderPoints = useMemo(
        () => (points.length > RENDER_CAP ? reservoirSample(points, RENDER_CAP) : points),
        [points]
    );

    /** ===== 容器尺寸：使用 ResizeObserver，避免溢出 ===== */
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ro = new ResizeObserver(() => {
            setCw(Math.floor(el.clientWidth));
            setCh(Math.floor(el.clientHeight));
        });
        ro.observe(el);
        // 初次计算
        setCw(Math.floor(el.clientWidth));
        setCh(Math.floor(el.clientHeight));
        return () => ro.disconnect();
    }, []);

    /** ===== 聚合分档规则（仅基于 altitude） ===== */
    const alt2level = useCallback((alt: number) => (
        alt > 2.2 ? 7 : alt > 1.8 ? 6 : alt > 1.4 ? 5 : alt > 1.1 ? 4 : 3
    ), []);

    /** ===== 相机变更回调（动画期间不触发重渲染） ===== */
    const onCameraChange = useMemo(() => createRafThrottle(() => {
        if (animatingRef.current) return; // ✋ 动画中不更新 level，避免重置
        const g = globeRef.current; if (!g) return;
        const alt = g.pointOfView().altitude ?? 1.8;
        const next = alt2level(alt);
        setLevel(prev => (prev === next ? prev : next));
    }, 60), [alt2level]);

    /** ===== 悬浮节流（用于 hex 顶面高亮） ===== */
    const setHoverThrottled = useMemo(
        () => createRafThrottle((k: string | null) => setHoverKey(k), 60),
        []
    );

    /** ===== 初始化相机 + 绑定控制器（仅跑一次 POV，其余保持） ===== */
    useEffect(() => {
        const g = globeRef.current;
        if (!g) return;

        if (!didInit.current) {
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
    }, [autoRotate, onCameraChange]);

    /** ===== 飞入动画后跳转（稳健） ===== */
    const flyToAndGo = useCallback((lat: number, lng: number, id?: string) => {
        const g = globeRef.current; if (!g) return;

        const DURATION = 800;
        animatingRef.current = true;

        g.pointOfView({ lat, lng, altitude: 0.6 }, DURATION);

        const start = performance.now();
        const afterNextFrame = () => {
            const elapsed = performance.now() - start;
            const remain = Math.max(0, DURATION - elapsed + 20); // 余量
            window.setTimeout(() => {
                animatingRef.current = false;
                if (id) nav(NODE_DETAIL_PATH(id));
            }, remain);
        };
        requestAnimationFrame(afterNextFrame);
    }, [nav]);

    /** ===== 近用点、远用 Hexbin ===== */
    const useHex = level >= 4;
    const hexResolution = level;

    /** ===== Hexbin 视觉：顶面主题色，侧面透明，无黑边 ===== */
    const hexTopColor = useMemo(() => (hex: any) => {
        const key = `${hex?.center?.lat?.toFixed(3)}_${hex?.center?.lng?.toFixed(3)}_${hex?.points?.length ?? 0}`;
        return key === hoverKey ? '#ff7a7a' : theme.point;
    }, [hoverKey, theme.point]);

    const hexSideColor =   useMemo(() => () => 'rgba(9,9,9,0.47)', []); // 先用与顶面同色，确认能生效; // 侧面透明，避免黑边
    const hexAltitude = useMemo(
        () => (d: any) => Math.max(0.02, Math.log((d.points?.length || 1) + 2) * 0.05),
        []
    );

    return (
        <div
            ref={wrapRef}
            style={{
                width: '100%',
                height: 'calc(100vh - 72px)',
                position: 'relative',
                overflow: 'hidden',     // 防止内部绝对定位溢出
            }}
        >
            {/* 顶部操作 */}
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
                // ✅ 使用容器尺寸，彻底避免横向滚动条
                width={cw || 1}
                height={ch || 1}
                animateIn={false}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                showAtmosphere
                atmosphereColor={theme.point}
                atmosphereAltitude={0.25}
                // 若经纬网格造成“线条”视觉，可关闭：
                showGraticules={false}
                rendererConfig={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                waitForGlobeReady
                enablePointerInteraction

                /* ===== 原子点（近距离） ===== */
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

                /* ===== Hexbin 聚合（远距离） ===== */
                hexBinPointsData={useHex ? renderPoints : []}
                hexBinPointWeight={() => 1}
                hexBinResolution={hexResolution}      // 3..7
                hexTopColor={hexTopColor}
                hexSideColor={hexSideColor}
                hexAltitude={hexAltitude}
                hexMargin={0}
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
                        // 多成员：先飞入中心，用户再点击具体点
                        flyToAndGo(center.lat, center.lng);
                    }
                }}
            />
        </div>
    );
}
