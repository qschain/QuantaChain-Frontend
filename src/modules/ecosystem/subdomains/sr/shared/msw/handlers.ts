import { http, HttpResponse } from 'msw';
import { API_SR_BASE } from '../../constants';

export const srHandlers = [
    http.get(`${API_SR_BASE}/dashboard`, () => HttpResponse.json({ /* your mock */ })),
    http.get(`${API_SR_BASE}/list`, () => HttpResponse.json({
        list: [
            { id:'sr1', name:'TronLink', address:'TLy..K7ZH', apy:8.5, voters:2456, votes:15.2e6, onlineRate:99.8 },
            { id:'sr2', name:'Binance Staking', address:'T9o..5KcBL', apy:7.8, voters:3128, votes:18.7e6, onlineRate:99.9 },
            { id:'sr3', name:'TRON Foundation', address:'TP..Q7ZH', apy:9.2, voters:1892, votes:12.3e6, onlineRate:98.5 }
        ],
        page:1, pageSize:10, total:3
    })),
    http.post(`${API_SR_BASE}/vote`, () => HttpResponse.json({ ok:true })),
    http.post(`${API_SR_BASE}/vote/batch`, () => HttpResponse.json({ ok:true })),

    http.get(`${API_SR_BASE}/rewards/summary`, () => HttpResponse.json({ total: 1234567, lastTime:'2025-09-03 14:30', pending: 8888 })),
    http.get(`${API_SR_BASE}/rewards/history`, () => HttpResponse.json({
        list: [
            { time:'2025-09-03 14:30', srName:'TronLink', amount:543.21, status:'claimed' },
            { time:'2025-09-02 11:15', srName:'Binance Staking', amount:602.78, status:'claimed' },
            { time:'2025-09-01 08:00', srName:'Poloniex', amount:150.00, status:'pending' }
        ],
        page:1, pageSize:10, total:156
    })),
    http.post(`${API_SR_BASE}/rewards/claim`, () => HttpResponse.json({ ok:true })),

    http.get(`${API_SR_BASE}/proposals`, () => HttpResponse.json({
        list: Array.from({length:6}).map((_,i)=>({
            id: `2025090${i+1}`,
            title: `提案占位标题 ${i+1}`,
            status: i%3===0?'进行中': (i%3===1?'已通过':'已拒绝'),
            supportPct: 50 + i*5, againstPct: 50 - i*5
        })),
        page:1, pageSize:6, total:72
    })),

    http.get(`${API_SR_BASE}/analytics/overview`, () => HttpResponse.json({ totalVotes: 2847392156, stakeRate: 0.678, avgApy: 0.0412 })),
    http.get(`${API_SR_BASE}/analytics/distribution`, () => HttpResponse.json({
        labels:['TRON Foundation','Binance Staking','Huobi Staking','其他SR'],
        series:[15.2,12.8,8.9,63.1]
    })),
    http.get(`${API_SR_BASE}/analytics/trends`, () => HttpResponse.json({
        points: Array.from({length:7}).map((_,i)=>({ ts: Date.now()-i*86400000, stakeRate: 0.66 + i*0.002, apy: 0.039 + i*0.0002 })).reverse()
    })),

    http.get(`${API_SR_BASE}/learn`, () => HttpResponse.json({
        tabs:['beginner','advanced','glossary','cases','bot'],
        items:[
            { key:'basics', title:'SR基础概念',  desc:'了解SR角色与重要性' },
            { key:'vote',   title:'如何参与投票', desc:'获得投票权并完成投票流程' },
            { key:'rewards',title:'奖励领取指南', desc:'计算方式与发放周期' }
        ]
    }))
];
