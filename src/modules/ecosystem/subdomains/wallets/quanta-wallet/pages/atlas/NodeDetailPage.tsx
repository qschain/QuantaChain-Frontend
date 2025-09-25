import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNodes } from '../../model/atlas/NodesStore';

export default function NodeDetailPage() {
    const { id = '' } = useParams();
    const { loading, error, points, refresh } = useNodes();

    const point = useMemo(() => points.find(p => p.id === id), [points, id]);

    if (!point && loading) {
        return <div className="container"><div className="card">加载中…</div></div>;
    }
    if (!point && error) {
        return (
            <div className="container">
                <div className="card">
                    加载失败：{error} <button className="btn ghost" onClick={()=>void refresh()}>重试</button>
                </div>
            </div>
        );
    }
    if (!point) {
        return (
            <div className="container">
                <div className="card">
                    未找到该节点（可能缓存丢失）。<button className="btn ghost" onClick={()=>void refresh()}>重新加载全部</button>
                </div>
            </div>
        );
    }

    const r = point.raw;
    return (
        <div className="container" style={{ paddingTop: 16, paddingBottom: 24 }}>
            <div className="row" style={{ alignItems:'center', gap:12 }}>
                <Link className="btn ghost" to="/ecosystem/explorer">← 返回</Link>
                <h2 style={{ margin: 0 }}>{point.name}</h2>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
                <div className="row" style={{ gap: 24, flexWrap: 'wrap' }}>
                    <Info label="IP" value={r.ip} />
                    <Info label="国家" value={r.country} />
                    {r.province && <Info label="省/州" value={r.province} />}
                    {r.city && <Info label="城市" value={r.city} />}
                    <Info label="纬度" value={String(r.lat)} />
                    <Info label="经度" value={String(r.lng)} />
                </div>
            </div>

            {/* 可选：这里嵌一个小地球定位该点，若需要我可以再补 */}
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="secondary" style={{ marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18 }}>{value}</div>
        </div>
    );
}
