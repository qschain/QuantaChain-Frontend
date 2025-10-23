import { useTranslation } from 'react-i18next';
import ConfirmWithdrawModal from "../../components/rewards/modals/ConfirmWithdrawModal";
import TxResultModal from "../../components/rewards/modals/TxResultModal";
import MiniStatCard from "../../components/rewards/MiniStatCard";
import useRewards from "../../hooks/useRewards";
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {useNavigate} from "react-router-dom";
import {useState, useMemo} from "react";
import useRewardList from "../../hooks/useRewardList";
import usePredict from "../../hooks/usePredict";

export default function RewardsPage() {
    const { t } = useTranslation('sr')
    const { user } = useSession()
    const navigate = useNavigate()

    // 顶部汇总（待领取 & 提现）
    const {
        loading: summaryLoading,
        error: summaryError,
        pendingTRX,
        txHash,
        withdrawing,
        refresh: refreshSummary,
        withdraw,
        clearTx,
    } = useRewards(user?.name, user?.address)

    // 奖励记录（分页：每页 6 条）
    const PAGE_SIZE = 6
    const {
        rows,
        pages,
        total,
        totalBalance,  // 🔥 新增：累计总额
        pageNum,
        loading: listLoading,
        error: listError,
        gotoPage,
        refresh: refreshList,
    } = useRewardList({ address: user?.address, pageSize: PAGE_SIZE })
     console.log(totalBalance, 'totalBalance')
    // 🔥 强制限制显示的行数
    const displayRows = rows.slice(0, PAGE_SIZE)

    // 🔥 计算最近奖励时间（取 list 中第一条的时间）
    const lastRewardTime = useMemo(() => {
        if (rows.length === 0) return '—'
        return formatTime(rows[0]?.time)
    }, [rows])

    // 模拟器
    const {
        count, setCount,
        rate, setRate,
        days, setDays,
        result, loading: simLoading, error: simError,
        simulate,
    } = usePredict()

    // 二次确认
    const [confirmOpen, setConfirmOpen] = useState(false)
    const openConfirm = () => setConfirmOpen(true)
    const closeConfirm = () => setConfirmOpen(false)
    const onConfirmWithdraw = async () => {
        try {
            await withdraw()
            setConfirmOpen(false)
            refreshList()
        } catch {}
    }

    // 查看交易详情
    const goTxDetail = (hash: string) => {
        if (hash) navigate(`/ecosystem/explorer/tx/${hash}`)
    }

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="sr-title-neon">{t('rewards.title')}</h1>
            </header>

            {(summaryError || listError) ? (
                <div className="sr-badge danger" style={{ marginBottom: 12 }}>
                    {summaryError || listError}
                </div>
            ) : null}

            {/* 顶部三张卡片 */}
            <section className="sr-auto-grid lg sr-gap-16">
                {/* 🔥 累计领取总额 */}
                <MiniStatCard 
                    title={t('rewards.cards.total')} 
                    value={
                        listLoading
                            ? undefined
                            : totalBalance.toLocaleString(undefined, { maximumFractionDigits:6})
                    }
                    loading={listLoading}
                    unit={listLoading ? '' : ' TRX'}
                />
                
                {/* 🔥 最近奖励时间 */}
                <MiniStatCard 
                    title={t('rewards.count')}
                    value={listLoading
                        ? undefined
                        : total.toLocaleString(undefined, { maximumFractionDigits:6})}
                    loading={listLoading}
                />
                
                {/* 待领取 */}
                <MiniStatCard
                    title={t('rewards.cards.pending')}
                    value={
                        summaryLoading
                            ? undefined
                            : pendingTRX.toLocaleString(undefined, { maximumFractionDigits: 6 })
                    }
                    loading={summaryLoading}
                    unit={summaryLoading ? '' : ' TRX'}
                    actions={
                        <div className="sr-row sr-gap-8">
                            <button
                                className="sr-btn primary"
                                onClick={openConfirm}
                                disabled={summaryLoading || withdrawing || pendingTRX <= 0}
                                title={pendingTRX <= 0 ? t('withdraw.disabledTip') : ''}
                            >
                                {withdrawing ? t('withdraw.processing') : t('withdraw.action')}
                            </button>
                            <button className="sr-btn ghost" onClick={() => { refreshSummary(); refreshList() }}>
                                {t('common.refresh') ?? 'Refresh'}
                            </button>
                        </div>
                    }
                />
            </section>

            {/* 奖励记录：只显示 时间 & 金额 */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('rewards.table.title')}</div>
                    <div className="sr-row sr-gap-8">
                        <button className="sr-btn" onClick={refreshList}>{t('rewards.filters.byDate')}</button>
                        <button className="sr-btn ghost">{t('rewards.filters.byType')}</button>
                    </div>
                </div>

                <div className="sr-table">
                    {/* 仅两列：时间、金额 */}
                    <div
                        className="sr-table__row head"
                        style={{ gridTemplateColumns: '2fr 1fr' }}
                    >
                        <div>{t('common.date') ?? '日期'}</div>
                        <div>{t('rewards.amount') ?? '金额 (TRX)'}</div>
                    </div>

                    {listLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="sr-table__row" style={{ gridTemplateColumns: '2fr 1fr' }}>
                                <div className="sr-skeleton"><div className="sr-skel-line" style={{ height: 16 }} /></div>
                                <div className="sr-skeleton"><div className="sr-skel-line" style={{ height: 16 }} /></div>
                            </div>
                        ))
                    ) : displayRows.length === 0 ? (
                        <div className="sr-row" style={{ padding: 16 }}>{t('common.empty')}</div>
                    ) : (
                        // 🔥 使用 displayRows 而不是 rows
                        displayRows.map((r, idx) => (
                            <div key={`${r.id}-${idx}`} className="sr-table__row" style={{ gridTemplateColumns: '2fr 1fr' }}>
                                <div>{formatTime(r.time)}</div>
                                <div className="sr-reward-amount">{'+'+Number(r.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* 分页 */}
                <div className="sr-row sr-gap-8" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                    <button className="sr-btn" onClick={() => gotoPage(pageNum - 1)} disabled={pageNum <= 1}>{'<'}</button>
                    {Array.from({ length: Math.max(1, pages) }).map((_, i) => {
                        const p = i + 1
                        const active = p === pageNum
                        return (
                            <button key={p} className={`sr-btn ${active ? 'active' : ''}`} onClick={() => gotoPage(p)}>
                                {p}
                            </button>
                        )
                    })}
                    <button className="sr-btn" onClick={() => gotoPage(pageNum + 1)} disabled={pageNum >= pages}>{'>'}</button>
                    <div className="sr-muted" style={{ marginLeft: 8 }}>
                        {/* 🔥 显示当前页实际条数 / 总条数 */}
                        {displayRows.length} / {total} {t('common.items') ?? 'items'}
                    </div>
                </div>
            </section>

            {/* 收益模拟与优化（保持原样） */}
            <section className="sr-panel">
                <div className="sr-panel__title">{t('rewards.simulator.title')}</div>
                <div className="sr-auto-grid sr-gap-16">
                    <div className="sr-card">
                        <label className="sr-label">{t('rewards.simulator.inputs.amount')}</label>
                        <input
                            className="sr-input"
                            type="number"
                            min={0}
                            step={1}
                            value={count}
                            onChange={(e)=>setCount(e.target.value)}
                            placeholder="100000"
                        />

                        <label className="sr-label">{t('list.annualized')} (%)</label>
                        <input
                            className="sr-input"
                            type="number"
                            min={0}
                            step="0.0001"
                            value={rate}
                            onChange={(e)=>setRate(e.target.value)}
                            placeholder="0.03"
                        />

                        <label className="sr-label">{t('rewards.simulator.inputs.lock')}</label>
                        <input
                            className="sr-input"
                            type="number"
                            min={1}
                            step={1}
                            value={days}
                            onChange={(e)=>setDays(e.target.value)}
                            placeholder="30"
                        />

                        {simError ? <div className="sr-badge danger" style={{ marginTop: 8 }}>{simError}</div> : null}

                        <button className="sr-btn primary" style={{ marginTop: 12 }} onClick={simulate} disabled={simLoading}>
                            {simLoading ? t('rewards.simulator.actions.simulate') + '…' : t('rewards.simulator.actions.simulate')}
                        </button>
                    </div>

                    <div className="sr-card">
                        <div className="sr-card__title">{t('rewards.simulator.result.title')}</div>
                        <div style={{ height: 180, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 22, fontWeight: 800 }}>
                            {result == null ? '—' : `${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} TRX`}
                        </div>
                        <div className="sr-muted sr-note">{t('rewards.simulator.note')}</div>
                    </div>
                </div>
            </section>

            {/* 二次确认弹窗 */}
            <ConfirmWithdrawModal
                open={confirmOpen}
                amountTRX={pendingTRX}
                onCancel={closeConfirm}
                onConfirm={onConfirmWithdraw}
                title={t('withdraw.confirmTitle')}
                desc={t('withdraw.note')}
                cancelText={t('common.cancel')}
                confirmText={t('common.confirm')}
                pendingLabel={t('rewards.cards.pending')}
            />

            {/* 结果弹窗 */}
            <TxResultModal
                open={!!txHash}
                hash={txHash}
                onClose={clearTx}
                onView={() => goTxDetail(txHash)}
                title={t('resultModal.title')}
                hashLabel={t('resultModal.hash')}
                closeText={t('common.close')}
                viewText={t('common.viewTx')}
                confirmText={t('common.confirm')}
            />
        </div>
    )
}

/* ===== 小工具 ===== */
function formatTime(v?: string) {
    if (!v) return '-'
    const d = new Date(v)
    if (isNaN(d.getTime())) return String(v)
    const Y = d.getFullYear()
    const M = String(d.getMonth() + 1).padStart(2, '0')
    const D = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${Y}-${M}-${D} ${h}:${m}`
}
