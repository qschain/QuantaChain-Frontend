// src/modules/ecosystem/features/dapps/msw/handlers.ts
import { http, HttpResponse } from 'msw';

const dapps = [
    { id:'js', name:'JustSwap', brief:'DeFi', category:'DeFi', tags:['DeFi'], tvlDisplay:'$2.1B', volume24hDisplay:'$150M', users24hDisplay:'1.2M', kpiDisplay:'45.2k' },
    { id:'sun', name:'SunSwap', brief:'DeFi', category:'DeFi', tags:['DeFi'], tvlDisplay:'$1.2B', volume24hDisplay:'$98M', users24hDisplay:'980k', kpiDisplay:'31.6k' },
    { id:'ap', name:'APENFT', brief:'NFT', category:'NFTs', tags:['NFT'], kpiDisplay:'+15%' },
    { id:'tr', name:'TronRacing', brief:'GameFi', category:'GameFi', tags:['GameFi'], kpiDisplay:'+24%' },
];

export const dappsHandlers = [
    http.get('/api/dapps/overview', () => HttpResponse.json({
        apps: 2847, users24h: 1200000, vol24h: '$45.7M', volTotal: '$12.8B'
    })),
    http.get('/api/dapps/rankings', () => HttpResponse.json({
        dau: dapps.slice(0,3),
        vol: dapps.slice(0,3),
        growth: dapps.slice(0,3),
    })),
    http.get('/api/dapps/featured', () => HttpResponse.json(dapps)),
    http.get('/api/dapps/search', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page')||'1');
        const pageSize = Number(url.searchParams.get('pageSize')||'12');
        const total = 1247;
        const list = Array.from({length:pageSize}).map((_,i)=>({
            id:`p${page}-${i}`, name:['PancakeSwap','Compound','CryptoKitties','Decentraland'][i%4],
            brief: ['DEX','Lending','Game','Metaverse'][i%4],
            category: ['DeFi','DeFi','NFTs','GameFi'][i%4],
            tvlDisplay:'$3.6B', volume24hDisplay:'$210M', users24hDisplay:'150k',
            tags: ['DeFi','NFTs','GameFi'].slice(0, ((i%3)+1))
        }));
        return HttpResponse.json({ list, page, pageSize, total });
    }),
    http.get('/api/dapps/favorites', () => HttpResponse.json(dapps.slice(0,4))),
    http.get('/api/dapps/portfolio', () => HttpResponse.json({
        value:'$24,580.32', active:8,
        dist:[
            {name:'Uniswap', value:'$8,240.12'},
            {name:'Aave', value:'$6,890.45'},
            {name:'Compound', value:'$5,120.88'},
            {name:'Others', value:'$4,328.87'},
        ],
    })),
];
