import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSr } from '../state/store'

export default function Pagination() {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    // @ts-ignore
    const { pageNum, maxPages } = state

    const go = (n: number) => {
        const pn = Math.min(Math.max(1, n), maxPages)
        if (pn !== pageNum) dispatch({ type: 'setPage', payload: { pageNum: pn } })
    }

    return (
        <div className="sr-row sr-gap-8" style={{ justifyContent:'center', marginTop:8 }}>
            <button className="sr-btn" onClick={() => go(1)} disabled={pageNum===1}>«</button>
            <button className="sr-btn" onClick={() => go(pageNum-1)} disabled={pageNum===1}>‹</button>
            {Array.from({ length: maxPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`sr-btn ${n===pageNum?'active':''}`} onClick={() => go(n)}>{n}</button>
            ))}
            <button className="sr-btn" onClick={() => go(pageNum+1)} disabled={pageNum===maxPages}>›</button>
            <button className="sr-btn" onClick={() => go(maxPages)} disabled={pageNum===maxPages}>»</button>
        </div>
    )
}
