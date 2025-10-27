// sr/state/types.ts —— 统一类型
export type ApiResp<T = any> = { code: string; message?: string; data?: T }
export type PaginationParams = { pageNum: number; pageSize: number }

export type UnfrozenItem = {
    amount: number;          // 预计是 SUN
    unfreezeTime: string;    // "2025-10-24 17:12:18"
    type: string;            // "BANDWIDTH" | "ENERGY"
}
export type SRItem = {
    realTimeRanking: number
    address: string
    name: string
    url?: string
    hasPage?: boolean

    // 票数 & 变化
    lastCycleVotes?: number
    realTimeVotes?: number
    changeVotes?: number
    votesPercentage?: number
    lastCycleVotesPercentage?: number
    change_cycle?: number

    // 经济 & 产出
    brokerage?: number
    voterBrokerage?: number
    annualizedRate?: string | number
    producedTotal?: number
    producedEfficiency?: number
    blockReward?: number
    version?: number
    totalOutOfTimeTrans?: number
    lastWeekOutOfTimeTrans?: number
    changedBrokerage?: boolean
    lowestBrokerage?: number
    percent?:string
    // 其他
    witnessType?: number
}
export type WitnessListResult = {
    SrData: SRItem[]
    totalPages: number
    totalCount: number
    sumVotes: number
    freezeRate: number  // 0~1 的小数，例如 0.476，对应 47.6%
    nextTime: string
    raw?: any           // 如需访问原始字段
}
export type AccountInfo = {
    votes: number         // 总投票数（后端语义）
    voteTotal: number     // 可用投票数（用于前端上限）
    totalFrozenTRX: number
    accountBalanceTRX: number
    rewardNumSUN: number
    freeNetLimit: number
    freeNetRemaining: number
}

export type VotePayload = {
    ownerAddress: string
    [srAddress: string]: string | number
}

export type TxDetailResp = {
    blockNum?: string | number
    time?: string | number
    ownerAddress?: string
    toAddress?: string
    contractDescribe?: string
    amount?: number | string
    fee?: number | string
    status?: string
    hash?: string
}
