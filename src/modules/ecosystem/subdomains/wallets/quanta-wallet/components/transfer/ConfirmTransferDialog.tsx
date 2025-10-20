// import React from 'react'
// import { useTranslation } from 'react-i18next'

// export default function ConfirmTransferDialog({
//     address,
//     amount,
//     onConfirm,
//     onCancel,
// }: {
//     address: string
//     amount: string
//     onConfirm: () => void
//     onCancel: () => void
// }) {
//     const { t } = useTranslation(['wallet'])

//     return (
//         <div className="modal-overlay" role="dialog" aria-modal="true">
//             <div className="modal-content">
//                 <h3>{t('confirmTransfer')}</h3>
//                 <p className="small-muted">{t('pleaseConfirmDetails')}</p>

//                 <div className="confirm-details">
//                     <div className="detail-row">
//                         <div className="label">{t('recipientAddress')}</div>
//                         <div className="address">{address}</div>
//                     </div>
//                     <div className="detail-row">
//                         <div className="label">{t('amount')}</div>
//                         <div>{amount}</div>
//                     </div>
//                 </div>

//                 <div className="modal-actions">
//                     <button className="btn secondary" onClick={onCancel}>
//                         {t('cancel')}
//                     </button>
//                     <button className="btn primary" onClick={onConfirm}>
//                         {t('confirm')}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }