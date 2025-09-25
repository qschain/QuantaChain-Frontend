// src/pages/asset/SendAsset.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TransferForm from '../../components/transfer/TransferForm'
import PasswordConfirmDialog from '../../components/transfer/PasswordConfirmDialog'
import ResultDialog from '../../components/transfer/ResultDialog'
import ErrorDialog from '../../components/transfer/ErrorDialog'
import useTransfer from '../../hooks/useTransfer'

export default function SendAsset() {
  const { t } = useTranslation(['wallet'])
  const { handleTransfer, loading, error, success } = useTransfer()

  // 地址/金额确认后的待提交数据（控制密码弹窗开关）
  const [pending, setPending] = useState<{ address: string; amount: string } | null>(null)

  // 错误弹窗
  const [errOpen, setErrOpen] = useState(false)
  const [errMsg, setErrMsg] = useState<string>('')

  return (
    <div className="card send-card">
      <h2>{t('send')}</h2>

      <TransferForm
        onSubmit={(v) => { setPending(v) }}
        loading={loading}
        error={error || undefined}
      />

      {/* 密码确认弹窗：失败时不关闭 */}
      {pending && (
        <PasswordConfirmDialog
          address={pending.address}
          amount={pending.amount}
          loading={loading}
          serverError={undefined}          // 错误不在此处显示，改为 ErrorDialog
          onCancel={() => setPending(null)}
          onConfirm={async (password) => {
            const res = await handleTransfer(pending.address, pending.amount, password)
            if (res.ok) {
              // ✅ 成功才关闭密码弹窗
              setPending(null)
            } else {
              // ❌ 失败：保留密码弹窗 + 叠加错误弹窗
              setErrMsg(res.error || t('transferFailed') || 'Transfer failed')
              setErrOpen(true)
            }
          }}
        />
      )}

      {/* 失败错误弹窗（叠在最上层） */}
      {errOpen && (
        <ErrorDialog
          title={t('transferFailed') || 'Transfer Failed'}
          message={errMsg}
          onClose={() => setErrOpen(false)}   // 仅关闭错误层，不关密码弹窗
          primaryText={t('close') || 'Close'}
        />
      )}

      {/* 成功结果弹窗：展示转账前/后余额 */}
      {success && (
        <ResultDialog
          title={t('transferSuccess') || 'Transfer Successful'}
          onClose={() => window.location.reload()}  // 或改为导航
          primaryText={t('gotIt') || 'Got it'}
        >
          <div className="confirm-details">
            <div className="detail-row"><div className="label">{t('amount') || 'Amount'}</div><div>{success.amount}</div></div>
            {success.burn && <div className="detail-row"><div className="label">Burn</div><div>{success.burn}</div></div>}
            <div className="detail-row"><div className="label">{t('beforeBalance') || 'Before balance'}</div><div>{success.beforeBalance}</div></div>
            <div className="detail-row"><div className="label">{t('laterBalance') || 'After balance'} </div><div>{success.laterBalance}</div></div>
          </div>
        </ResultDialog>
      )}
    </div>
  )
}
