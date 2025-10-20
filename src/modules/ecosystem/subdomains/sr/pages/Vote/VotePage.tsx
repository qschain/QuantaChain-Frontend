import React from 'react'
import { useTranslation } from 'react-i18next'
import { SrProvider, useSr } from '../../state/store'
import useSrInit from '../../hooks/useSrInit'
import SRList from '../../components/SRList'
import VoteSidebar from '../../components/vote/VoteSidebar'
import ConfirmVoteModal from '../../components/vote/ConfirmVoteModal'
import TxResultModal from '../../components/TxResultModal'
import FreezePanel from '../../components/freeze/FreezePanel'
import srApi from '../../shared/api/srApi'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'
import SRDetailDrawer from '../../components/SRDetailDrawer'
import UnfreezePanel from '../../components/unfreeze/UnfreezePanel'

function Content() {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const { user } = useSession()
    useSrInit()

    // —— 冻结总量：从 /api/frozenV2 汇总，并下发到 store（reducer 内部会 floor 成票数）——
    async function reloadFrozenVotes() {
        if (!user?.address) {
            dispatch({ type: 'setFrozenTotalVotes', payload: 0 })
            return
        }
        try {
            const list = await srApi.getFrozenV2(user.address, true) // [{amount(SUN), type}]
            const totalTRX = srApi.sumFrozenTRX(list)                 // 小数 TRX
            dispatch({ type: 'setFrozenTotalVotes', payload: totalTRX })
        } catch (e: any) {
            // 不打断主流程，只记录错误
            dispatch({ type: 'setError', payload: e?.message || 'reload frozen error' })
        }
    }

    async function reloadAccount() {
        if (!user?.name) return
        try {
            const acc = await srApi.getAccount(user.name, true)
            dispatch({ type: 'setAccount', payload: acc })
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'reload account error' })
        }
    }

    async function reloadList() {
        try {
            dispatch({ type: 'setPageLoading', payload: true })
            const list = await srApi.getWitnessList(
                { pageNum: state.pageNum, pageSize: state.pageSize },
                true
            )
            dispatch({ type: 'setList', payload: list })
            dispatch({
                type: 'setHasMore',
                payload: Array.isArray(list) && list.length >= state.pageSize,
            })
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'reload list error' })
        } finally {
            dispatch({ type: 'setPageLoading', payload: false })
        }
    }

    // —— 首次进入 / 切换账号：加载冻结总量 ——
    React.useEffect(() => {
        void reloadFrozenVotes()
    }, [user?.address])

    async function submitVote() {
        if (!user?.address) return
        try {
            dispatch({ type: 'setSubmitting', payload: true })
            dispatch({ type: 'setConfirmOpen', payload: false })
            const payload: any = { ownerAddress: user.address }
            Object.entries(state.allocations).forEach(([addr, v]) => {
                if (v > 0) payload[addr] = String(v)
            })
            const hash = await srApi.postVoteSR(payload, true)
            dispatch({ type: 'setTxHash', payload: { vote: hash } })
            dispatch({ type: 'allocClear' })
            // 投票后已用票变化，需要刷新账户；冻结总量通常不变，但为一致性可一并刷新
            await reloadAccount()
            await reloadFrozenVotes()
            await reloadList()
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'vote error' })
        } finally {
            dispatch({ type: 'setSubmitting', payload: false })
        }
    }

    async function changePage(next: number) {
        try {
            const page = Math.max(1, next)
            dispatch({ type: 'setPage', payload: { pageNum: page } })
            dispatch({ type: 'setPageLoading', payload: true })
            const list = await srApi.getWitnessList({ pageNum: page, pageSize: state.pageSize }, true)
            dispatch({ type: 'setList', payload: list })
            dispatch({
                type: 'setHasMore',
                payload: Array.isArray(list) && list.length >= state.pageSize,
            })
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'load page error' })
        } finally {
            dispatch({ type: 'setPageLoading', payload: false })
        }
    }

    const windowPages = [state.pageNum - 2, state.pageNum - 1, state.pageNum, state.pageNum + 1, state.pageNum + 2]
        .filter(p => p >= 1)

    const lastHash = state.lastVoteTxHash || state.lastFreezeTxHash

    return (
        <div className="sr-content">
            <div className="sr-content-inner">
                <div className="sr-grid sr-grid-2">
                    <div className="sr-col sr-gap-16">
                        <div className="sr-title-neon">{t('page.header')}</div>
                        <div className="sr-desc">{t('page.desc')}</div>

                        <SRList data={state.list} loading={state.pageLoading} />

                        {/* —— 页码 —— */}
                        <div className="sr-row sr-gap-8" style={{ marginTop: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button
                                className="sr-btn"
                                onClick={() => void changePage(state.pageNum - 1)}
                                disabled={state.pageLoading || state.pageNum <= 1}
                            >
                                {t('pagination.prev', { defaultValue: '上一页' })}
                            </button>

                            {windowPages.map(p => (
                                <button
                                    key={p}
                                    className={`sr-btn ${p === state.pageNum ? 'active' : ''}`}
                                    onClick={() => void changePage(p)}
                                    disabled={state.pageLoading}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                className="sr-btn"
                                onClick={() => void changePage(state.pageNum + 1)}
                                disabled={state.pageLoading || state.hasMore === false}
                            >
                                {t('pagination.next', { defaultValue: '下一页' })}
                            </button>

                            <span className="sr-muted" style={{ marginLeft: 8 }}>
                {t('pagination.jump', { defaultValue: '跳转到' })}
              </span>
                            <input
                                className="sr-input"
                                style={{ width: 72, textAlign: 'center' }}
                                type="number"
                                min={1}
                                step={1}
                                defaultValue={state.pageNum}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        const v = Number((e.target as HTMLInputElement).value || 1)
                                        if (v >= 1) void changePage(v)
                                    }
                                }}
                            />
                            <span className="sr-muted">{t('pagination.page', { defaultValue: '页' })}</span>
                        </div>
                    </div>

                    {/* —— 右侧面板 —— */}
                    <div className="sr-col sr-gap-16" style={{ position: 'sticky', top: 16, height: 'fit-content' }}>
                        <VoteSidebar onOpenConfirm={() => dispatch({ type: 'setConfirmOpen', payload: true })} />
                        {/* 冻结/解冻成功后：刷新账户 + 列表 + 冻结总量 */}
                        <FreezePanel onAfterSuccess={async () => { await reloadAccount(); await reloadFrozenVotes(); await reloadList(); }} />
                        <UnfreezePanel onAfterSuccess={async () => { await reloadAccount(); await reloadFrozenVotes(); await reloadList(); }} />
                    </div>
                </div>

                <ConfirmVoteModal
                    open={state.confirmOpen}
                    onCancel={() => dispatch({ type: 'setConfirmOpen', payload: false })}
                    onConfirm={submitVote}
                />
                <TxResultModal
                    open={!!lastHash}
                    trxHash={lastHash}
                    onClose={() => dispatch({ type: 'setTxHash', payload: { vote: '', freeze: '' } })}
                />
                <SRDetailDrawer />
            </div>
        </div>
    )
}

export default function VotePage() {
    return (
        <SrProvider>
            <Content />
        </SrProvider>
    )
}
