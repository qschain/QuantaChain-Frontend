import type { DashboardDTO } from '../types'
import type { AccountGetByUserResp, AccountAssetRow } from '../types'

const PALETTE = ['#7aa2ff', '#2bd576', '#ff5a7a', '#05ffd2', '#f7b955', '#9b8afc']

function toMainAsset(row: AccountAssetRow) {
    return {
        name: row.tokenAbbr.toUpperCase(),
        symbol: row.tokenAbbr.toUpperCase(),
        amount: Number(row.accountBalance) || 0,
        usd: Number(row.dollarAccountBalance) || 0,
        changePct: 0,  // 后端暂未提供，先置 0
        icon: ''       // 有图标映射时在这儿补
    }
}

export function accountByUserRespToDashboardDTO(resp: AccountGetByUserResp): DashboardDTO {
    const totalUSD = Number(resp.data?.totalDollar ?? 0)
    const rows = resp.data?.dataList ?? []

    const mainAssets = rows.map(toMainAsset)
    const distribution = rows.map((r, i) => ({
        label: r.tokenAbbr.toUpperCase(),
        value: Number(r.dollarAccountBalance) || 0,
        color: PALETTE[i % PALETTE.length]
    }))

    return {
        overview: { totalUSD, diffUSD: 0, diffPct: 0, series: [] },
        mainAssets,
        market: [],
        distribution,
        activities: []
    }
}
