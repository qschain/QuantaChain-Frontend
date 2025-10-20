import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ConfirmFreezeModal({
                                               open,
                                               amountTRX,
                                               typeCode,
                                               submitting = false,
                                               onCancel,
                                               onConfirm,
                                           }: {
    open: boolean
    amountTRX: number
    typeCode: '0' | '1'
    submitting?: boolean
    onCancel(): void
    onConfirm(): void
}) {
    const { t } = useTranslation('sr')
    if (!open) return null

    const amountFormatted = Number(amountTRX || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
    })

    return (
        <div
            className="sr-modal-overlay"
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,.55)',
                zIndex: 200,
                backdropFilter: 'blur(4px)',
            }}
        >
            <div
                className="sr-panel sr-fade-in"
                style={{
                    width: 420,
                    maxWidth: '92%',
                    background: '#101419',
                    border: '1px solid var(--sr-line)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,.5)',
                    padding: '24px 28px',
                    textAlign: 'left',
                }}
            >
                <div className="sr-panel__head" style={{ marginBottom: 12 }}>
                    <div className="sr-panel__title" style={{ fontSize: 18, fontWeight: 700 }}>
                        {t('freezeConfirm.title')}
                    </div>
                </div>

                <div className="sr-col sr-gap-16">
                    <div className="sr-row sr-space-between">
                        <div className="sr-muted">{t('freezeConfirm.qty')}</div>
                        <div className="sr-number-xl">{amountFormatted} TRX</div>
                    </div>

                    <div className="sr-row sr-space-between">
                        <div className="sr-muted">{t('freezeConfirm.type')}</div>
                        <div className="sr-number-md">
                            {typeCode === '0'
                                ? t('freeze.bandwidth', { defaultValue: '带宽' })
                                : t('freeze.energy', { defaultValue: '能量' })}
                        </div>
                    </div>

                    <div className="sr-muted" style={{ fontSize: 12 }}>
                        {t('freezeConfirm.note')}
                    </div>

                    <div
                        className="sr-row sr-gap-16"
                        style={{ justifyContent: 'flex-end', marginTop: 8 }}
                    >
                        <button
                            className="sr-btn"
                            onClick={onCancel}
                            disabled={submitting}
                            style={{ minWidth: 80 }}
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            className="sr-btn primary"
                            onClick={onConfirm}
                            disabled={submitting}
                            style={{ minWidth: 80 }}
                        >
                            {submitting ? t('common.confirm') + '…' : t('common.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
