import type { ChainOverview, BlockLite, BlockDetail, TxLite, TxDetail, TokenLite } from '../../state/types';

const j = (r:Response) => r.json();

export const api = {
    getOverview():Promise<ChainOverview>{
        return fetch('/api/explorer/overview').then(j);
    },
    getLatestBlocks(limit=10):Promise<{items:BlockLite[]}>{
        return fetch(`/api/explorer/blocks?limit=${limit}`).then(j);
    },
    getLatestTxs(limit=10):Promise<{items:TxLite[]}>{
        return fetch(`/api/explorer/txs?limit=${limit}`).then(j);
    },
    getBlock(height:number):Promise<BlockDetail>{
        return fetch(`/api/explorer/blocks/${height}`).then(j);
    },
    getTx(hash:string):Promise<TxDetail>{
        return fetch(`/api/explorer/tx/${hash}`).then(j);
    },
    getTokens(page=1,size=20):Promise<{items:TokenLite[], total:number}>{
        return fetch(`/api/explorer/tokens?page=${page}&size=${size}`).then(j);
    },
    postTry(body:any):Promise<any>{
        return fetch('/api/explorer/try', { method:'POST', body:JSON.stringify(body) }).then(j);
    }
};
