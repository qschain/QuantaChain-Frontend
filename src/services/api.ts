import type { AssetOverview, TxItem, User } from '../types'
import type { Activity } from '../types'
import { http } from '../lib/http'

const json = async <T>(res: Response) => {
    if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`)
    return res.json() as Promise<T>
}

export const api = {
    async login(identifier: string, password: string): Promise<User> {
        return http.post<User>('/api/login', { identifier, password }, { withAuth: false })
    },

    async getAssetOverview(): Promise<AssetOverview> {
        return http.get<AssetOverview>('/api/asset/overview')
    },

    async getTxHistory(): Promise<TxItem[]> {
        return http.get<TxItem[]>('/api/tx/history')
    },

    async getDepositAddress(assetId:string, networkId:string) {
        return http.get<{ address:string; tag?:string; qrcodeUrl?:string }>('/api/deposit/address', {
            query: { assetId, networkId }
        })
    },

    async quoteWithdraw(assetId:string, networkId:string, amount:number) {
        return http.get<{ fee:number; fiat:number; minAmount:number; estimatedTime:string }>('/api/withdraw/quote', {
            query: { assetId, networkId, amount }
        })
    },

    async getDashboard(): Promise<{
        overview: { totalUSD:number; diffUSD:number; diffPct:number; series:number[] },
        mainAssets: { icon:string; name:string; symbol:string; amount:number; usd:number; changePct:number }[],
        market: { pair:string; price:number; changePct:number }[],
        distribution: { label:string; value:number; color:string }[],
        activities: Activity[]
    }> {
        return http.get('/api/dashboard')
    }
}

// 报价：from=BTC, to=ETH, amount=0.5 返回 outAmount/费率/费用/余额
export async function getSwapQuote(params: { from: string; to: string; amount: number }) {
    return http.get<{ rate:number; outAmount:number; feeUSD:number; balance:number }>('/api/swap/quote', {
        query: params
    })
}

export type SwapHistoryItem = {
    pair: string
    amount: string
    status: '成功' | '失败'
    time: string
    hash: string
}

export async function getSwapHistory(): Promise<SwapHistoryItem[]> {
    return http.get<SwapHistoryItem[]>('/api/swap/history')
}

export type BridgeNetwork = {
    id: string; name: string; icon?: string;
}
export type BridgeQuote = {
    send: number;
    gasUSD: number;
    bridgeFeePct: number;
    totalUSD: number;
}

export async function listBridgeNetworks(): Promise<BridgeNetwork[]> {
    return http.get<BridgeNetwork[]>('/api/bridge/networks')
}

export async function bridgeQuote(params: { from:string; to:string; amount:number }): Promise<BridgeQuote> {
    return http.get<BridgeQuote>('/api/bridge/quote', { query: params })
}