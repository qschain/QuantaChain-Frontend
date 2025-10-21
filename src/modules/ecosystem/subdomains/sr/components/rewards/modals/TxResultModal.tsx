export default function TxResultModal({
                                          open,
                                          hash,
                                          onClose,
                                          onView,
                                          title,
                                          hashLabel,
                                          closeText,
                                          viewText,
                                          confirmText,
                                      }: {
    open: boolean
    hash: string
    onClose(): void
    onView(): void
    title: string
    hashLabel: string
    closeText: string
    viewText: string
    confirmText: string
}) {
    if (!open) return null
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,.55)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="sr-panel" style={{ width: 440, maxWidth: '92%' }}>
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{title}</div>
                    <button className="sr-btn ghost" onClick={onClose}>{closeText}</button>
                </div>
                <div className="sr-col sr-gap-16">
                    <div className="sr-row sr-space-between sr-align-center">
                        <div>{hashLabel}</div>
                        <div style={{ wordBreak: 'break-all', fontWeight: 700 }}>{hash}</div>
                    </div>
                    <div className="sr-row sr-gap-16" style={{ justifyContent: 'flex-end' }}>
                        <button className="sr-btn" onClick={onView}>{viewText}</button>
                        <button className="sr-btn primary" onClick={onClose}>{confirmText}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
