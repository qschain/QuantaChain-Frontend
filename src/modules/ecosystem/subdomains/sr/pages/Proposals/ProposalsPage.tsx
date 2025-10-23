import { useTranslation } from 'react-i18next';
import {useCallback, useEffect, useState} from "react";
import {getProposals, ProposalItem} from "../../shared/api/srApi";
import ProposalPreview from "../../components/proposals/ProposalPreview";
import useProposals from "../../hooks/useProposals";
import ProposalOverlay from "../../components/proposals/ProposalOverlay";
import ProposalPreviewSkeleton from "../../components/proposals/ProposalPreviewSkeleton";

export default function ProposalsPage() {
    const { t } = useTranslation('sr')
    const { loading, error, pageNum, setPageNum, totalPages, list, refresh } = useProposals(9)

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="sr-title-neon">{t('proposals.title')}</h1>
            </header>

            <div className="sr-prop-blur-scope">
                <div className="sr-row sr-space-between" style={{ marginBottom: 12 }}>
                    <div className="sr-muted">{t('dashboard.subtitle')}</div>
                    <div className="sr-row sr-gap-8">
                        <button className="sr-btn" onClick={refresh}>{t('common.refresh') ?? 'Refresh'}</button>
                    </div>
                </div>

                {error ? <div className="sr-badge danger" style={{ marginBottom: 12 }}>{error}</div> : null}

                <div className="sr-auto-grid lg sr-gap-16">
                    {loading
                        ? Array.from({ length: 9 }).map((_, i) => <ProposalPreviewSkeleton key={i} />)
                        : list.map((it) => (
                            <ProposalPreview
                                key={it.number}
                                p={it}
                                t={t}
                                detailHref={`#prop-${it.number}`}
                            />
                        ))}
                </div>

                <div className="sr-center" style={{ marginTop: 14 }}>
                    <div className="sr-row sr-gap-8">
                        <button className="sr-btn ghost" onClick={() => setPageNum(Math.max(1, pageNum - 1))} disabled={pageNum <= 1 || loading}>«</button>
                        {renderPages(pageNum, totalPages).map((p, idx) => {
                            if (p === '…') return <button key={'gap'+idx} className="sr-btn ghost" disabled>…</button>
                            const active = p === pageNum
                            return (
                                <button key={p} className={`sr-btn ${active ? 'active' : 'ghost'}`} onClick={() => setPageNum(p as number)} disabled={loading}>
                                    {p}
                                </button>
                            )
                        })}
                        <button className="sr-btn ghost" onClick={() => setPageNum(Math.min(totalPages || 1, pageNum + 1))} disabled={pageNum >= (totalPages || 1) || loading}>»</button>
                    </div>
                </div>
            </div>

            {/* 批量 Overlay（:target 控制） */}
            {!loading && list.map((it) => <ProposalOverlay key={'ov-'+it.number} p={it} t={t} />)}
        </div>
    )
}

/* 简易分页工具（沿用你现有的） */
function renderPages(cur: number, total: number): Array<number | '…'> {
    const pages: Array<number | '…'> = []
    if (total <= 8) { for (let i = 1; i <= total; i++) pages.push(i); return pages }
    const add = (v: number | '…') => pages.push(v)
    add(1)
    if (cur > 4) add('…')
    const start = Math.max(2, cur - 2)
    const end = Math.min(total - 1, cur + 2)
    for (let i = start; i <= end; i++) add(i)
    if (cur < total - 3) add('…')
    add(total)
    return pages
}
