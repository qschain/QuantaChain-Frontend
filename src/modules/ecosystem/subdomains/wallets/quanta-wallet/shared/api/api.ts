import type {
    AssetOverview,
    TxItem,
    AccountGetByUserResp,
    transferCrypto
} from '../../types'
import { http } from '../../../../../../../shared/api/http'

type ApiOpts = { real?: boolean }


function withReal<T extends Record<string, any> | undefined>(opts: T, real?: boolean): T {
    const next: any = { ...(opts || {}) }
    if (real) next.useRealApi = true
    return next as T
}

export const api = {
    async getAccountOverview(
        username: string,
        opts?: { real?: boolean }
    ): Promise<AccountGetByUserResp> {
        return http.post<AccountGetByUserResp>(
            'api/account/get',
            { userName: username },
            { useRealApi: !!opts?.real }
        )
    },

     async transfer(
         userName: string,
         passWord: string, 
         toTronAddress: string, 
         amount: number ,  
         opts?: { real?: boolean}
        ):Promise<transferCrypto> {
        return http.post<transferCrypto>(
        '/api/transaction/trx',
        { userName, passWord, toTronAddress, amount },
        withReal(undefined, opts?.real)
        )
    },

    async getAssetOverview(opts?: ApiOpts): Promise<AssetOverview> {
        return http.get<AssetOverview>('/api/asset/overview', withReal(undefined, opts?.real))
    },

    async getTxHistory(opts?: ApiOpts): Promise<TxItem[]> {
        return http.get<TxItem[]>('/api/tx/history', withReal(undefined, opts?.real))
    },

    async getDepositAddress(assetId: string, networkId: string, opts?: ApiOpts) {
        return http.get<{ address: string; tag?: string; qrcodeUrl?: string }>(
            '/api/deposit/address',
            withReal({ query: { assetId, networkId } }, opts?.real)
        )
    },

    async quoteWithdraw(assetId: string, networkId: string, amount: number, opts?: ApiOpts) {
        return http.get<{ fee: number; fiat: number; minAmount: number; estimatedTime: string }>(
            '/api/withdraw/quote',
            withReal({ query: { assetId, networkId, amount } }, opts?.real)
        )
    },

    // async getDashboard(opts?: ApiOpts): Promise<{
    //     overview: { totalUSD: number; diffUSD: number; diffPct: number; series: number[] },
    //     mainAssets: { icon: string; name: string; symbol: string; amount: number; usd: number; changePct: number }[],
    //     market: { pair: string; price: number; changePct: number }[],
    //     distribution: { label: string; value: number; color: string }[],
    //     activities: Activity[]
    // }> {
    //     return http.get('/api/dashboard', withReal(undefined, opts?.real))
    // }
}

// 报价：from=BTC, to=ETH, amount=0.5 返回 outAmount/费率/费用/余额
export async function getSwapQuote(params: { from: string; to: string; amount: number }, opts?: ApiOpts) {
    return http.get<{ rate: number; outAmount: number; feeUSD: number; balance: number }>(
        '/api/swap/quote',
        withReal({ query: params }, opts?.real)
    )
}

export type SwapHistoryItem = {
    pair: string
    amount: string
    status: '成功' | '失败'
    time: string
    hash: string
}
export async function getSwapHistory(opts?: ApiOpts): Promise<SwapHistoryItem[]> {
    return http.get<SwapHistoryItem[]>('/api/swap/history', withReal(undefined, opts?.real))
}

export type BridgeNetwork = { id: string; name: string; icon?: string }
export type BridgeQuote = { send: number; gasUSD: number; bridgeFeePct: number; totalUSD: number }

export async function listBridgeNetworks(opts?: ApiOpts): Promise<BridgeNetwork[]> {
    return http.get<BridgeNetwork[]>('/api/bridge/networks', withReal(undefined, opts?.real))
}

export async function bridgeQuote(params: { from: string; to: string; amount: number }, opts?: ApiOpts): Promise<BridgeQuote> {
    return http.get<BridgeQuote>('/api/bridge/quote', withReal({ query: params }, opts?.real))
}
