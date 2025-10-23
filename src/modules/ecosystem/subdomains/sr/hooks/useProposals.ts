import {getProposals, ProposalItem} from "../shared/api/srApi";
import {useCallback, useEffect, useState} from "react";

type UseProposalsResult = {
    loading: boolean
    error: string
    list: ProposalItem[]
    pageNum: number
    totalPages: number
    setPageNum: (n: number) => void
    refresh: () => void
}

export default function useProposals(pageSize: number, initialPage = 1): UseProposalsResult {
    const [pageNum, setPageNum] = useState(initialPage)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [list, setList] = useState<ProposalItem[]>([])
    const [totalPages, setTotalPages] = useState(1)

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const resp = await getProposals({ pageNum, pageSize })
            setList(resp.list || [])
            setTotalPages(resp.totalPages || 1)
        } catch (e: any) {
            setError(e?.message || 'load proposals error')
            setList([])
            setTotalPages(1)
        } finally {
            setLoading(false)
        }
    }, [pageNum, pageSize])

    useEffect(() => { load() }, [load])

    return { loading, error, list, pageNum, totalPages, setPageNum, refresh: load }
}
