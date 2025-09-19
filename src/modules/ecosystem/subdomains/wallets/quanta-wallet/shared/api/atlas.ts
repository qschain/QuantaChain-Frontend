export type AtlasPoint = {
    id: string;          // 唯一ID
    region: string;      // 路由参数，如 'hk'
    name: string;        // 中文名称
    lat: number;
    lng: number;
};

export async function getAtlasPoints(): Promise<AtlasPoint[]> {
    const res = await fetch('/api/atlas/points')
    if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`)
    return res.json()
}

export type RegionMetrics = {
    region: string;
    name: string;
    accounts: number;            // Number of Accounts
    txCount: number;             // Transaction Count
    transferVolumeUSD: number;   // Total Transfer Volume
    tvlUSD: number;              // Token Value Locked
};

export async function getRegionMetrics(region: string): Promise<RegionMetrics> {
    const res = await fetch(`/api/atlas/region/${region}`)
    if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`)
    return res.json()
}