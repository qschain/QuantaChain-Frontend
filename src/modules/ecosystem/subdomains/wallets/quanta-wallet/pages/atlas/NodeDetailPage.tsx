import { useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import Globe from 'react-globe.gl';
import { useNodes } from '../../model/atlas/NodesStore';
import { useElementSize } from '../../../../../../../shared/hooks/useElementSize';
import { useTranslation } from 'react-i18next';

export default function NodeDetailPage() {
    const { t } = useTranslation(['wallet', 'atlas']); // 建议放到 atlas 命名空间
    const { id = '' } = useParams();
    const { loading, error, points, refresh } = useNodes();
    const nav = useNavigate();

    const point = useMemo(() => points.find(p => p.id === id), [points, id]);

    if (!point && loading) {
        return (
            <div className="container">
                <div className="tg-card">{t('loading', { ns: 'wallet', defaultValue: 'Loading…' })}</div>
            </div>
        );
    }
    if (!point && error) {
        return (
            <div className="container">
                <div className="tg-card">
                    {t('loadFailed', { ns: 'wallet', defaultValue: 'Load failed' })}：{String(error)}{' '}
                    <button className="btn ghost" onClick={() => void refresh()}>
                        {t('actions.retry', { ns: 'wallet', defaultValue: 'Retry' })}
                    </button>
                </div>
            </div>
        );
    }
    if (!point) {
        return (
            <div className="container">
                <div className="tg-card">
                    {t('atlas.nodeNotFound', { defaultValue: 'Node not found (cache may be stale).' })}{' '}
                    <button className="btn ghost" onClick={() => void refresh()}>
                        {t('actions.reloadAll', { ns: 'wallet', defaultValue: 'Reload All' })}
                    </button>
                </div>
            </div>
        );
    }

    const r = point.raw;
    const theme = getThemeTokens(); // 现在优先从 .wallet-root 取变量

    return (
        <div className="tg-wrap tg-wrap--full" style={{ paddingTop: 16, paddingBottom: 32 }}>
            {/* 顶部返回 + 标题 */}
            <div className="tg-row" style={{ marginBottom: 12 }}>
                <Link className="btn ghost" to="/ecosystem/wallets/quanta/atlas">
                    ← {t('actions.back', { ns: 'wallet', defaultValue: 'Back' })}
                </Link>
                <h2 className="tg-title">{t('atlas.nodeDetailTitle', { defaultValue: 'Node Detail' })}</h2>
            </div>

            {/* 英雄区：名称 + 发光底板 */}
            <div className="tg-card tg-glow tg-fade-in tg-hero">
                <div className="tg-hero-title">
                    <span className="tg-badge">{t('status.active', { ns: 'wallet', defaultValue: 'ACTIVE' })}</span>
                    <div className="tg-hero-name">{point.name}</div>
                    <div className="tg-hero-sub">
                        {r.country}
                        {r.province ? ` · ${r.province}` : ''}
                        {r.city ? ` · ${r.city}` : ''}
                    </div>
                </div>
                <div className="tg-hero-meta">
                    <TgMeta label={t('atlas.meta.ip', { defaultValue: 'IP' })} value={r.ip} copyable />
                    <TgMeta label={t('atlas.meta.lat', { defaultValue: 'Latitude' })} value={String(r.lat)} />
                    <TgMeta label={t('atlas.meta.lng', { defaultValue: 'Longitude' })} value={String(r.lng)} />
                </div>
            </div>

            {/* 主体两列：信息 + 小地球 */}
            <div className="tg-grid">
                {/* 信息卡 */}
                <div className="tg-card tg-fade-up">
                    <div className="tg-info-grid">
                        <TgInfo label={t('atlas.info.country', { defaultValue: 'Country/Region' })} value={r.country} />
                        {r.province && <TgInfo label={t('atlas.info.province', { defaultValue: 'Province/State' })} value={r.province} />}
                        {r.city && <TgInfo label={t('atlas.info.city', { defaultValue: 'City' })} value={r.city} />}
                        <TgInfo label={t('atlas.info.ip', { defaultValue: 'IP' })} value={r.ip} />
                        <TgInfo label={t('atlas.info.lat', { defaultValue: 'Latitude' })} value={String(r.lat)} />
                        <TgInfo label={t('atlas.info.lng', { defaultValue: 'Longitude' })} value={String(r.lng)} />
                    </div>
                </div>

                {/* 小地球卡 */}
                <div className="tg-card tg-mini-card tg-fade-up">
                    <div className="tg-card-head">
                        <div className="tg-card-title">{t('atlas.viz.title', { defaultValue: 'Location Visualization' })}</div>
                        <div className="tg-muted">{t('atlas.viz.subtitle', { defaultValue: 'Auto focus to this node' })}</div>
                    </div>
                    <div className="tg-mini-wrap">
                        <MiniGlobe
                            lat={Number(r.lat)}
                            lng={Number(r.lng)}
                            name={point.name}
                            theme={theme}
                            onBack={() => nav('/ecosystem/wallets/quanta/atlas')}
                        />
                    </div>
                </div>
            </div>

            {/* 轻提示 */}
            <div className="tg-muted" style={{ marginTop: 8, fontSize: 12 }}>
                {t('atlas.viz.note', {
                    defaultValue:
                        '* The globe is for illustration. Latitude/Longitude come from backend; rendering has been optimized.',
                })}
            </div>

            {/* 局部样式（全部 tg- 前缀） */}
            <style>{styles(theme)}</style>
        </div>
    );
}

/* ----------------- 子组件：信息块/可复制元数据（tg- 前缀） ----------------- */

function TgInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="tg-info">
            <div className="tg-info-label">{label}</div>
            <div className="tg-info-value">{value}</div>
        </div>
    );
}

function TgMeta({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
    const doCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {}
    };
    return (
        <div className="tg-meta">
            <div className="tg-meta-label">{label}</div>
            <div className="tg-meta-value">
                <span>{value}</span>
                {copyable && <button className="tg-chip" onClick={doCopy}>{label}</button>}
            </div>
        </div>
    );
}

/* ----------------- 子组件：小地球（react-globe.gl，tg- 前缀） ----------------- */

function MiniGlobe({
                       lat, lng, name, theme, onBack
                   }: {
    lat: number; lng: number; name: string; theme: ThemeTokens; onBack?: () => void;
}) {
    const globeRef = useRef<any>(null);

    // 用一个包裹容器来测量尺寸
    const [wrapRef, size] = useElementSize<HTMLDivElement>();
    const width  = Math.max(1, Math.floor(size.width));   // 防 0
    const height = Math.max(1, Math.floor(size.height));  // 防 0

    // 进入时/尺寸变化后自动飞入（等到有尺寸再飞）
    useEffect(() => {
        const g = globeRef.current;
        if (!g || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
        if (width <= 1 || height <= 1) return; // 等尺寸就绪

        g.pointOfView({ lat, lng, altitude: 2.2 }, 0);
        const t = setTimeout(() => {
            g.pointOfView({ lat, lng, altitude: 1.5 }, 900);
        }, 60);
        return () => clearTimeout(t);
    }, [lat, lng, width, height]);

    // 单点数据 + HTML 脉冲标记
    const pt = useMemo(() => [{ lat, lng, name }], [lat, lng, name]);
    const htmlPulse = useMemo(() => {
        const el = document.createElement('div');
        el.className = 'tg-pulse';
        el.title = name;
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.borderRadius = '50%';
        el.style.background = theme.primary;
        el.style.boxShadow = `0 0 0 0 ${hexToRgba(theme.primary, 0.6)}`;
        el.style.transform = 'translate(-50%, -50%)';
        el.style.animation = 'tg-pulse 1.8s ease-out infinite';
        return el;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, theme.primary]);

    return (
        <div className="tg-mini" ref={wrapRef}>
            <Globe
                ref={globeRef}
                width={width}
                height={height}
                backgroundColor="rgba(0,0,0,0)"
                animateIn={false}
                showAtmosphere
                atmosphereColor={theme.primary}
                atmosphereAltitude={0.25}
                showGraticules={false}
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                rendererConfig={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                waitForGlobeReady
                enablePointerInteraction={false}
                pointsData={pt}
                pointAltitude={0.06}
                pointRadius={1.1}
                pointColor={() => theme.primary}
                htmlElementsData={pt}
                htmlLat={(d: any) => d.lat}
                htmlLng={(d: any) => d.lng}
                htmlAltitude={() => 0.01}
                htmlElement={() => htmlPulse}
            />
            <button className="tg-mini-back" onClick={onBack}>↩</button>
        </div>
    );
}

/* ----------------- 主题/样式（全部 tg- 前缀） ----------------- */

type ThemeTokens = {
    bg: string;
    panel: string;
    surface: string;
    line: string;
    text: string;
    muted: string;
    primary: string;
    radius: string;
};

/** 优先从 .wallet-root 读取 CSS 变量（与 wallet-tokens.css 对齐） */
function getThemeTokens(): ThemeTokens {
    const scope =
        (document.querySelector('.wallet-root') as HTMLElement) || document.documentElement;

    const read = (name: string, fallback: string) =>
        getComputedStyle(scope).getPropertyValue(name)?.trim() || fallback;

    return {
        bg:      read('--bg', '#0b0e11'),
        panel:   read('--bg-panel', '#101419'),
        surface: read('--bg-surface', '#0f1318'),
        line:    read('--line', '#1c2530'),
        text:    read('--text', '#d8e1ea'),
        muted:   read('--muted', '#8a97a6'),
        primary: read('--primary', '#4ddfc4'),
        radius:  read('--wallet-radius', '16px'),
    };
}

function hexToRgba(hex: string, a = 1) {
    const m = hex.replace('#', '');
    const bigint = parseInt(m.length === 3 ? m.split('').map(x => x + x).join('') : m, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${a})`;
}

function styles(t: ThemeTokens) {
    return `
/* 动画（tg- 前缀） */
@keyframes tg-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tg-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tg-pulse {
  0% { box-shadow: 0 0 0 0 ${hexToRgba(t.primary, 0.55)}; }
  70% { box-shadow: 0 0 0 14px ${hexToRgba(t.primary, 0)}; }
  100% { box-shadow: 0 0 0 0 ${hexToRgba(t.primary, 0)}; }
}

/* 发光卡片 */
.tg-glow { position: relative; overflow: hidden; }
.tg-glow::before {
  content: '';
  position: absolute;
  inset: -20%;
  background: radial-gradient(600px 300px at 10% 0%, ${hexToRgba(t.primary, 0.18)} 0%, transparent 60%);
  pointer-events: none;
}

/* 文字/行/ muted */
.tg-row { display:flex; gap:12px; align-items:center; }
.tg-title { margin:0; letter-spacing:.3px; }
.tg-muted { color: ${t.muted}; }

/* 卡片（命名空间 tg-card） */
.tg-card {
  background: ${t.panel};
  border: 1px solid ${t.line};
  border-radius: ${t.radius};
  padding: 16px;
}
.tg-fade-in { animation: tg-fade-in .38s ease-out both; }
.tg-fade-up { animation: tg-fade-up .42s ease-out both; }

/* 英雄区 */
.tg-hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  background: linear-gradient(180deg, ${t.panel} 0%, ${t.surface} 100%);
}
.tg-hero-title { padding: 14px 16px; }
.tg-hero-meta  { padding: 14px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.tg-badge {
  display:inline-flex; align-items:center; gap:6px;
  font-size: 12px; letter-spacing: .5px;
  color: ${t.text};
  background: ${hexToRgba(t.primary, .1)};
  border: 1px solid ${hexToRgba(t.primary, .35)};
  padding: 4px 8px; border-radius: 999px;
}
.tg-hero-name { font-size: 24px; margin-top: 10px; margin-bottom: 6px; }
.tg-hero-sub  { font-size: 13px; color:${t.muted}; }

/* 元信息（可复制） */
.tg-meta {}
.tg-meta-label { color: ${t.muted}; font-size: 12px; margin-bottom: 4px; }
.tg-meta-value { display:flex; align-items:center; gap:8px; font-size: 16px; }
.tg-chip {
  border-radius: 10px; padding: 4px 8px; font-size: 12px;
  border: 1px solid ${t.line}; background: transparent; color: ${t.text};
}
.tg-chip:hover { border-color: ${hexToRgba(t.primary, .5)}; }

/* 信息网格 */
.tg-info-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
}
.tg-info { padding: 8px 4px; border-bottom: 1px dashed ${hexToRgba(t.line, .6)}; }
.tg-info-label { color: ${t.muted}; font-size: 12px; margin-bottom: 2px; }
.tg-info-value { font-size: 16px; }

/* 小地球区域（命名空间 tg-mini*） */
.tg-mini-card { position: relative; }
.tg-card-head { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px; }
.tg-card-title { font-weight: 600; }
.tg-mini-wrap {
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: ${t.radius};
  overflow: hidden;
  background: radial-gradient(600px 300px at 80% 0%, ${hexToRgba(t.primary, 0.12)} 0%, ${t.surface} 70%);
  border: 1px solid ${t.line};
}
.tg-mini { position: relative; width: 100%; height: 100%; }
.tg-mini-back {
  position: absolute; right: 8px; bottom: 8px;
  border-radius: 999px; padding: 6px 10px;
  border: 1px solid ${t.line};
  background: rgba(0,0,0,.25);
  color: ${t.text};
  backdrop-filter: blur(6px);
}

/* 布局 */
.tg-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
@media (max-width: 1024px) {
  .tg-grid { grid-template-columns: 1fr; }
}
`;
}
