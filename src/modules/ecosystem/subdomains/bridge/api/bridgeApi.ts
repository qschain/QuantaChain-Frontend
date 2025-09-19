import { http } from '../../../../../shared/api/http';

export async function getPortfolio(options?: { bypassMock?: boolean }) {
    return http.get<{
        totalUsd: string;
        totalInTrx: string;
        chains: Array<{
            chain: string;
            symbol: string;
            amount: string;
            usd: string;
            share: string;
            icon?: string;
        }>;
    }>('/bridge/portfolio', { bypassMock: options?.bypassMock });
}

export async function getRecentTxs() {
    return http.get<{ items: Array<{
            id: string;
            asset: string;
            path: string;
            time: string;
            status: 'success' | 'processing' | 'failed';
            txHash: string;
        }> }>('/bridge/recent');
}
