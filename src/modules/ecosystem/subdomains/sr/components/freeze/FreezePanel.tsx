import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSr } from '../../state/store'
import srApi from '../../shared/api/srApi'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'
import ConfirmFreezeModal from './ConfirmFreezeModal'


export default function FreezePanel({ onAfterSuccess }: { onAfterSuccess?: () => void }) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const { user } = useSession()

    // 可用余额（单位：TRX）
    const usable = Math.max(0, Number(state.account?.accountBalanceTRX ?? 0))

    // 输入值（单位：TRX，整数），默认 0
    const [val, setVal] = React.useState(0)
    const [errMsg, setErrMsg] = React.useState('')
    const [confirmOpen, setConfirmOpen] = React.useState(false)

    // 当可用余额变化时，对当前值进行 clamp
    React.useEffect(() => {
        setVal(v => Math.min(Math.max(0, Math.floor(v)), usable))
    }, [usable])

    const clampToUsable = (n: number) => Math.min(Math.max(0, Math.floor(n)), usable)

    const onSlide = (n: number) => {
        setVal(clampToUsable(n))
        if (errMsg) setErrMsg('')
    }
    const onChangeVal = (n: number) => {
        setVal(clampToUsable(n))
        if (errMsg) setErrMsg('')
    }

    const openConfirm = () => {
        if (val <= 0) {
            setErrMsg(t('freezeConfirm.invalid', { defaultValue: '请输入有效数量' }))
            return
        }
        setConfirmOpen(true)
    }

    // 真正发起冻结（把 TRX -> SUN）
    const doFreeze = async () => {
        if (!user?.address) return
        const amountTRX = clampToUsable(val)
        if (amountTRX <= 0) {
            setErrMsg(t('freezeConfirm.invalid', { defaultValue: '请输入有效数量' }))
            setConfirmOpen(false)
            return
        }

        try {
            setErrMsg('')
            dispatch({ type: 'setFreezing', payload: true })
            setConfirmOpen(false)

            // 转成 SUN
            const freezeAmountSUN = amountTRX * 1_000_000
            const hash = await srApi.postFreeze(user.address, freezeAmountSUN, true)

            // 弹出交易哈希结果（你的 TxResultModal 会捕获）
            dispatch({ type: 'setTxHash', payload: { freeze: hash } })

            // 成功刷新账户/列表
            if (typeof onAfterSuccess === 'function') {
                await onAfterSuccess()
            }
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'freeze error' })
            setErrMsg(t('freeze.failed'))
        } finally {
            dispatch({ type: 'setFreezing', payload: false })
        }
    }

    const percent = usable > 0 ? Math.min(100, Math.round((val / usable) * 100)) : 0

    return (
        <div className="sr-panel">
            <div className="sr-panel__head">
                <div className="sr-panel__title">{t('freeze.title')}</div>
            </div>

            <div className="sr-col sr-gap-16">
                {/* 可用余额 */}
                <div className="sr-muted" style={{ fontSize: 12 }}>
                    {t('freeze.balance')}：{usable.toLocaleString()} TRX
                </div>

                {/* 数量标题 + 当前选择 */}
                <div className="sr-row sr-space-between sr-align-center">
                    <div>{t('freeze.amount')}</div>
                    <div className="sr-number-md">{val.toLocaleString()} TRX</div>
                </div>

                {/* 进度条（相对可用余额） */}
                <div className="sr-progress">
                    <div className="sr-progress__bar" style={{ width: `${percent}%` }} />
                </div>

                {/* ⭐ 滑块：上限=可用余额（TRX） */}
                <input
                    className="sr-range"
                    type="range"
                    min={0}
                    max={usable}
                    step={1}
                    value={val}
                    onChange={(e) => onSlide(Number(e.target.value || 0))}
                />

                {/* 精确输入 + 快捷按钮 */}
                <div className="sr-row sr-gap-8 sr-align-center">
                    <input
                        className="sr-input"
                        style={{ textAlign: 'center' }}
                        type="number"
                        min={0}
                        max={usable}
                        step={1}
                        value={val}
                        onChange={(e) => onChangeVal(Number(e.target.value || 0))}
                    />
                    <button className="sr-btn" onClick={() => onSlide(0)}>0</button>
                    <button className="sr-btn" onClick={() => onSlide(Math.floor(usable / 2))}>{t('freeze.half')}</button>
                    <button className="sr-btn" onClick={() => onSlide(usable)}>{t('freeze.max')}</button>
                </div>

                {/* 操作行：左侧失败提示，右侧提交 */}
                <div className="sr-row sr-gap-16 sr-align-center" style={{ justifyContent: 'flex-end' }}>
                    {errMsg ? (
                        <span className="sr-badge danger" style={{ marginRight: 'auto' }}>
              {errMsg}
            </span>
                    ) : null}

                    <button
                        className="sr-btn primary"
                        onClick={openConfirm}
                        disabled={state.freezing || val <= 0}
                    >
                        {t('freeze.submit')}
                    </button>
                </div>
            </div>

            {/* 二次确认弹窗（TRX 显示） */}
            <ConfirmFreezeModal
                open={confirmOpen}
                amountTRX={val}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={doFreeze}
            />
        </div>
    )
}
