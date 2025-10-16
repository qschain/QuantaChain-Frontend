// sr/hooks/useSrInit.ts —— 首屏初始化加载 Hook
import { useEffect } from 'react'
import { useSr } from '../state/store'
import srApi from '../shared/api/srApi'
// ⚠️ 路径按你的项目实际调整
import { useSession } from '../../../../../app/session/PlatformSessionProvider'

export default function useSrInit() {
    const { state, dispatch } = useSr()
    const { user } = useSession()

    // 拉 SR 列表（不依赖用户）
    useEffect(() => {
        let alive = true
        async function loadList() {
            try {
                dispatch({ type: 'setPageLoading', payload: true })
                const list = await srApi.getWitnessList({ pageNum: state.pageNum, pageSize: state.pageSize }, true)
                if (!alive) return
                dispatch({ type: 'setList', payload: list })
                dispatch({ type: 'setHasMore', payload: Array.isArray(list) && list.length >= state.pageSize })
            } catch (e: any) {
                if (!alive) return
                dispatch({ type: 'setError', payload: e?.message || 'load list error' })
            } finally {
                if (alive) dispatch({ type: 'setPageLoading', payload: false })
            }
        }
        loadList()
        return () => { alive = false }
    }, [state.pageNum, state.pageSize])

    // 拉账户信息（仅当 user.name 可用）
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
        return () => { alive = false }
    }, [user?.name])

    // 页面变为可见且列表为空时，自动再拉一次
    useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === 'visible' && (!Array.isArray(state.list) || state.list.length === 0)) {
                // 触发一次列表加载
                (async () => {
                    dispatch({ type: 'setPageLoading', payload: true })
                    try {
                        const list = await srApi.getWitnessList({ pageNum: state.pageNum, pageSize: state.pageSize }, true)
                        dispatch({ type: 'setList', payload: list })
                        dispatch({ type: 'setHasMore', payload: Array.isArray(list) && list.length >= state.pageSize })
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
