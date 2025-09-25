import { http } from './httpWallet';
import type { NodesApiResp, NodesData, AtlasPoint, NodeRaw } from '../../types';

// 简单 slug 化（路由与 i18n 更稳）
function slugify(x?: string) {
    return (x ?? '').toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

// 适配 raw -> AtlasPoint
function toPoint(raw: NodeRaw): AtlasPoint | null {
    const lat = Number(raw.lat);
    const lng = Number(raw.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const id = raw.ip || `${raw.ip}-${raw.country}-${raw.province ?? ''}-${raw.city ?? ''}`;
    const name = raw.city || raw.province || raw.country || raw.ip;
    const region =
        [slugify(raw.country), slugify(raw.province), slugify(raw.city)]
            .filter(Boolean)
            .join('/') || slugify(raw.country) || 'unknown';

    // ip 冲突时由上层去重
    return { id, name, region, lat, lng, raw };
}

// GET /api/get/nodes/data （走真实后端）
export async function getNodesData(): Promise<NodesData> {
    const resp = await http.get<NodesApiResp>('/api/get/nodes/data', {
        withAuth: false,
        useRealApi: true,
    });

    if (!resp || resp.code !== '200') {
        const m = (resp as any)?.message ?? 'Unknown error';
        throw new Error(`节点数据获取失败：${m}`);
    }

    const seen = new Set<string>();
    const points: AtlasPoint[] = [];
    for (const r of resp.data.dataList || []) {
        const p = toPoint(r);
        if (!p) continue;
        const key = p.id; // 以 ip 为主键
        if (seen.has(key)) {
            // 冲突时补后缀以保证 key 唯一
            let i = 2;
            while (seen.has(`${key}-${i}`)) i++;
            p.id = `${key}-${i}`;
        }
        seen.add(p.id);
        points.push(p);
    }

    return { points, counts: resp.data.count || {} };
}
