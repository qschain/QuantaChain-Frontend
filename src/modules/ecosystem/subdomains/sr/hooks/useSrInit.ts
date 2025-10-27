// sr/hooks/useSrInit.ts —— 首屏初始化加载 Hook
import { useEffect } from 'react'
import { useSr } from '../state/store'
import srApi from '../shared/api/srApi'
import { useSession } from '../../../../../app/session/PlatformSessionProvider'

export default function useSrInit() {
    const { state, dispatch } = useSr()
    const { user } = useSession()

    /** 1️⃣ 初始化加载 SR 列表（不依赖用户） */
    useEffect(() => {
        let alive = true
        async function loadList() {
            try {
                dispatch({ type: 'setPageLoading', payload: true })

                const { list, totalPages, sumVotes, freezeRate, totalCount, nextTime } =
                    await srApi.getWitnessList({ pageNum: state.pageNum, pageSize: state.pageSize }, true)

                if (!alive) return
                dispatch({ type: 'setList', payload: list })
                dispatch({ type: 'setHasMore', payload: state.pageNum < totalPages })

                // 统一存储概要数据（供 Dashboard / Analytics 等使用）
                dispatch({
                    type: 'setSummary',
                    payload: { sumVotes, freezeRate, totalCount, nextTime },
                })
            } catch (e: any) {
                if (!alive) return
                dispatch({ type: 'setError', payload: e?.message || 'load list error' })
            } finally {
                if (alive) dispatch({ type: 'setPageLoading', payload: false })
            }
        }

        loadList()
        return () => {
            alive = false
        }
    }, [state.pageNum, state.pageSize])

    /** 2️⃣ 拉账户信息（仅当 user.name 可用） */
    useEffect(() => {
        if (!user?.name) return
        let alive = true
        async function loadAccount() {
            try {
                dispatch({ type: 'setLoading', payload: true })
                // @ts-ignore
                const account = await srApi.getAccount(user.name, true)
                if (!alive) return
                dispatch({ type: 'setAccount', payload: account })
            } catch (e: any) {
                if (!alive) return
                dispatch({ type: 'setError', payload: e?.message || 'load account error' })
            } finally {
                if (alive) dispatch({ type: 'setLoading', payload: false })
            }
        }

        loadAccount()
        return () => {
            alive = false
        }
    }, [user?.name])

    /** 3️⃣ 页面重新可见时自动刷新（仅当列表为空） */
    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState !== 'visible') return
            if (!Array.isArray(state.list) || state.list.length === 0) {
                ;(async () => {
                    dispatch({ type: 'setPageLoading', payload: true })
                    try {
                        const { list, totalPages, sumVotes, freezeRate, totalCount, nextTime } =
                            await srApi.getWitnessList({ pageNum: state.pageNum, pageSize: state.pageSize }, true)

                        dispatch({ type: 'setList', payload: list })
                        dispatch({ type: 'setHasMore', payload: state.pageNum < totalPages })
                        dispatch({
                            type: 'setSummary',
                            payload: { sumVotes, freezeRate, totalCount, nextTime },
                        })
                    } catch (e: any) {
                        dispatch({ type: 'setError', payload: e?.message || 'reload list error' })
                    } finally {
                        dispatch({ type: 'setPageLoading', payload: false })
                    }
                })()
            }
        }
        document.addEventListener('visibilitychange', onVisible)
        return () => document.removeEventListener('visibilitychange', onVisible)
    }, [state.list, state.pageNum, state.pageSize])

    return { state, dispatch, user }
}
