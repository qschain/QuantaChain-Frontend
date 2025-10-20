import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSr } from '../../state/store'
import srApi from '../../shared/api/srApi'
import { useSession } from '../../../../../../app/session/PlatformSessionProvider'
import ConfirmFreezeModal from './ConfirmFreezeModal'


type Props = { onAfterSuccess?: () => void | Promise<void> }

export default function FreezePanel({ onAfterSuccess }: Props) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const { user } = useSession()

    // 输入的冻结数量（单位：TRX）
    const [amount, setAmount] = React.useState<string>('')
    const amtNum = Number(amount || 0)

    // 资源类型：'0' 带宽 | '1' 能量（默认带宽）
    const [freezeType, setFreezeType] = React.useState<'0' | '1'>('0')

    // 二次确认弹窗
    const [openConfirm, setOpenConfirm] = React.useState(false)

    // 提交状态 & 错误
    const [submitting, setSubmitting] = React.useState(false)
    const [err, setErr] = React.useState<string>('')

    // 展示余额
    const balanceTRX = Number(state.account?.accountBalanceTRX ?? 0)

    const onHalf = () => setAmount(Math.max(0, balanceTRX / 2).toFixed(2))
    const onMax  = () => setAmount(Math.max(0, balanceTRX).toFixed(2))

    // 开启二次确认前的校验
    const canOpenConfirm = () => {
        setErr('')
        if (!user?.address) {
            setErr(t('freeze.failed', { defaultValue: '冻结失败' }))
            return false
        }
        if (!Number.isFinite(amtNum) || amtNum <= 0) {
            setErr(t('freeze.failed', { defaultValue: '冻结失败' }))
            return false
        }
        return true
    }

    // 提交冻结
    const submitFreeze = async () => {
        if (!user?.address) return
        try {
            setSubmitting(true)
            // postFreeze 内部会把 TRX→SUN，并携带 typecode
            const hash = await srApi.postFreeze(user.address, amtNum, freezeType, true)
            // 记录交易哈希，触发结果弹窗
            dispatch({ type: 'setTxHash', payload: { freeze: hash } })
            // 清空输入、关闭确认框
            setAmount('')
            setOpenConfirm(false)
            // 刷新账户/列表/冻结总量（由父层传入）
            await onAfterSuccess?.()
        } catch (e: any) {
            setErr(e?.message || t('freeze.failed', { defaultValue: '冻结失败' }))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="sr-panel">
            <div className="sr-panel__head">
                <div className="sr-panel__title">{t('freeze.title')}</div>
            </div>

            {/* 可用余额 */}
            <div className="sr-row sr-space-between sr-align-center" style={{ marginBottom: 8 }}>
                <div className="sr-muted">{t('freeze.balance')}</div>
                <div className="sr-number-md">{balanceTRX.toLocaleString()} TRX</div>
            </div>

            {/* 资源类型开关（iOS风格）：左=带宽(0)，右=能量(1) */}
            <div className="sr-row sr-space-between sr-align-center" style={{ marginBottom: 8 }}>
                <div className="sr-muted">{t('freeze.type', { defaultValue: '资源类型' })}</div>
                <button
                    type="button"
                    className="sr-toggle"
                    data-checked={freezeType === '1'}
                    onClick={() => setFreezeType(prev => (prev === '0' ? '1' : '0'))}
                    aria-checked={freezeType === '1'}
                    role="switch"
                >
                    <span className="sr-toggle-label left">{t('freeze.bandwidth', { defaultValue: '带宽' })}</span>
                    <span className="sr-toggle-label right">{t('freeze.energy', { defaultValue: '能量' })}</span>
                    <i className="sr-toggle-thumb" />
                </button>
            </div>

            {/* 输入数量 */}
            <div className="sr-row sr-gap-8 sr-align-center">
                <input
                    className="sr-input"
                    type="number"
                    min={0}
                    step="any"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ textAlign: 'center' }}
                />
                <button className="sr-btn" onClick={onHalf}>{t('freeze.half')}</button>
                <button className="sr-btn" onClick={onMax}>{t('freeze.max')}</button>
            </div>

            {/* 错误提示 + 提交按钮（提示靠近按钮） */}
            <div className="sr-row sr-space-between sr-align-center" style={{ marginTop: 12 }}>
                <div className="sr-badge danger" style={{ visibility: err ? 'visible' : 'hidden' }}>
                    {err || '·'}
                </div>
                <div className="sr-row sr-gap-8">
                    <button
                        className="sr-btn primary"
                        disabled={submitting}
                        onClick={() => { if (canOpenConfirm()) setOpenConfirm(true) }}
                    >
                        {t('freeze.submit')}
                    </button>
                </div>
            </div>

            {/* ✅ 使用你提供的 ConfirmFreezeModal */}
            <ConfirmFreezeModal
                open={openConfirm}
                amountTRX={amtNum}
                typeCode={freezeType}
                submitting={submitting}
                onCancel={() => setOpenConfirm(false)}
                onConfirm={submitFreeze}
            />
        </div>
    )
}
