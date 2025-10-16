import React from 'react'
import { useTranslation } from 'react-i18next'
import type { SRItem } from '../state/types'
import SRListItem from './SRListItem'



export default function SRList({ data, loading }: { data: SRItem[]; loading?: boolean }) {
    const { t } = useTranslation('sr')
    if (loading) return <SkeletonList />
    if (!data?.length) return <div className="sr-card">{t('common.empty')}</div>
    return (
        <div className="sr-col sr-gap-16 sr-fade-in">
            {data.map(it => <SRListItem key={it.address} item={it} />)}
        </div>
    )
}

function SkeletonList({ count = 6 }: { count?: number }) {
    return (
        <div className="sr-col sr-gap-16">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="sr-card sr-skeleton">
                    <div className="sr-row sr-space-between sr-align-center">
                        <div style={{ width: 220 }}>
                            <div className="sr-skel-line" style={{ width:'70%', height:16 }} />
                            <div className="sr-skel-line" style={{ width:'55%', height:12, marginTop:8 }} />
                        </div>
                        <div className="sr-row sr-gap-16" style={{ width: 360, maxWidth:'50%' }}>
                            <div className="sr-skel-line" style={{ width:80, height:18 }} />
                            <div className="sr-skel-line" style={{ width:100, height:18 }} />
                            <div className="sr-skel-pill" style={{ width:140, height:36 }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}


