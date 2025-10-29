
import type {
    ChainOverview,
    BlockDetail,
    TxDetail,
    TokenLite,
    InitBlocksResponse,
    LatestHeadResponse,
    BlockItem,
    LatestTxItem,
} from '../../state/types';
import { http } from '../../../../../../shared/api/http';


// 小工具：安全取路径
function pick<T>(raw: any, path: string[]): T | undefined {
    let cur = raw;
    for (const k of path) {
        if (cur == null) return undefined;
        cur = cur[k];
    }
    return cur as T | undefined;
}

/* ------------------------ 本文件内的最小类型（若你已在 types.ts 定义，请改为从 types.ts 引入） ------------------------ */
type RawToken = {
    abbr: string;
    name: string;
    contractAddress?: string;
    priceInTrx?: number;
    priceInUsd?: number;
    marketCapUSD?: number;
    volume24hInTrx?: number;
    volume24hInUsd?: number;
    gain?: number; // 多数是比率(0.0123 = +1.23%)；若你后端已是百分比，下面映射处把 *100 去掉
};

type TokensListResponse =
    | { code?: number; message?: string; data: RawToken[]; total?: number }
    | { items: RawToken[]; total?: number };

/* ------------------------ 通用小工具 ------------------------ */
const s = (v: any) => (v == null ? '' : String(v));
const n = (v: any) => {
    if (v == null || v === '') return 0;
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
};

function toTokenLite(t: RawToken, rank: number): TokenLite {
    const priceUsd = t.priceInUsd ?? 0;
    // 若后端 gain 已是“百分比”，把 *100 去掉
    const changePct = (t.gain ?? 0) * 100;

    return {
        rank,
        name: t.name ?? t.abbr ?? '-',
        symbol: t.abbr ?? '',
        price: priceUsd,
        change24h: changePct,
        marketcap: t.marketCapUSD ?? 0,
        // volume 优先用 USD，没有就退回 TRX（如需按 TRX→USD 换算，在此处加入换算逻辑）
        volume24h: t.volume24hInUsd ?? t.volume24hInTrx ?? 0,
    };
}

/* ------------------------ API ------------------------ */
export const api = {
    /**
     * 首屏：区块初始化 —— 命中真实后端 /api/block/init
     * 返回 { items: BlockLite[] }（已按最新在前裁剪到 limit）
     */
    async getLatestBlocks(limit = 10): Promise<{ items: BlockItem[] }> {
        const raw = await http.get<InitBlocksResponse>('/api/block/init', {
            useRealApi: true
        });
        const arr = pick<BlockItem[]>(raw, ['data']) ?? [];
        const items = arr.slice(-limit);
        return { items };
    },

    /**
     * 轮询：最新区块 + 最新交易 —— 命中真实后端 /api/block/latest
     * 返回 { block: BlockLite, txs: TxLite[] }
     * 说明：/api/block/latest 结构为 { newBlock: {...}, blockTrxEntityList: [...] }
     */
    async getLatestHead(): Promise<{ block: BlockItem; txs: LatestTxItem[] }> {
        const d = pick<LatestHeadResponse['data']>(
            await http.get<LatestHeadResponse>('/api/block/latest', {
                useRealApi: true,
                withAuth: false,
            }),
            ['data']
        );
        return {
            block: d?.newBlock as BlockItem,
            txs: (d?.blockTrxEntityList ?? []) as LatestTxItem[],
        };
    },

    async fetchTxDetail(trxHash: string): Promise<TxDetail> {
        return await http.post<TxDetail>(
            '/api/trxInformation',
            { trxHash },
            { useRealApi: true }
        );
    },

    async getOverview(): Promise<ChainOverview> {
        // 原来少了前导斜杠，改为 '/api/get/edgeData'
        return await http.get<ChainOverview>(
            '/api/get/edgeData',
            { useRealApi: true }
        );
    },

    async getTokens(page = 1, size = 20): Promise<{ items: TokenLite[]; total: number | null }> {
        const start = (page - 1) * size;

        const res = await http.post<TokensListResponse>(
            '/api/tokensList',
            { start: String(start)},
            { useRealApi: true, withAuth: false } // 直连真实后端
        );

        const rawList: RawToken[] = (res as any).data ?? (res as any).items ?? [];
        const items = rawList.map((t, i) => toTokenLite(t, start + i + 1));

        const total = (res as any).total ?? null;
        return { items, total };
    },
    /* ---------------- explorer 侧其余接口（保持原路由，可被 MSW） ---------------- */

    getBlock(height: number): Promise<BlockDetail> {
        return http.get<BlockDetail>(`/api/explorer/blocks/${height}`, { withAuth: false });
    },


    /**
     * 真实后端的代币列表：
     * - 接口：POST /api/tokensList
     * - 入参：{ start, limit }，其中 start = (page-1)*size
     * - 返回：可能是 { code, message, data, total } 或 { items, total }
     * - 适配成 { items: TokenLite[], total: number|null }
     */
};

export default api;
