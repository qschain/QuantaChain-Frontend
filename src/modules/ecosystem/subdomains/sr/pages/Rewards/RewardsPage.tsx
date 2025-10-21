import { useTranslation } from 'react-i18next';
import ConfirmWithdrawModal from "../../components/rewards/modals/ConfirmWithdrawModal";
import TxResultModal from "../../components/rewards/modals/TxResultModal";
import MiniStatCard from "../../components/rewards/MiniStatCard";
import useRewards from "../../hooks/useRewards";
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function RewardsPage() {
    const { t } = useTranslation('sr')
    const { user } = useSession()
    const navigate = useNavigate()

    const {
        loading, error, pendingTRX, txHash, withdrawing,
        refresh, withdraw, clearTx
    } = useRewards(user?.name, user?.address)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const openConfirm = () => setConfirmOpen(true)
    const closeConfirm = () => setConfirmOpen(false)

    const onConfirmWithdraw = async () => {
        try {
            await withdraw()
            setConfirmOpen(false)
        } catch {
            /* 已在 hook 内处理错误 */
        }
    }

    const goTxDetail = (hash: string) => {
        if (hash) navigate(`/ecosystem/explorer/tx/${hash}`)
    }

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="sr-title-neon">{t('rewards.title')}</h1>
            </header>

            {error ? <div className="sr-badge danger" style={{ marginBottom: 12 }}>{error}</div> : null}

            {/* 顶部三张卡片 */}
            <section className="sr-auto-grid lg sr-gap-16">
                <MiniStatCard title={t('rewards.cards.total')} value="—" loading={false} />

                <MiniStatCard title={t('rewards.cards.lastTime')} value="—" loading={false} />

                <MiniStatCard
                    title={t('rewards.cards.pending')}
                    value={
                        loading
                            ? undefined
                            : pendingTRX.toLocaleString(undefined, { maximumFractionDigits: 6 })
                    }
                    loading={loading}
                    unit={loading ? '' : ' TRX'}
                    actions={
                        <div className="sr-row sr-gap-8">
                            <button
                                className="sr-btn primary"
                                onClick={openConfirm}
                                disabled={loading || withdrawing || pendingTRX <= 0}
                                title={pendingTRX <= 0 ? t('withdraw.disabledTip') : ''}
                            >
                                {withdrawing ? t('withdraw.processing') : t('withdraw.action')}
                            </button>
                            <button className="sr-btn ghost" onClick={refresh}>
                                {t('common.refresh') ?? 'Refresh'}
                            </button>
                        </div>
                    }
                />
            </section>

            {/* 奖励明细（占位） */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('rewards.table.title')}</div>
                    <div className="sr-row sr-gap-8">
                        <button className="sr-btn">{t('rewards.filters.byDate')}</button>
                        <button className="sr-btn ghost">{t('rewards.filters.byType')}</button>
                    </div>
                </div>
                <div className="sr-table">
                    <div className="sr-table__row head" style={{ gridTemplateColumns: '1.6fr 2fr 1.4fr 1fr .8fr' }}>
                        <div>{t('common.date') ?? '日期'}</div>
                        <div>SR</div>
                        <div>{t('rewards.amount') ?? '奖励金额 (TRX)'}</div>
                        <div>{t('common.status') ?? '状态'}</div>
                        <div>{t('common.detail') ?? '详情'}</div>
                    </div>
                    {[
                        ['2025-09-03 14:30','TronLink','+543.21','CLAIMED','—'],
                        ['2025-09-02 11:15','Binance Staking','+602.78','CLAIMED','—'],
                        ['2025-09-01 08:00','Poloniex','+150.00','PENDING','—'],
                    ].map((r,i)=>(
                        <div key={i} className="sr-table__row" style={{ gridTemplateColumns: '1.6fr 2fr 1.4fr 1fr .8fr' }}>
                            {r.map((c,ci)=><div key={ci}>{c}</div>)}
                        </div>
                    ))}
                </div>
            </section>

            {/* 模拟器（占位） */}
            <section className="sr-panel">
                <div className="sr-panel__title">{t('rewards.simulator.title')}</div>
                <div className="sr-auto-grid sr-gap-16">
                    <div className="sr-card">
                        <label className="sr-label">{t('rewards.simulator.inputs.amount')}</label>
                        <input className="sr-input" placeholder="100000" />
                        <label className="sr-label">{t('rewards.simulator.inputs.sr')}</label>
                        <select className="sr-input"><option>{t('vote.searchPlaceholder')}</option></select>
                        <label className="sr-label">{t('rewards.simulator.inputs.lock')}</label>
                        <select className="sr-input"><option>{t('common.none') ?? '不锁仓'}</option></select>
                        <button className="sr-btn primary" style={{ marginTop: 12 }}>
                            {t('rewards.simulator.actions.simulate')}
                        </button>
                    </div>

                    <div className="sr-card">
                        <div className="sr-card__title">{t('rewards.simulator.result.title')}</div>
                        <div className="chart-placeholder" style={{ height: 220 }} />
                        <div className="sr-muted sr-note">{t('rewards.simulator.note')}</div>
                    </div>
                </div>
            </section>

            {/* 二次确认弹窗（抽离组件） */}
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

            {/* 结果弹窗（抽离组件） */}
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
