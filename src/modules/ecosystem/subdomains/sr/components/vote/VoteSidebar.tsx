import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSr, canSubmit } from '../../state/store'

export default function VoteSidebar({ onOpenConfirm }: { onOpenConfirm(): void }) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()

    // 展示：已投票（来自 account/get）
    const used = Number(state.account?.voteTotal ?? 0)
    // 可用票：= floor(冻结总 TRX)
    const usable = Math.max(0, Number(state.frozenTotalVotes || 0))

    // 当前目标总票（做一次 clamp，避免可用票更新后 UI 溢出）
    const targetTotal = Math.min(state.voteSliderValue, usable)
    const percent = Math.min(100, Math.round((targetTotal / Math.max(1, usable)) * 100))

    const nameByAddr = (addr: string) => {
        const it = state.list.find(x => x.address === addr)
        return it?.name || addr.slice(0, 6) + '…' + addr.slice(-6)
    }

    const onSlide = (v: number) => {
        const next = Math.min(Math.max(0, Math.floor(v)), usable)
        dispatch({ type: 'setVoteSlider', payload: next })
    }

    const onInputChange = (v: number) => {
        const next = Math.min(Math.max(0, Math.floor(v)), usable)
        dispatch({ type: 'setVoteSlider', payload: next })
    }

    return (
        <div className="sr-panel">
            <div className="sr-panel__head">
                <div className="sr-panel__title">{t('sidebar.basket')}</div>
                <div className="sr-row sr-gap-16" style={{ fontSize: 12 }}>
                    <div className="sr-muted">{t('sidebar.used', { defaultValue: '已投票' })}：{used.toLocaleString()}</div>
                    <div className="sr-muted">{t('sidebar.available')}：{usable.toLocaleString()}</div>
                </div>
            </div>

            {/* 投票数量 + 进度条 */}
            <div className="sr-row sr-space-between sr-align-center">
                <div>{t('sidebar.voteAmount')}</div>
                <div className="sr-number-md">{targetTotal.toLocaleString()}</div>
            </div>
            <div className="sr-progress">
                <div className="sr-progress__bar" style={{ width: `${percent}%` }} />
            </div>

            {/* 滑块（上限=可用票） */}
            <input
                className="sr-range"
                type="range"
                min={0}
                max={usable}
                step={1}
                value={targetTotal}
                onChange={(e) => onSlide(Number(e.target.value || 0))}
            />

            {/* 数字输入（与滑块一致的约束） */}
            <div className="sr-row sr-gap-8 sr-align-center" style={{ marginTop: 8 }}>
                <input
                    className="sr-input"
                    style={{ textAlign: 'center' }}
                    type="number"
                    min={0}
                    max={usable}
                    step={1}
                    value={targetTotal}
                    onChange={(e) => onInputChange(Number(e.target.value || 0))}
                />
                <button className="sr-btn" onClick={() => onSlide(0)}>0</button>
                <button className="sr-btn" onClick={() => onSlide(Math.floor(usable / 2))}>{t('freeze.half')}</button>
                <button className="sr-btn" onClick={() => onSlide(usable)}>{t('freeze.max')}</button>
            </div>

            {/* 已选择 SR 列表（名称 + 当前分配票） */}
            <div style={{ marginTop: 12 }}>
                <div className="sr-muted" style={{ marginBottom: 6 }}>{t('sidebar.selectedSR')}</div>
                <div className="sr-col sr-gap-8">
                    {state.basket.length === 0 && <div style={{ opacity: .7 }}>{t('common.empty')}</div>}
                    {state.basket.map(addr => (
                        <div key={addr} className="sr-row sr-space-between" style={{ borderBottom: '1px dashed #14202b', padding: '6px 0' }}>
                            <div style={{ fontSize: 13 }}>{nameByAddr(addr)}</div>
                            <div style={{ fontWeight: 700 }}>{(state.allocations[addr] || 0).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 操作区 */}
            <div className="sr-row sr-gap-16" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
                <button className="sr-btn" onClick={() => dispatch({ type: 'allocClear' })}>{t('common.clear')}</button>
                <button className="sr-btn primary" onClick={onOpenConfirm} disabled={!canSubmit(state)}>
                    {t('sidebar.confirmVote')}
                </button>
            </div>
        </div>
    )
}
