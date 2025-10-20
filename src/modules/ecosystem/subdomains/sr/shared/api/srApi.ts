import { http } from '../../../../../../shared/api/http'
import type {
    ApiResp, PaginationParams, SRItem, AccountInfo, VotePayload, TxDetailResp,UnfrozenItem
} from '../../state/types'

// 公共：从后端 data 里抽取交易哈希
function pickTxHash(d: any): string {
    return d?.txnHash || d?.trxHash || d?.hash || ''
}

// Witness 列表
export async function getWitnessList(params: PaginationParams, real = true) {
    const res = await http.post<ApiResp<SRItem[]>>('/api/witness/list', params, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'getWitnessList failed')
    return (res.data || []) as SRItem[]
}

// 账户信息
export async function getAccount(userName: string, real = true) {
    const res = await http.post<ApiResp<any>>('/api/account/get', { userName }, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'getAccount failed')
    const d = res.data || {}
    const trxRow = Array.isArray(d.dataList)
        ? d.dataList.find((x: any) => (x?.tokenAbbr || '').toLowerCase() === 'trx')
        : null

    const account: AccountInfo = {
        votes: Number(d.votes ?? 0),                               // 保留：总投票权（旧口径）
        voteTotal: Number(d.voteTotal ?? d.voteTatal ?? 0),        // 已投票
        totalFrozenTRX: Number(d.totalFrozenV2 ?? 0),              // 旧字段（不用于可用票）
        accountBalanceTRX: Number(trxRow?.accountBalance ?? 0),
        rewardNumSUN: Number(d.rewardNum ?? 0),
        freeNetLimit: Number(d.freeNetLimit ?? 0),
        freeNetRemaining: Number(d.freeNetRemaining ?? 0),
    }
    return account
}
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
// 已冻结(新版)：按类型返回 amount（SUN）
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

// 冻结
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
    // 兼容不同字段名
    return (res?.data?.txnHash || res?.data?.trxHash || res?.data?.hash || '')
}

// 解冻（amountSUN：单位 SUN）
export async function postUnfreeze(
    ownerAddress: string,
    amountSUN: number,
    typeCode: '0' | '1',
    real = true
) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/unfreeze',
        { ownerAddress, unfreeBalance: String(amountSUN), unfreezeType: typeCode },
        { useRealApi: real }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'unfreeze failed')
    return pickTxHash(res?.data)
}

// 批量投票
export async function postVoteSR(payload: VotePayload, real = true) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/vote/SR',
        payload,
        { useRealApi: real }
    )
    if (res?.code !== '200') throw new Error(res?.message || 'vote failed')
    return pickTxHash(res.data)
}

// 交易详情
export async function fetchTxDetail(trxHash: string, real = true) {
    const res = await http.post<ApiResp<TxDetailResp>>('/api/trxInformation', { trxHash }, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'txInformation failed')
    return res.data!
}

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
    getUnfrozenV2
}
export default srApi
