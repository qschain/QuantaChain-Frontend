import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSr } from '../state/store'
import srApi from '../shared/api/srApi'
import { useSession } from '../../../../../app/session/PlatformSessionProvider'
import ConfirmFreezeModal from './ConfirmFreezeModal'


export default function FreezePanel({ onAfterSuccess }: { onAfterSuccess?: () => void }) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const { user } = useSession()

    const [val, setVal] = useState(0)          // 输入（单位：TRX）
    const [errMsg, setErrMsg] = useState('')   // 失败/校验提示，显示在按钮旁
    const [confirmOpen, setConfirmOpen] = useState(false)
    const max = Number(state.account?.accountBalanceTRX ?? 0)

    const openConfirm = () => {
        const amount = Math.max(0, Math.floor(val))
        if (amount <= 0) {
            setErrMsg(t('freeze.failed', { defaultValue: '请输入有效数量' }))
            return
        }
        setErrMsg('')
        setConfirmOpen(true)
    }

    // ✅ 修改：真正发起冻结交易（在二次确认弹窗里点击“确认”时触发）
    const onFreeze = async () => {
        if (!user?.address) return
        const amount = Math.max(0, Math.floor(val))
        if (amount <= 0) {
            setErrMsg(t('freezeConfirm.invalid', { defaultValue: '请输入有效数量' }))
            setConfirmOpen(false)
            return
        }

        try {
            setErrMsg('')
            dispatch({ type: 'setFreezing', payload: true })
            setConfirmOpen(false) // 关闭确认弹窗

            // ✅ 接口单位为 SUN，1 TRX = 1,000,000 SUN
            const freezeAmountSUN = amount * 1_000_000

            // 提交交易（后端返回 txnHash / trxHash / hash，srApi 内部已兼容）
            const hash = await srApi.postFreeze(user.address, freezeAmountSUN, true)

            // 派发到全局，交由 TxResultModal 展示（并可点击跳详情）
            dispatch({ type: 'setTxHash', payload: { freeze: hash } })

            // 成功后刷新账户/列表（由外层传入，避免强耦合）
            if (typeof onAfterSuccess === 'function') {
                await onAfterSuccess()
            }
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'freeze error' })
            setErrMsg(e?.message || t('freeze.failed'))
        } finally {
            dispatch({ type: 'setFreezing', payload: false })
        }
    }

    // 输入变化时清理错误提示
    const onChangeVal = (n: number) => {
        setVal(n)
        if (errMsg) setErrMsg('')
    }

    return (
        <div className="sr-panel">
            <div className="sr-panel__head">
                <div className="sr-panel__title">{t('freeze.title')}</div>
            </div>

            <div className="sr-col sr-gap-16">
                <div className="sr-muted" style={{ fontSize: 12 }}>
                    {t('freeze.balance')}：{max.toLocaleString()} TRX
                </div>

                <input
                    className="sr-input"
                    type="number"
                    min={0}
                    step={1}
                    value={val}
                    onChange={(e) => onChangeVal(Number(e.target.value || 0))}
                />

                <div className="sr-row sr-gap-16 sr-align-center" style={{ justifyContent: 'flex-end' }}>
                    {/* ❗冻结失败提示：与按钮同一行，紧靠左侧 */}
                    {errMsg ? (
                        <span className="sr-badge danger" style={{ marginRight: 'auto' }}>
              {errMsg}
            </span>
                    ) : null}

                    <button className="sr-btn" onClick={() => onChangeVal(Math.floor(max / 2))}>
                        {t('freeze.half')}
                    </button>
                    <button className="sr-btn" onClick={() => onChangeVal(Math.floor(max))}>
                        {t('freeze.max')}
                    </button>

                    <button
                        className="sr-btn primary"
                        onClick={openConfirm}
                        disabled={state.freezing || val <= 0}
                    >
                        {t('freeze.submit')}
                    </button>
                </div>
            </div>

            <ConfirmFreezeModal
                open={confirmOpen}
                amountTRX={val}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={onFreeze}
            />
        </div>
    )
}
