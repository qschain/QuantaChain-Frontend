export default function ProposalPreviewSkeleton() {
    return (
        <div className="sr-card sr-skeleton sr-prop-card">
            <div className="sr-row sr-space-between" style={{ marginBottom: 6 }}>
                <div className="sr-skel-pill" style={{ width: 80, height: 20 }} />
                <div className="sr-skel-pill" style={{ width: 70, height: 20 }} />
            </div>
            <div className="sr-skel-line" style={{ height: 18, margin: '6px 0' }} />
            <div className="sr-skel-line" style={{ height: 18, width: '70%', marginBottom: 10 }} />
            <div className="sr-skel-line" style={{ height: 10, width: '100%', marginBottom: 8 }} />
            <div className="sr-skel-line" style={{ height: 10, width: '60%', marginBottom: 34 }} />
            <div className="sr-skel-pill" style={{ width: 120, height: 28, position:'absolute', right:12, bottom:12 }} />
        </div>
    )
}
