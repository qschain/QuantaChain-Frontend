export type User = { id: string; name: string; email: string }
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