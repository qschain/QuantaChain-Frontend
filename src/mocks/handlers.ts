// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms))

// ---- atlas ----
type AtlasPoint = { id:string; region:string; name:string; lat:number; lng:number }
const ATLAS_POINTS: AtlasPoint[] = [
    { id: 'cn', region: 'cn', name: '中国',         lat: 35.8617, lng: 104.1954 },
    { id: 'br', region: 'br', name: '巴西',         lat: -14.2350, lng: -51.9253 },
    { id: 'my', region: 'my', name: '马来西亚',     lat: 4.2105,  lng: 101.9758 },
    { id: 'pk', region: 'pk', name: '巴基斯坦',     lat: 30.3753, lng: 69.3451 },
    { id: 'mm', region: 'mm', name: '缅甸',         lat: 21.9162, lng: 95.9560 },
    { id: 'hk', region: 'hk', name: '香港',         lat: 22.3193, lng: 114.1694 },
    { id: 'ca', region: 'ca', name: '加拿大',       lat: 56.1304, lng: -106.3468 },
    { id: 'jp', region: 'jp', name: '日本',         lat: 36.2048, lng: 138.2529 },
]
const NAME_MAP: Record<string,string> = {
    cn:'中国', br:'巴西', my:'马来西亚', pk:'巴基斯坦', mm:'缅甸', hk:'香港', ca:'加拿大', jp:'日本'
}

// @ts-ignore
export const handlers = [
    // 登录
    http.post('/api/login', async ({ request }) => {
        await sleep(400)
        const { identifier, password } = await request.json() as { identifier:string; password:string }
        if (!identifier || !password) {
            return HttpResponse.text('账户或密码错误', { status: 401 })
        }
        return HttpResponse.json({ id: 'u_123', name: 'Username_123', email: 'user@email.com' })
    }),

    // 资产概览
    http.get('/api/asset/overview', async () => {
        await sleep(200)
        return HttpResponse.json({
            id: 'eth', symbol: 'ETH', name: 'Ethereum',
            network: 'Ethereum', address: '0x742d...5a57',
            balance: 24.5678, fiatValue: 45123.45, change24h: 5.12
        })
    }),

    // 交易历史
    http.get('/api/tx/history', async () => {
        await sleep(150)
        return HttpResponse.json([
            { hash:'0x1a2b...c34d', type:'兑换', amount:-1.5, symbol:'ETH', ts:'2025-08-31 14:30', status:'成功' },
            { hash:'0x4e5f...a6b7', type:'接收', amount:+0.8, symbol:'ETH', ts:'2025-08-30 09:12', status:'成功' },
            { hash:'0xc89d...e0f1', type:'发送', amount:-5.0, symbol:'ETH', ts:'2025-08-29 21:05', status:'成功' },
            { hash:'0x23gh...14j5', type:'质押', amount:-10.0, symbol:'ETH', ts:'2025-08-28 11:45', status:'处理中' },
            { hash:'0x5k61...m7n8', type:'接收', amount:+2.1, symbol:'ETH', ts:'2025-08-27 18:00', status:'成功' }
        ])
    }),

    // 充值地址
    http.get('/api/deposit/address', async ({ request }) => {
        await sleep(120)
        const url = new URL(request.url)
        const assetId = url.searchParams.get('assetId')
        const networkId = url.searchParams.get('networkId')
        if (!assetId || !networkId) {
            return HttpResponse.text('缺少参数', { status: 400 })
        }
        return HttpResponse.json({ address:'0x1234...kLmN', tag: undefined, qrcodeUrl: '' })
    }),

    // 提现报价
    http.get('/api/withdraw/quote', async ({ request }) => {
        await sleep(160)
        return HttpResponse.json({ fee: 0.002, fiat: 5.8, minAmount: 0.001, estimatedTime: '≈ 3-15 分钟' })
    }),

    // 仪表盘
    http.get('/api/dashboard', async () => {
        await sleep(200)
        const activities = [
            { type: '接收', asset: 'BTC',     amount: '+0.025 BTC', time: '2小时前', delta: '+0.025 BTC' },
            { type: '发送', asset: 'ETH',     amount: '-1.5 ETH',   time: '5小时前',  delta: '-1.5 ETH'   },
            { type: '兑换', asset: 'BTC⇄ETH', amount: '0.1 BTC',    time: '1天前' }
        ]
        return HttpResponse.json({
            overview: { totalUSD: 127456.89, diffUSD: 2341.23, diffPct: 1.87, series: [8,12,7,13,9,10,15,9,11,8,14] },
            mainAssets: [
                { icon:'CNYC', name:'CNYC', symbol:'CNYC', amount:15.67, usd:37821.33, changePct:-0.8 },
                { icon:'HKDC', name:'HKDC', symbol:'HKDC', amount:15.67, usd:36812.33,  changePct:0.8 },
                { icon:'BTC', name:'Bitcoin',  symbol:'BTC', amount:2.45, usd:8934.56, changePct: 2.3 },
                { icon:'ETH', name:'Ethereum', symbol:'ETH', amount:15.67, usd:3222.33,  changePct:-0.8 }
            ],
            market: [
                { pair:'CNYC/USD', price: 0.15, changePct:0.1 },
                { pair:'HKDC/USD', price: 1.03, changePct:-0.2 },
                { pair:'BTC/USD', price:36420.50, changePct: 2.3 },
                { pair:'ETH/USD', price: 2441.20, changePct:-1.2 }
            ],
            distribution: [
                { label:'CNYC', value:41, color:'#e8240a' },
                { label:'HKDC', value:39, color:'#e87c34' },
                { label:'Bitcoin (BTC)', value:7, color:'#41bdf7' },
                { label:'Ethereum (ETH)', value:3, color:'#19c37d' }
            ],
            activities
        })
    }),

    // 兑换报价
    http.get('/api/swap/quote', async ({ request }) => {
        await sleep(150)
        const url = new URL(request.url)
        const from = url.searchParams.get('from') || 'BTC'
        const to = url.searchParams.get('to') || 'ETH'
        const amount = Number(url.searchParams.get('amount') || '0')
        const baseRate = from==='BTC' && to==='ETH' ? 18.042 : 1/18.042
        const rate = baseRate * (1 + (Math.random() - .5) * 0.006)
        const outAmount = +(amount * rate).toFixed(6)
        const feeUSD = 11.75
        return HttpResponse.json({ rate, outAmount, feeUSD, balance: from==='BTC' ? 1.2345 : 29.48875 })
    }),

    // 兑换历史
    http.get('/api/swap/history', async () => {
        await sleep(120)
        return HttpResponse.json([
            { pair: 'BTC → ETH', amount: '0.1 BTC → 1.803 ETH', status: '成功', time:'2025-08-31 14:25', hash:'0x123...abc' },
            { pair: 'SOL → USDC', amount: '10.5 SOL → 1550.2 USDC', status: '失败', time:'2025-08-30 09:11', hash:'0x456...def' },
            { pair: 'ETH → BTC', amount: '2.0 ETH → 0.11 BTC', status: '成功', time:'2025-08-29 21:55', hash:'0x789...gh1' }
        ])
    }),

    // 跨链网络
    http.get('/api/bridge/networks', async () => {
        await sleep(120)
        return HttpResponse.json([
            { id:'eth',  name:'Ethereum' },
            { id:'bsc',  name:'BNB Chain' },
            { id:'linea',name:'Linea' },
            { id:'polygon', name:'Polygon' },
            { id:'arb', name:'Arbitrum' },
            { id:'op',  name:'Optimism' }
        ])
    }),

    // 跨链报价
    http.get('/api/bridge/quote', async ({ request }) => {
        const url = new URL(request.url)
        const amount = Number(url.searchParams.get('amount') || '0')
        const gas = 3.2 + Math.random()*1.6
        const feePct = 0.875
        const total = amount + gas
        return HttpResponse.json({ send: amount, gasUSD: +gas.toFixed(2), bridgeFeePct: feePct, totalUSD: +total.toFixed(2) })
    }),

    // atlas: 点位列表
    http.get('/api/atlas/points', async () => {
        await sleep(100)
        return HttpResponse.json(ATLAS_POINTS)
    }),

    // atlas: 区域指标
    http.get('/api/atlas/region/:region', async ({ params }) => {
        await sleep(120)
        const region = String(params.region || '')
        const base = region.charCodeAt(0) % 7
        return HttpResponse.json({
            region,
            name: NAME_MAP[region] ?? region,
            accounts: 329_370_817 + base*100_000,
            txCount: 11_335_462_912 + base*1_000_000,
            transferVolumeUSD: 20_932_661_873_410 + base*10_000_000,
            tvlUSD: 27_561_697_642 + base*1_000_000
        })
    })
]