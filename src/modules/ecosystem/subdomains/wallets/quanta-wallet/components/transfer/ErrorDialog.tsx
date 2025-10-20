import React from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/transfer.css'

export default function ErrorDialog({
  titleKey = 'transferFailed',
  message,
  onClose,
  primaryTextKey = 'close',
}: {
  titleKey?: string
  message: string
  onClose: () => void
  primaryTextKey?: string
}) {
  const { t } = useTranslation(['wallet']);
  
  return (
    <div className="modal-overlay modal-overlay--error" role="dialog" aria-modal="true">
      <div className="modal-content modal-content--error">
        <h3>{t(titleKey)}</h3>
        <p className="small-muted" style={{ marginTop: 6 }}>{message}</p>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn primary" onClick={onClose}>{t(primaryTextKey)}</button>
        </div>
      </div>
    </div>
  )
}