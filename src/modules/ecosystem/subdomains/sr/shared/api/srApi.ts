import { http } from '../../../../../../shared/api/http'
import {
    ApiResp, PaginationParams, SRItem, AccountInfo, VotePayload, TxDetailResp, UnfrozenItem, WitnessListResult
} from '../../state/types'

// 公共：从后端 data 里抽取交易哈希（兼容多种键名）
function pickTxHash(d: any): string {
    return d?.txnHash || d?.trxHash || d?.hash || ''
}

/* =========================
 * Witness 列表
 * ========================= */
export async function getWitnessList(params: PaginationParams, real = true) {
    const res = await http.post<ApiResp<WitnessListResult>>('/api/witness/list', params, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'getWitnessList failed')
    const d = res.data as WitnessListResult
    return {
        list: d.SrData ?? [],
        sumVotes: Number(d.sumVotes ?? 0),
        freezeRate: Number(d.freezeRate ?? 0),
        totalPages: Number(d.totalPages ?? 1),
        totalCount: Number(d.totalCount),
        nextTime:String(d.nextTime ?? '')
    }
}

/* =========================
 * 账户信息
 * ========================= */
export async function getAccount(userName: string, real?: boolean) {
    // @ts-ignore
    const res = await http.post<ApiResp<any>>('/api/account/get', { userName }, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'getAccount failed')
    const d = res.data || {}
    const trxRow = Array.isArray(d.dataList)
        ? d.dataList.find((x: any) => (x?.tokenAbbr || '').toLowerCase() === 'trx')
        : null

    const account: AccountInfo = {
        votes: Number(d.votes ?? 0),                               // 总投票权（旧口径）
        voteTotal: Number(d.voteTotal ?? d.voteTatal ?? 0),        // 已投票
        totalFrozenTRX: Number(d.totalFrozenV2 ?? 0),              // 旧字段（不用于可用票）
        accountBalanceTRX: Number(trxRow?.accountBalance ?? 0),
        rewardNumSUN: Number(d.rewardNum ?? 0),
        freeNetLimit: Number(d.freeNetLimit ?? 0),
        freeNetRemaining: Number(d.freeNetRemaining ?? 0),
    }
    return account
}

/* =========================
 * 已解冻队列（V2）
 * ========================= */
export async function getUnfrozenV2(ownerAddress: string, real = true) {
    const res = await http.post<ApiResp<UnfrozenItem[]>>(
        '/api/unfrozenV2',
        { ownerAddress },
        { useRealApi: real }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'unfrozenV2 error')
    const list = Array.isArray(res.data) ? res.data : []
    // 兜底字段与类型
    return list.map(x => ({
        amount: Number(x?.amount ?? 0),
        unfreezeTime: String(x?.unfreezeTime ?? ''),
        type: String(x?.type ?? '')
    }))
}

/* =========================
 * 已冻结（V2）- 按类型返回 amount（SUN）
 * ========================= */
export async function getFrozenV2(ownerAddress: string, real = true) {
    const res = await http.post<ApiResp<Array<{ amount: number; type: string }>>>(
        '/api/frozenV2',
        { ownerAddress },
        { useRealApi: real }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'frozenV2 error')
    return Array.isArray(res.data)
        ? res.data.map(x => ({ amount: Number(x?.amount ?? 0), type: String(x?.type ?? '') }))
        : []
}
/* =========================
 * 统计折线图接口
 * ========================= */
function parseTs(input?: string): number {
    if (!input) return NaN;
    // 兼容 "2025-10-27T11:13:05" / "2025-10-27 11:13:05" / 带毫秒/无T等
    const s = String(input).trim()
        .replace('T', ' ')        // 去掉 T
        .replace(/-/g, '/');      // Safari 需斜杠
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : NaN;
}
export type WitnessStatPoint = { ts: number; apy: number; freezeRate: number }
export type WitnessStatistics = {
    points: WitnessStatPoint[]
    minApy: number
    maxApy: number
    minFreezeRate: number
    maxFreezeRate: number
}

export async function getWitnessStatistics(days: number, real = true): Promise<WitnessStatistics> {
    const res = await http.post<{
        code: string
        message?: string
        data?: {
            minApy?: number
            maxApy?: number
            minFreezeRate?: number
            maxFreezeRate?: number
            dataList?: Array<{ apy?: number; freezeRate?: number; date?: string }>
        }
    }>('/api/WitnessStatistics', { days }, { useRealApi: real })

    if (res?.code !== '200') throw new Error(res?.message || 'getWitnessStatistics failed')

    const d = res?.data || {}
    const raw = Array.isArray(d.dataList) ? d.dataList : [];

    const points = raw.map(p => {
        const ts = parseTs(p.date);
        return Number.isFinite(ts) ? { ts, apy: Number(p.apy ?? 0), freezeRate: Number(p.freezeRate ?? 0) } : null;
    }).filter(Boolean) as WitnessStatPoint[];
    // 按时间升序
    points.sort((a, b) => a.ts - b.ts)

    return {
        points,
        minApy: Number(d.minApy ?? 0),
        maxApy: Number(d.maxApy ?? 0),
        minFreezeRate: Number(d.minFreezeRate ?? 0),
        maxFreezeRate: Number(d.maxFreezeRate ?? 0),
    }
}

/** 工具：把 SUN → TRX，并聚合求和（返回小数 TRX） */
export function sumFrozenTRX(list: Array<{ amount: number; type: string }>) {
    const sumSUN = list.reduce((acc, it) => acc + (Number(it.amount) || 0), 0)
    return sumSUN / 1_000_000
}

/** 工具：按类型聚合（TRX，小数） */
export function groupFrozenTRXByType(list: Array<{ amount: number; type: string }>) {
    const map = new Map<string, number>()
    for (const it of list) {
        const cur = map.get(it.type) || 0
        map.set(it.type, cur + (Number(it.amount) || 0) / 1_000_000)
    }
    return map // type -> TRX
}

/* =========================
 * 冻结
 * ========================= */
export async function postFreeze(
    ownerAddress: string,
    amountTRX: number,
    typeCode: '0' | '1',
    real = true
) {
    const amountSUN = Math.round(Number(amountTRX || 0) * 1_000_000)
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/freeze',
        { ownerAddress, freeBalance: String(amountSUN), typecode: typeCode },
        { useRealApi: real }
    )
    if (res?.code !== '200') { // @ts-ignore
        throw new Error(res?.data?.message || 'freeze failed')
    }
    return pickTxHash(res?.data)
}

/* =========================
 * 解冻（按你后端的路径大小写 /api/unFreeze）
 * amountSUN：单位 SUN；typeCode：'0' | '1'（后续后端已接收）
 * ========================= */
export async function postUnfreeze(
    ownerAddress: string,
    amountSUN: number,
    typeCode: '0' | '1',
    real = true
) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/unFreeze',
        { ownerAddress, unfreeBalance: String(amountSUN), unfreezeType: typeCode },
        { useRealApi: real }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'unfreeze failed')
    return pickTxHash(res?.data)
}

/* =========================
 * 批量投票
 * ========================= */
export async function postVoteSR(payload: VotePayload, real = true) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/vote/SR',
        payload,
        { useRealApi: real }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'vote failed')
    return pickTxHash(res.data)
}

/* =========================
 * 交易详情
 * ========================= */
export async function fetchTxDetail(trxHash: string, real = true) {
    const res = await http.post<ApiResp<TxDetailResp>>('/api/trxInformation', { trxHash }, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'txInformation failed')
    return res.data!
}

/* =========================
 * 领取奖励（withdraw）
 * POST http://192.168.99.45:8080/api/withdraw
 * body: { ownerAddress }
 * 返回 txnHash / trxHash / hash 任意其一
 * ========================= */
export async function postWithdraw(ownerAddress: string) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/withdraw',
        { ownerAddress },
        { useRealApi: true }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'withdraw failed')
    return pickTxHash(res?.data)
}

/* =========================
 * 收益预测（predict）
 * POST http://192.168.99.45:8080/api/predict
 * body: { count: string, rate: string, days: string }
 * resp: { code, message, data: { returns: number } }
 * ========================= */
export async function postPredict(params: { count: string; rate: string; days: string }) {
    const res = await http.post<ApiResp<{ returns: number }>>(
        '/api/predict',
        params,
        { useRealApi: true }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'predict error')
    const v = Number(res?.data?.returns ?? 0)
    return Number.isFinite(v) ? v : 0
}

/* =========================
 * 奖励记录分页（reward）
 * POST http://127.0.0.1:8080/api/reward
 * body: { address, pageNum, pageSize }
 * resp: { code, message, data:{ total, pages, currentPage, list:[{ id, tronAddress, balance, time }] } }
 * ========================= */
export type RewardItem = {
    id: number | string
    tronAddress: string
    balance: number   // TRX
    time: string      // ISO 时间字符串
}
export type RewardListResp = {
    total: number
    pages: number
    currentPage: number
    totalBalance: number
    list: RewardItem[]
}

export async function fetchRewardList(args: {
    address: string
    pageNum: number
    pageSize: number
}): Promise<RewardListResp> {
    const body = {
        address: args.address,
        pageNum: String(args.pageNum),
        pageSize: String(args.pageSize),
    }
    const res = await http.post<ApiResp<any>>('/api/reward', body, { useRealApi: true })
    if (res?.code !== '200') throw new Error(res?.message || 'reward list error')

    const data = res?.data ?? {}
    const rawList = Array.isArray(data.list) ? data.list : []

    const list: RewardItem[] = rawList.map((r: any) => ({
        id: r?.id ?? r?.Id ?? '',
        tronAddress: String(r?.tronAddress ?? ''),
        balance: Number(r?.balance ?? 0)/1000000, // 已是 TRX
        time: String(r?.time ?? r?.createdAt ?? ''),
    }))

    return {
        total: Number(data.total ?? list.length),
        pages: Number(data.pages ?? 1),
        currentPage: Number(data.currentPage ?? args.pageNum),
        totalBalance: Number(data.totalBalance ?? 0)/1000000,
        list,
    }
}
/* =========================
 * 提案列表：POST http://192.168.99.45:8080/api/getProposal
 * body: { pageNum:number, pageSize:number }
 * resp: {
 *   code, message, data: {
 *     data: Array<{ number, content, k, value, proposer, status, percent, time }>,
 *     totalPages:number, totalCount:number
 *   }
 * }
 * ========================= */
export type ProposalItem = {
    number: string
    content: string
    k: string
    value: string
    proposer: string
    status: string         // e.g. APPROVED / REJECTED / RUNNING (视后端)
    percent: string        // 例如 "25/27"
    time: string           // "start->end"
}

export type ProposalPage = {
    list: ProposalItem[]
    totalPages: number
    totalCount: number
    pageNum: number
    pageSize: number
}

export async function getProposals(params: { pageNum: number; pageSize: number }): Promise<ProposalPage> {
    const body = { pageNum: params.pageNum, pageSize: params.pageSize }
    const res = await http.post<any>('http://192.168.99.45:8080/api/getProposal', body, { useRealApi: true })
    if (res?.code !== '200') throw new Error(res?.message || 'getProposal failed')

    const data = res?.data ?? {}
    const rawList = Array.isArray(data.data) ? data.data : []
    const list: ProposalItem[] = rawList.map((x: any) => ({
        number: String(x?.number ?? ''),
        content: String(x?.content ?? ''),
        k: String(x?.k ?? ''),
        value: String(x?.value ?? ''),
        proposer: String(x?.proposer ?? ''),
        status: String(x?.status ?? ''),
        percent: String(x?.percent ?? ''),
        time: String(x?.time ?? ''),
    }))

    return {
        list,
        totalPages: Number(data.totalPages ?? 1),
        totalCount: Number(data.totalCount ?? list.length),
        pageNum: params.pageNum,
        pageSize: params.pageSize,
    }
}

/* =========================
 * 导出集合
 * ========================= */
export const srApi = {
    getWitnessList,
    getAccount,
    getFrozenV2,
    sumFrozenTRX,
    groupFrozenTRXByType,
    postFreeze,
    postUnfreeze,
    postVoteSR,
    fetchTxDetail,
    getUnfrozenV2,
    postWithdraw,
    postPredict,
    fetchRewardList,
    getProposals,
    getWitnessStatistics,
}

export default srApi
