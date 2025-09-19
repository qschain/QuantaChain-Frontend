import { http } from '../../../../../shared/api/http' // ← 按你的项目真实路径调整

/* ========== Types ========== */
export type Dapp = {
    id: string
    name: string
    brief?: string
    category?: string
    tags?: string[]
    tvlDisplay?: string
    volume24hDisplay?: string
    users24hDisplay?: string
    kpiDisplay?: string
    // UI 辅助字段
    metricLabel?: string
    metricValue?: string
    change?: number
    symbol?: string
}

export type Overview = {
    apps: number
    users24h: number
    vol24h: string
    volTotal: string
}

export type Rankings = {
    dau: Dapp[]
    vol: Dapp[]
    growth: Dapp[]
}

export type SearchResult = {
    list: Dapp[]
    page: number
    pageSize: number
    total: number
}

export type Portfolio = {
    value: string
    active: number
    dist: { name: string; value: string }[]
}

/* ========== Helpers ========== */
function withSymbol<T extends Dapp>(d: T): T {
    return {
        ...d,
        symbol: (d.name || '')
            .split(' ')
            .map((s) => s[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
    }
}

/**
 * 可选的请求级控制参数（透传到 http.ts）
 */
type ControlOpts = {
    withAuth?: boolean
    timeoutMs?: number
    bypassMock?: boolean
}

/* ========== APIs ========== */

// 顶部“DApp 生态系统总览”
export function getOverview(ctrl?: ControlOpts) {
    return http.get<Overview>('/dapps/overview', ctrl)
}

// 排行榜（三块：DAU / 24h 交易量 / 用户增长）
export async function getRankings(ctrl?: ControlOpts) {
    const r = await http.get<Rankings>('/dapps/rankings', ctrl)
    return {
        dau: r.dau.map(withSymbol),
        vol: r.vol.map(withSymbol),
        growth: r.growth.map(withSymbol),
    }
}

// 首页 featured
export async function getFeatured(ctrl?: ControlOpts) {
    const list = await http.get<Dapp[]>('/dapps/featured', ctrl)
    return list.map(withSymbol)
}

// Discover 列表（分页查询）
export async function searchDapps(
    params: { page?: number; pageSize?: number } = {},
    ctrl?: ControlOpts
) {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 12
    const r = await http.get<SearchResult>('/dapps/search', {
        ...ctrl,
        query: { page, pageSize },
    })
    return { ...r, list: r.list.map(withSymbol) }
}

// 我的收藏
export async function getFavorites(ctrl?: ControlOpts) {
    const list = await http.get<Dapp[]>('/dapps/favorites', ctrl)
    return list.map(withSymbol)
}

// 我的组合/持仓分布
export function getPortfolio(ctrl?: ControlOpts) {
    return http.get<Portfolio>('/dapps/portfolio', ctrl)
}

/* ========== 用法示例（可删） ========== */
// getOverview({ withAuth:false, timeoutMs: 10000 })
// getRankings({ bypassMock: true }) // 向 MSW 传递 x-msw-bypass 头与 __real=1 查询参数
