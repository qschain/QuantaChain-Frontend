// src/modules/ecosystem/explorer/shared/api/api.ts
import type {
  ChainOverview,
  BlockLite,
  BlockDetail,
  TxLite,
  TxDetail,
  TokenLite,
} from '../../state/types';
import { http } from '../../../../../../shared/api/http';

/* ------------------------ 通用小工具 ------------------------ */
const s = (v: any) => (v == null ? '' : String(v));
const n = (v: any) => {
  if (v == null || v === '') return 0;
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

// 后端常见包裹 { code, message, data } 兼容
function unwrap<T>(raw: any): T {
  if (raw && typeof raw === 'object' && 'data' in raw && raw.data !== undefined) return raw.data as T;
  return raw as T;
}

/* ------------------------ 适配器 ------------------------ */
// 如果你的 BlockLite 字段是 string，保持 string 版本更稳；若是 number，可把对应几项改成 n(...)
function toBlockLite(b: any): BlockLite {
  const out: any = {
    number:     s(b.number ?? b.height),
    hash:       s(b.hash),
    parentHash: s(b.parentHash ?? b.parent_hash),
    size:       s(b.size),
    witnessName:s(b.witnessName ?? b.witness),
    trxCount:   s(b.trxCount ?? b.txCount ?? b.txnCount),
    time:       s(b.time ?? b.timestamp), // 这里按字符串展示，如果你用 Date 再格式化也行
    fee:        s(b.fee),
    blockReward:s(b.blockReward),
    voteReward: s(b.voteReward),
    netUsage:   s(b.netUsage),
    energyUsage:s(b.energyUsage)
  };
  return out as BlockLite;
}

function toTxLite(x: any): TxLite {
  const out: any = {
    hash:   s(x.hash),
    from:   s(x.fromAddress ?? x.oneAddress ?? x.ownerAddress ?? ''),
    to:     s(x.toAddress ?? ''),
    amount: s(x.amount ?? x.value),
    symbol: s(x.symbol ?? 'TRX'),
    time:   s(x.time ?? x.timestamp),
    status: s(x.status ?? 'success'),
  };
  return out as TxLite;
}

/* ------------------------ API ------------------------ */
export const api = {
  /**
   * 首屏：区块初始化 —— 命中真实后端 /api/block/init
   * 返回 { items: BlockLite[] }（已按最新在前裁剪到 limit）
   */
  async getLatestBlocks(limit = 10): Promise<{ items: BlockLite[] }> {
    const raw = await http.get<any>('/api/block/init', { useRealApi: true, withAuth: false });
    const arr = unwrap<any[]>(raw) ?? [];
    // 后端通常返回旧→新，这里取最后 limit 条再反转，保证“最新在前”
    const items = arr.slice(-limit).reverse().map(toBlockLite);
    return { items };
  },

  /**
   * 轮询：最新区块 + 最新交易 —— 命中真实后端 /api/block/latest
   * 返回 { block: BlockLite, txs: TxLite[] }
   * 说明：/api/block/latest 截图结构为 { newBlock: {...}, blockTrxEntityList: [...] }
   */
  async getLatestHead(): Promise<{ block: BlockLite; txs: TxLite[] }> {
    const raw = await http.get<any>('/api/block/latest', { useRealApi: true, withAuth: false });
    const root = unwrap<any>(raw) ?? {};
    const blockSrc = root?.newBlock ?? root?.data?.newBlock;  // 兜底
    const txSrc: any[] = Array.isArray(root.blockTrxEntityList) ? root.blockTrxEntityList : [];
    const block = toBlockLite(blockSrc);
    const txs = txSrc.map(toTxLite);
    return { block, txs };
  },
    async fetchTxDetail(trxHash: string): Promise<TxDetail> {
        return await http.post<TxDetail>(
        '/api/trxInformation',
        { trxHash },
        { useRealApi: true, withAuth: false }  // ⭐ 强制走真实后端
    )
},
    async getOverview(): Promise<ChainOverview> {
        return await http.get<ChainOverview>(
            'api/get/edgeData',
            { useRealApi: true, withAuth: false }
        )
    },
  /* ---------------- explorer 侧其余接口（保持原路由，可被 MSW） ---------------- */

  // getOverview(): Promise<ChainOverview> {
  //   return http.get<ChainOverview>('/api/explorer/overview', { withAuth: false });
  // },

  getLatestTxs(limit = 10): Promise<{ items: TxLite[] }> {
    return http.get<{ items: TxLite[] }>('/api/explorer/txs', {
      withAuth: false,
      query: { limit },
    });
  },

  getBlock(height: number): Promise<BlockDetail> {
    return http.get<BlockDetail>(`/api/explorer/blocks/${height}`, { withAuth: false });
  },

  getTx(hash: string): Promise<TxDetail> {
    return http.get<TxDetail>(`/api/explorer/tx/${hash}`, { withAuth: false });
  },

  getTokens(page = 1, size = 20): Promise<{ items: TokenLite[]; total: number }> {
    return http.get<{ items: TokenLite[]; total: number }>('/api/explorer/tokens', {
      withAuth: false,
      query: { page, size },
    });
  },

  postTry(body: any): Promise<any> {
    return http.post<any>('/api/explorer/try', body, {
      withAuth: false,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

export default api;
