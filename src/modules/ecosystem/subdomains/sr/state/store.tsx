// sr/state/store.ts —— 轻量 Context Store（不引入第三方）
import React from 'react'
import type { AccountInfo, SRItem } from './types'
import { normalizeInt, sumAlloc, addByProportion, scaleToTotal } from '../shared/allocationRules'

type State = {
    account: AccountInfo | null
    list: SRItem[]
    allocations: Record<string, number>
    basket: string[]
    voteSliderValue: number

    pageNum: number
    pageSize: number
    pageLoading: boolean
    hasMore?: boolean

    loading: boolean
    submitting: boolean
    freezing: boolean
    confirmOpen: boolean
    lastVoteTxHash?: string
    lastFreezeTxHash?: string
    error?: string

    // 详情抽屉
    selected?: SRItem | null
    detailOpen: boolean

    // floor(冻结总 TRX) —— 由 /api/frozenV2 汇总后下发
    frozenTotalVotes: number

    sumVotes: number
    freezeRate: number   // 0~1，小数
    totalCount: number
    nextTime: string
}

const initial: State = {
    account: null,
    list: [],
    allocations: {},
    basket: [],
    voteSliderValue: 0,

    pageNum: 1,
    pageSize: 10,
    pageLoading: false,
    hasMore: undefined,

    loading: false,
    submitting: false,
    freezing: false,
    confirmOpen: false,

    selected: null,
    detailOpen: false,

    frozenTotalVotes: 0,

    sumVotes: 0,
    freezeRate: 0,
    totalCount: 0,
    nextTime: '',
}

type Action =
    | { type: 'setAccount'; payload: AccountInfo | null }
    | { type: 'setList'; payload: SRItem[] }
    | { type: 'setLoading'; payload: boolean }
    | { type: 'setSubmitting'; payload: boolean }
    | { type: 'setFreezing'; payload: boolean }
    | { type: 'setError'; payload?: string }
    | { type: 'setConfirmOpen'; payload: boolean }
    | { type: 'setVoteSlider'; payload: number }
    | { type: 'allocChange'; payload: { sr: string; value: number } }
    | { type: 'allocReplace'; payload: Record<string, number> }
    | { type: 'allocClear' }
    | { type: 'setTxHash'; payload: { vote?: string; freeze?: string } }
    | { type: 'setPage'; payload: { pageNum: number } }
    | { type: 'setPageLoading'; payload: boolean }
    | { type: 'setHasMore'; payload: boolean }
    | { type: 'openDetail'; payload: SRItem }
    | { type: 'closeDetail' }
    | { type: 'setFrozenTotalVotes'; payload: number }
    | { type: 'setSummary'; payload: { sumVotes: number; freezeRate: number; totalCount: number; nextTime: string } }

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'setAccount':
            return { ...state, account: action.payload }
        case 'setList':
            return { ...state, list: action.payload }
        case 'setLoading':
            return { ...state, loading: action.payload }
        case 'setSubmitting':
            return { ...state, submitting: action.payload }
        case 'setFreezing':
            return { ...state, freezing: action.payload }
        case 'setError':
            return { ...state, error: action.payload }
        case 'setConfirmOpen':
            return { ...state, confirmOpen: action.payload }

        case 'setPage':
            return { ...state, pageNum: action.payload.pageNum }
        case 'setPageLoading':
            return { ...state, pageLoading: action.payload }
        case 'setHasMore':
            return { ...state, hasMore: action.payload }

        case 'openDetail':
            return { ...state, selected: action.payload, detailOpen: true }
        case 'closeDetail':
            return { ...state, selected: null, detailOpen: false }

        case 'setVoteSlider': {
            const target = normalizeInt(action.payload)
            const diff = target - sumAlloc(state.allocations)
            let next = { ...state.allocations }
            if (diff > 0) next = addByProportion(next, diff, 'proportion')
            else if (diff < 0) next = scaleToTotal(next, target)
            const basket = Object.keys(next).filter(k => next[k] > 0)
            return { ...state, voteSliderValue: target, allocations: next, basket }
        }

        case 'allocChange': {
            const { sr, value } = action.payload
            const v = normalizeInt(value)
            const next = { ...state.allocations, [sr]: v }
            const basket = Object.keys(next).filter(k => next[k] > 0)
            return { ...state, allocations: next, basket, voteSliderValue: sumAlloc(next) }
        }

        case 'allocReplace': {
            const clean = Object.fromEntries(
                Object.entries(action.payload).map(([k, v]) => [k, normalizeInt(v)])
            )
            return {
                ...state,
                allocations: clean,
                basket: Object.keys(clean).filter(k => clean[k] > 0),
                voteSliderValue: sumAlloc(clean),
            }
        }

        case 'allocClear':
            return { ...state, allocations: {}, basket: [], voteSliderValue: 0 }

        case 'setTxHash':
            return {
                ...state,
                lastVoteTxHash: action.payload.vote ?? state.lastVoteTxHash,
                lastFreezeTxHash: action.payload.freeze ?? state.lastFreezeTxHash,
            }

        case 'setFrozenTotalVotes':
            return { ...state, frozenTotalVotes: Math.max(0, Math.floor(Number(action.payload || 0))) }
        case 'setSummary': {
            const { sumVotes, freezeRate, totalCount, nextTime } = action.payload
            return {
                ...state,
                sumVotes: Number(sumVotes) || 0,
                freezeRate: Number(freezeRate) || 0,
                totalCount: Number(totalCount) || 0,
                nextTime: String(nextTime || ''),
            }
        }

        default:
            return state
    }
}

// Context
const Ctx = React.createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

export const SrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initial)
    const value = React.useMemo(() => ({ state, dispatch }), [state])
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSr = () => {
    const ctx = React.useContext(Ctx)
    if (!ctx) throw new Error('useSr must be used within SrProvider')
    return ctx
}

// 提交条件：分配总和 > 0 且 ≤ 可用票（= frozenTotalVotes）
export const canSubmit = (s: State) => {
    const usable = Math.max(0, Number(s.frozenTotalVotes || 0))
    const total = sumAlloc(s.allocations)
    return total > 0 && total <= usable
}
