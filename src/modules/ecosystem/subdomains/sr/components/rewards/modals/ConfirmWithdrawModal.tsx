export default function ConfirmWithdrawModal({
                                                 open,
                                                 amountTRX,
                                                 onCancel,
                                                 onConfirm,
                                                 title,
                                                 desc,
                                                 cancelText,
                                                 confirmText,
                                                 pendingLabel,
                                             }: {
    open: boolean
    amountTRX: number
    onCancel(): void
    onConfirm(): void
    title: string
    desc: string
    cancelText: string
    confirmText: string
    pendingLabel: string
}) {
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
                    <div className="sr-panel__title">{title}</div>
                </div>
                <div className="sr-col sr-gap-16">
                    <div className="sr-row sr-space-between">
                        <div>{pendingLabel}</div>
                        <div className="sr-number-xl">
                            {amountTRX.toLocaleString(undefined, { maximumFractionDigits: 6 })} TRX
                        </div>
                    </div>
                    <div className="sr-muted" style={{ fontSize: 12 }}>{desc}</div>
                    <div className="sr-row sr-gap-16" style={{ justifyContent: 'flex-end' }}>
                        <button className="sr-btn" onClick={onCancel}>{cancelText}</button>
                        <button className="sr-btn primary" onClick={onConfirm}>{confirmText}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
