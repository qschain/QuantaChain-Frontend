export type User = {
  role: string
  name: string
  token?: string
}

export type LoginResponse = {
  code: string
  message: string
  data?: {
    role: string
    userName: string
    token: string
  }
}

export type RegisterResponse = {
  code: string
  message: string
  data?: {
      "message": string
  }
}
export type transferCrypto = { 
  code: string
  message: string 
  data?: {
      "burn": string
      "amount": string
      "laterBalance": string
      "beforeBalance": string
  }
}


export type AccountGetByUserReq = { username: string }

export type AccountAssetRow = {
    tokenAbbr: string
    accountBalance: string
    oneToDollar: string
    dollarAccountBalance: string
    percent: string
}

export type AccountGetByUserResp = {
    code: string
    message: string
    data: {
        totalDollar: string
        dataList: AccountAssetRow[]
    }
}

export type AssetOverview = {
    id: string; symbol: string; name: string; network: string;
    address: string; balance: number; fiatValue: number; change24h: number;
}
export type TxItem = {
    hash: string; type: '发送'|'接收'|'兑换'|'质押'|'提现'|'充值';
    amount: number; symbol: string; ts: string; status: '成功'|'处理中'|'失败';
}

export type ActivityType = '接收' | '发送' | '兑换';

export type Activity = {
    type: ActivityType;
    asset: string;
    amount: string;
    time: string;
    delta?: string;
};

export type MainAsset = {
    name: string
    symbol: string
    amount: number
    usd: number
    changePct: number
    icon: string
}

export type DistributionItem = {
    label: string
    value: number
    color: string
}

export type Overview = {
    totalUSD: number
    diffUSD: number
    diffPct: number
    series: number[]
}

export type MarketItem = {
    pair: number;
    symbol: string
    price: number
    changePct: number
}

export type DashboardDTO = {
    overview: Overview
    mainAssets: MainAsset[]
    market: MarketItem[]
    distribution: DistributionItem[]
    activities: Activity[] // 使用已存在的 Activity 类型
}

//Atlas的type
// 原始后端记录
export type NodeRaw = {
    country: string;
    province?: string;
    city?: string;
    ip: string;
    lat: number | string;
    lng: number | string;
    [k: string]: any; // 兼容未来后端扩展字段
};

// 后端响应
export type NodesApiResp = {
    code: string; // '200'
    message: string;
    data: {
        dataList: NodeRaw[];
        count: Record<string, number>;
    };
};

// 地球点（喂给 react-globe.gl）
export type AtlasPoint = {
    id: string;           // 用 ip；冲突自动去重
    name: string;         // city || province || country
    region: string;       // 用于路由/i18n 的稳定键，例如 country/province/city 的 slug
    lat: number;
    lng: number;
    raw: NodeRaw;         // 详情页直接展示
};

// 排名数据
export type NodesCount = Record<string, number>;

export type NodesData = {
    points: AtlasPoint[];
    counts: NodesCount;
};
