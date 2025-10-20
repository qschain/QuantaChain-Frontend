import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/transfer.css'

export default function PasswordConfirmDialog({
  address,
  amount,
  onConfirm,
  onCancel,
  serverError,
  loading,
}: {
  address: string
  amount: string
  onConfirm: (password: string) => void
  onCancel: () => void
  serverError?: string | null
  loading?: boolean
}) {
  const { t } = useTranslation(['wallet'])
  const [pwd, setPwd] = useState('')

  const submit = () => onConfirm(pwd)

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>{t('confirmTransfer')}</h3>
        <p className="small-muted">{t('pleaseConfirmDetails')}</p>

        <div className="confirm-details" style={{marginBottom:12}}>
          <div className="detail-row"><div className="label">{t('recipientAddress')}</div><div className="address">{address}</div></div>
          <div className="detail-row"><div className="label">{t('amount')}</div><div>{amount}</div></div>
        </div>

        <div className="form-group" style={{gridTemplateColumns: '140px 1fr'}}>
          <label>{t('password')}</label>
          <input
            type="password"
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
            placeholder={t('enterPassword')}
          />
        </div>

        {serverError && <div className="error-message" style={{marginTop:10}}>{serverError}</div>}

        <div className="modal-actions" style={{marginTop:16}}>
          <button className="btn secondary" onClick={onCancel} disabled={loading}>{t('cancel')}</button>
          <button className="btn primary" onClick={submit} disabled={!pwd || loading}>
            {loading ? t('sending') : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}