import {useTranslation} from "react-i18next";

export default function ConfirmUnfreezeModal({
                                                 open,
                                                 amountTRX,
                                                 onCancel,
                                                 onConfirm,
                                             }: {
    open: boolean
    amountTRX: number
    onCancel(): void
    onConfirm(): void
}) {
    const { t } = useTranslation('sr')
    if (!open) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,.55)',
                zIndex: 99,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="sr-panel" style={{ width: 420, maxWidth: '92%' }}>
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('unfreezeConfirm.title')}</div>
                </div>
                <div className="sr-col sr-gap-16">
                    <div className="sr-row sr-space-between">
                        <div>{t('unfreezeConfirm.qty')}</div>
                        <div className="sr-number-xl">
                            {Math.max(0, Math.floor(amountTRX)).toLocaleString()} TRX
                        </div>
                    </div>

                    <div className="sr-muted" style={{ fontSize: 12 }}>
                        {t('unfreezeConfirm.note')}
                    </div>

                    <div className="sr-row sr-gap-16" style={{ justifyContent: 'flex-end' }}>
                        <button className="sr-btn" onClick={onCancel}>
                            {t('common.cancel')}
                        </button>
                        <button className="sr-btn primary" onClick={onConfirm}>
                            {t('common.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
