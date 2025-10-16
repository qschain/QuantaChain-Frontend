import { http } from '../../../../../../shared/api/http'
import type {
    ApiResp, PaginationParams, SRItem, AccountInfo, VotePayload, TxDetailResp,
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
    const trxRow = Array.isArray(d.dataList) ? d.dataList.find((x: any) => (x?.tokenAbbr || '').toLowerCase() === 'trx') : null
    const account: AccountInfo = {
        votes: Number(d.votes ?? 0),                       // 总投票权
        voteTotal: Number(d.voteTotal ?? d.voteTatal ?? 0),// 已投票
        totalFrozenTRX: Number(d.totalFrozenV2 ?? 0),
        accountBalanceTRX: Number(trxRow?.accountBalance ?? 0),
        rewardNumSUN: Number(d.rewardNum ?? 0),
        freeNetLimit: Number(d.freeNetLimit ?? 0),
        freeNetRemaining: Number(d.freeNetRemaining ?? 0),
    }
    return account
}

// 计算可用票 = votes - voteTotal
export function computeAvailableVotes(acc?: AccountInfo | null) {
    if (!acc) return 0
    const total = Number(acc.votes ?? 0)
    const used  = Number(acc.voteTotal ?? 0)
    return Math.max(0, total - used)
}

// 冻结
export async function postFreeze(ownerAddress: string, freeBalanceTRX: number, real = true) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>(
        '/api/freeze',
        { ownerAddress, freeBalance: freeBalanceTRX },
        { useRealApi: real }
    )
    if (res?.code !== '200') { // @ts-ignore
        throw new Error(res?.data?.message || 'freeze failed')
    }
    return pickTxHash(res.data)
}

// 批量投票
export async function postVoteSR(payload: VotePayload, real = true) {
    const res = await http.post<ApiResp<{ txnHash?: string; trxHash?: string; hash?: string }>>('/api/vote/SR', payload, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'vote failed')
    return pickTxHash(res.data)
}

// 交易详情
export async function fetchTxDetail(trxHash: string, real = true) {
    const res = await http.post<ApiResp<TxDetailResp>>('/api/trxInformation', { trxHash }, { useRealApi: real })
    if (res?.code !== '200') throw new Error(res?.message || 'txInformation failed')
    return res.data!
}

export const srApi = { getWitnessList, getAccount, postFreeze, postVoteSR, fetchTxDetail }
export default srApi
