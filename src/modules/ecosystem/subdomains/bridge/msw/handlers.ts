import { http as mswHttp, HttpResponse } from 'msw';

export const bridgeHandlers = [
    mswHttp.get('/bridge/portfolio', () => {
        return HttpResponse.json({
            totalUsd: '$123,456.78',
            totalInTrx: '≈ 1,543,210.99 TRX',
            chains: [
                { chain: 'TRON',           symbol: 'USDT', amount: '45,123.45', usd: '$45,123.45', share: '36.5%', icon: 'TR' },
                { chain: 'Ethereum',       symbol: 'ETH',  amount: '10.5',     usd: '$35,700.00', share: '28.9%', icon: 'ETH' },
                { chain: 'BSC',            symbol: 'BUSD', amount: '25,800.12',usd: '$25,800.12', share: '20.9%', icon: 'BSC' },
                { chain: 'BitTorrent Chain',symbol:'TRX',  amount: '余额已隐藏', usd: '$16,833.21', share: '13.7%', icon: 'BT' }
            ],
        });
    }),

    mswHttp.get('/bridge/recent', () => {
        return HttpResponse.json({
            items: [
                { id:'1', asset:'1,000 USDT',  path:'TRON → Ethereum', time:'2小时前', status:'success',    txHash:'0x123...abc' },
                { id:'2', asset:'2.5 ETH',     path:'Ethereum → BSC',  time:'5分钟前', status:'processing', txHash:'0x456...def' },
                { id:'3', asset:'50,000 TRX',  path:'TRON → BTTC',     time:'1天前',   status:'failed',     txHash:'0x789...ghi' }
            ],
        });
    }),
];
