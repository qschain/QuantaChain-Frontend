export default function MiniStatCard({
                                         title,
                                         value,
                                         loading,
                                         unit = '',
                                         actions,
                                     }: {
    title: string
    value?: string
    loading?: boolean
    unit?: string
    actions?: React.ReactNode
}) {
    return (
        <div className="sr-card">
            <div className="sr-muted">{title}</div>

            {loading ? (
                <div className="sr-skeleton" style={{ marginTop: 6 }}>
                    <div className="sr-skel-line" style={{ height: 28, width: '60%' }} />
                </div>
            ) : (
                <div className="sr-number-xl">
                    {value ?? '—'}
                    {value ? unit : ''}
                </div>
            )}

            {actions ? <div style={{ marginTop: 12 }}>{actions}</div> : null}
        </div>
    )
}
