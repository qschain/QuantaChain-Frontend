import { http, HttpResponse } from 'msw';

/** ============ 工具 ============ */
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, digits = 6) =>
    +(Math.random() * (max - min) + min).toFixed(digits);
const nowISO = () => new Date().toISOString();
const padHash = (seed = '') =>
    (Math.random().toString(16).slice(2) + seed).padEnd(64, 'a').slice(0, 64);
const addrFrom = 'TS1LA...ccA';
const addrTo = 'TG8MDK...4JQ';

/** ============ 数据类型（与前端保持一致） ============ */
type BlockLite = {
    height: number;
    hash: string;
    time: string;
    txCount: number;
    miner: string;
};
type TxLite = {
    hash: string;
    time: string;
    from: string;
    to?: string;
    value: string; // 小数形式字符串
    fee: string;
    status: 'success' | 'fail';
    blockHeight: number;
    method: 'Transfer' | 'Contract';
};

/** ============ 滚动数据缓冲区 ============ */
let HEIGHT = 76_017_612;        // 初始区块高度
let seedTx = 1_000_000;

const blocksBuf: BlockLite[] = [];
const txsBuf: TxLite[] = [];
const tokens: Array<{
    rank: number; symbol: string; name: string;
    price: number; change24h: number; marketcap: number; volume24h: number;
}> = Array.from({ length: 50 }).map((_, i) => ({
    rank: i + 1,
    symbol: i ? (i % 2 ? 'USDT' : 'BTT') : 'TRX',
    name: i ? (i % 2 ? 'Tether USD' : 'BitTorrent') : 'TRON',
    price: i ? randFloat(0.9, 1.4, 4) : 0.115,
    change24h: randFloat(-5, 5, 2),
    marketcap: randInt(1_000_000_000, 6_000_000_000),
    volume24h: randInt(100_000_000, 2_000_000_000),
}));

/** 预热一批假数据（越靠后越旧） */
(function warmup() {
    const now = Date.now();
    for (let i = 0; i < 30; i++) {
        const h = ++HEIGHT;
        blocksBuf.unshift({
            height: h,
            hash: padHash('b'),
            time: new Date(now - (30 - i) * 8000).toISOString(),
            txCount: randInt(20, 220),
            miner: 'TY9m6s4...D51gLV',
        });
        txsBuf.unshift({
            hash: padHash('t') + (++seedTx).toString(16),
            time: new Date(now - (30 - i) * 6000).toISOString(),
            from: addrFrom,
            to: Math.random() > 0.15 ? addrTo : undefined,
            value: randFloat(0.001, 2000).toFixed(6),
            fee: randFloat(0.0001, 2).toFixed(6),
            status: 'success',
            blockHeight: h - randInt(0, 2),
            method: Math.random() > 0.5 ? 'Transfer' : 'Contract',
        });
    }
})();

/** 每次请求时在顶部追加一条最新数据，模拟“链还在前进” */
function produceOne() {
    const h = ++HEIGHT;
    const t = nowISO();

    blocksBuf.unshift({
        height: h,
        hash: padHash('nb'),
        time: t,
        txCount: randInt(30, 260),
        miner: 'TY9m6s4...D51gLV',
    });

    txsBuf.unshift({
        hash: padHash('nt') + (++seedTx).toString(16),
        time: t,
        from: addrFrom,
        to: Math.random() > 0.1 ? addrTo : undefined,
        value: randFloat(0.01, 8000).toFixed(6),
        fee: randFloat(0.0001, 2).toFixed(6),
        status: 'success',
        blockHeight: h,
        method: Math.random() > 0.5 ? 'Transfer' : 'Contract',
    });

    // 控制缓冲区大小，避免无限增长
    if (blocksBuf.length > 300) blocksBuf.length = 300;
    if (txsBuf.length > 800) txsBuf.length = 800;
}

/** ============ Handlers ============ */
export const explorerHandlers = [
    /** 概览 */
    http.get('/api/explorer/overview', () => {
        // 每次拉概览也“推进一下链”，让首页指标更灵动
        produceOne();
        return HttpResponse.json({
            tps: "1205",
            height: blocksBuf[0]?.height ?? HEIGHT,
            validators: "27",
            priceUSD: 0.115,
        });
    }),

    /** 最新区块（保留你的路径与参数） */
    http.get('/api/explorer/blocks', ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit') || '10');
        // 拉列表时也推进一下，配合前端每 5s 轮询，行首会出现新数据
        produceOne();
        return HttpResponse.json({ items: blocksBuf.slice(0, Math.max(1, limit)) });
    }),

    /** 区块详情 */
    http.get('/api/explorer/blocks/:height', ({ params }) => {
        const h = Number(params.height);
        const head = blocksBuf.find((b) => b.height === h) || blocksBuf[0];
        // 组装一个“交易列表”，这里直接截取最新若干 tx
        const transactions = txsBuf
            .filter((tx) => tx.blockHeight >= head.height - 1 && tx.blockHeight <= head.height + 1)
            .slice(0, 50);

        return HttpResponse.json({
            ...head,
            size: 98451,
            parentHash: padHash('pc'),
            gasUsed: '8000000',
            transactions,
        });
    }),

    /** 最新交易（保留你的路径与参数） */
    http.get('/api/explorer/txs', ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit') || '10');
        produceOne();
        return HttpResponse.json({ items: txsBuf.slice(0, Math.max(1, limit)) });
    }),

    /** 交易详情 */
    http.get('/api/explorer/tx/:hash', ({ params }) => {
        const one =
            txsBuf.find((t) => t.hash === params.hash) ||
            txsBuf[0] || {
                hash: String(params.hash),
                time: nowISO(),
                from: addrFrom,
                to: addrTo,
                value: '1.000000',
                fee: '0.010000',
                status: 'success' as const,
                blockHeight: HEIGHT,
                method: 'Transfer' as const,
            };

        return HttpResponse.json({
            status: one.status,
            hash: one.hash,
            time: one.time,
            blockHeight: one.blockHeight ?? HEIGHT,
            from: one.from,
            to: one.to,
            type: one.method || 'Transfer',
            amount: one.value,
            fee: one.fee,
            inputHex: '0x' + 'a'.repeat(64),
        });
    }),

    /** 代币分页 */
    http.get('/api/explorer/tokens', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') || '1');
        const size = Number(url.searchParams.get('size') || '10');
        const start = (page - 1) * size;
        return HttpResponse.json({
            items: tokens.slice(start, start + size),
            total: tokens.length,
        });
    }),

    /** 统计页数据（轻微抖动，让图表“活着”） */
    http.get('/api/explorer/stats', () => {
        const mkSeries = (n: number, gen: (i: number) => any) =>
            Array.from({ length: n }).map((_, i) => gen(i));

        const accounts = mkSeries(24, (i) => ({
            t: `T-${24 - i}h`,
            active: 1000 + randInt(0, 500),
            total: 2_600_000 + i * 3_000 + randInt(-800, 800),
        }));

        const txs = mkSeries(24, (i) => ({
            t: `T-${24 - i}h`,
            count: 200_000 + i * 1200 + randInt(-1500, 1500),
            avgFee: randFloat(0.08, 1.3, 2).toFixed(2),
        }));

        const tokenShare = [
            { name: 'TRX', value: 40 },
            { name: 'USDT', value: 35 },
            { name: 'BTT', value: 15 },
            { name: 'SUN', value: 10 },
        ];

        const topPairs = [
            { pair: 'TRX/USDT', volume: 1_285_000_000 + randInt(-20_000_000, 20_000_000) },
            { pair: 'TRX/BTT', volume: 450_000_000 + randInt(-10_000_000, 10_000_000) },
            { pair: 'TRX/SUN', volume: 120_000_000 + randInt(-8_000_000, 8_000_000) },
        ];

        const now = Date.now();
        const voteWeight = mkSeries(8, (i) => ({
            sr: `SR-${i + 1}`,
            value: randInt(6, 18),
        }));

        const staking = mkSeries(30, (i) => ({
            t: new Date(now - (30 - i) * 86400000).toISOString().slice(5, 10),
            rate: +(3 + Math.sin(i / 5) * 0.7 + Math.random() * 0.15).toFixed(2),
        }));

        return HttpResponse.json({ accounts, txs, tokenShare, topPairs, voteWeight, staking });
    }),

    /** Try API（保持原样，便于 API 文档页测试） */
    http.post('/api/explorer/try', async ({ request }) => {
        const text = await request.text();
        return HttpResponse.json({ ok: true, echo: text ? JSON.parse(text) : {} });
    }),
];
