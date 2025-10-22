import {useCallback, useEffect, useRef, useState} from "react";
import {fetchRewardList, RewardItem} from "../shared/api/srApi";

type UseRewardListArgs = {
    address?: string | null
    pageSize?: number
}

type UseRewardListReturn<T> = {
    rows: T[]
    pages: number
    total: number
    totalBalance: number  // 🔥 新增：累计总额
    pageNum: number
    loading: boolean
    error: string
    gotoPage: (p: number) => void
    refresh: () => Promise<void>
}

export default function useRewardList<T extends RewardItem = RewardItem>({
                                                                             address,
                                                                             pageSize = 6,
                                                                         }: UseRewardListArgs): UseRewardListReturn<T> {
    const [rows, setRows] = useState<T[]>([])
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)  // 🔥 新增
    const [pageNum, setPageNum] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // 防并发/乱序
    const reqRef = useRef(0)

    console.log('🎯 [useRewardList] Current state:', {
        pageNum,
        pageSize,
        rowsLength: rows.length,
        total,
        totalBalance,  // 🔥 记录
        pages,
        address: address?.slice(0, 10) + '...'
    })

    // address 变化回到第一页
    useEffect(() => {
        console.log('🔄 [useRewardList] Address changed, reset to page 1')
        setPageNum(1)
        setRows([])
        setTotalBalance(0)  // 🔥 清空
    }, [address])

    // 单一 effect：清空 -> 请求 -> 覆盖
    useEffect(() => {
        console.log('⚡ [useRewardList] Effect triggered:', { address, pageNum, pageSize })
        
        // 无地址：直接清空并退出
        if (!address) {
            console.log('❌ [useRewardList] No address, clearing state')
            setRows([])
            setPages(1)
            setTotal(0)
            setTotalBalance(0)  // 🔥 清空
            setLoading(false)
            setError('')
            return
        }

        // 边界检查：确保 pageNum 有效
        if (pageNum < 1) {
            console.warn('⚠️ [useRewardList] Invalid pageNum:', pageNum)
            setPageNum(1)
            return
        }

        const rid = ++reqRef.current
        setLoading(true)
        setError('')
        
        console.log('🧹 [useRewardList] Clearing rows before fetch')
        setRows([])

        console.log('📤 [useRewardList] Requesting:', { 
            address: address.slice(0, 10) + '...', 
            pageNum, 
            pageSize, 
            rid 
        })

        ;(async () => {
            try {
                const resp = await fetchRewardList({
                    address,
                    pageNum,
                    pageSize,
                })
                
                console.log('📥 [useRewardList] Raw response:', { 
                    rid, 
                    currentRid: reqRef.current,
                    listLength: resp.list?.length,
                    total: resp.total,
                    totalBalance: resp.totalBalance,  // 🔥 记录
                    pages: resp.pages,
                    currentPage: resp.currentPage,
                    firstItem: resp.list?.[0],
                    lastItem: resp.list?.[resp.list.length - 1]
                })
                
                if (reqRef.current !== rid) {
                    console.warn('⚠️ [useRewardList] Request outdated, ignoring:', rid, 'current:', reqRef.current)
                    return
                }
                
                // 🔥 强制截断：确保只保留 pageSize 条
                let newRows = (resp.list as unknown as T[]) ?? []
                const originalLength = newRows.length
                
                if (newRows.length > pageSize) {
                    console.warn(`⚠️ [useRewardList] Backend returned ${newRows.length} items but pageSize is ${pageSize}, truncating!`)
                    newRows = newRows.slice(0, pageSize)
                }
                
                const newPages = Math.max(1, Number(resp.pages || 1))
                const newTotal = Number(resp.total || 0)
                const newTotalBalance = Number(resp.totalBalance || 0)  // 🔥 新增
                
                console.log('✅ [useRewardList] Setting state:', { 
                    originalLength,
                    truncatedLength: newRows.length,
                    pages: newPages, 
                    total: newTotal,
                    totalBalance: newTotalBalance,  // 🔥 记录
                    pageNum: resp.currentPage
                })
                
                setRows(newRows)
                setPages(newPages)
                setTotal(newTotal)
                setTotalBalance(newTotalBalance)  // 🔥 设置
            } catch (e: any) {
                if (reqRef.current !== rid) return
                console.error('❌ [useRewardList] Error:', e)
                setError(e?.message || 'load reward list error')
                setRows([])
                setPages(1)
                setTotal(0)
                setTotalBalance(0)  // 🔥 清空
            } finally {
                if (reqRef.current === rid) {
                    console.log('🏁 [useRewardList] Loading finished')
                    setLoading(false)
                }
            }
        })()
    }, [address, pageNum, pageSize])

    const gotoPage = useCallback((p: number) => {
        console.log('🔄 [useRewardList] gotoPage called:', p)
        setPageNum(p)
    }, [])

    const refresh = useCallback(async () => {
        console.log('🔄 [useRewardList] Manual refresh')
        const rid = ++reqRef.current
        setLoading(true)
        setError('')
        setRows([])
        try {
            if (!address) {
                setPages(1)
                setTotal(0)
                setTotalBalance(0)  // 🔥 清空
                return
            }
            const resp = await fetchRewardList({ address, pageNum, pageSize })
            if (reqRef.current !== rid) return
            
            let newRows = (resp.list as unknown as T[]) ?? []
            if (newRows.length > pageSize) {
                console.warn(`⚠️ [useRewardList refresh] Truncating from ${newRows.length} to ${pageSize}`)
                newRows = newRows.slice(0, pageSize)
            }
            
            const newPages = Math.max(1, Number(resp.pages || 1))
            const newTotal = Number(resp.total || 0)
            const newTotalBalance = Number(resp.totalBalance || 0)  // 🔥 新增
            
            setRows(newRows)
            setPages(newPages)
            setTotal(newTotal)
            setTotalBalance(newTotalBalance)  // 🔥 设置
        } catch (e: any) {
            if (reqRef.current !== rid) return
            setError(e?.message || 'load reward list error')
            setRows([])
            setPages(1)
            setTotal(0)
            setTotalBalance(0)  // 🔥 清空
        } finally {
            if (reqRef.current === rid) setLoading(false)
        }
    }, [address, pageNum, pageSize])

    return { rows, pages, total, totalBalance, pageNum, loading, error, gotoPage, refresh }  // 🔥 返回 totalBalance
}