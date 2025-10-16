export type ChainOverview = {
    code:string
    messgae:string
    data:{
        "blockHeight":number
        "currentTps": number,
        "maxTps": number,
        "trxRate": number,
        "superNumber": string
    }
};

export type BlockLite = {
    height:number; hash:string; time:string; txCount:number; miner?:string;
};

export type TxLite = {
    hash:string; time:string; from:string; to?:string;
    value:string; fee:string; status:'success'|'failed'|'pending'; blockHeight?:number; method?:string;
};

export type BlockDetail = BlockLite & {
    size?:number; parentHash?:string; gasUsed?:string; gasLimit?:string;
    transactions: TxLite[];
};

export type TxDetail = {
    code:string,
    meessage:string,
    data:{
        "blockNum": string
        "time": string
        "ownerAddress":string
        "toAddress":string
        "contractType":string
        "contractDescribe":string
        "amount":string
        "fee":string
        "status": string
        "hash":string
    }
};

// 列表行展示用的精简 Token
export type TokenLite = {
    rank: number;        // 序号（按页计算）
    name: string;        // 名称
    symbol: string;      // 代号（abbr）
    price: number;       // USD 价格
    change24h: number;   // 24h 涨跌百分比（正负）
    marketcap: number;   // 总市值（USD）
    volume24h: number;   // 24h 成交量（USD 或 TRX 映射后）
};

// —— 后端原始字段（按你截图补充）——
export type RawToken = {
    abbr: string;
    name: string;
    contractAddress?: string;
    priceInTrx?: number;
    priceInUsd?: number;
    marketCapUSD?: number;
    volume24hInTrx?: number;
    volume24hInUsd?: number;
    gain?: number; // 多数接口里是“比率”(0.0123=+1.23%)，若已是百分比，就不要 *100
};

// /api/tokensList 可能返回的两种形态（做个并集）
export type TokensListResponse =
    | { code?: number; message?: string; data: RawToken[]; total?: number }
    | { items: RawToken[]; total?: number };

// getTokens 的统一返回
export type GetTokensResult = {
    items: TokenLite[];
    total: number | null; // 后端不给总数时为 null
};