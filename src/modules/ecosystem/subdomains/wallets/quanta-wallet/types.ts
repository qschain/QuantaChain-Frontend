
export type User = {
  id: string
  name: string
  email: string
  token?: string
}

export type LoginResponse = {
  code: string
  message: string
  data?: {
    role: string
    confirm: string  
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
export type DashboardDTO = {
    overview: TotalOverview
    mainAssets: MainAsset[]
    market: MarketRow[]
    distribution: {label:string; value:number; color:string}[]
    activities: Activity[]
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

