// src/pages/atlas/RegionOverview.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import { getRegionMetrics, type RegionMetrics } from '../../shared/api/atlas'
import { useTranslation } from 'react-i18next'
import i18n from '../../../../../../../shared/lib/i18n/i18n'

export default function RegionOverview() {
    const { region = '' } = useParams()
    const [data, setData] = useState<RegionMetrics | null>(null)
    const nav = useNavigate()
    const { t } = useTranslation(['wallet'])

    useEffect(()=>{ getRegionMetrics(region).then(setData) }, [region])

    if (!data) return <div className="container"><Card title={t('loading')}>{t('loadingRegionData', { region })}</Card></div>

    const nf = new Intl.NumberFormat(i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US')

    return (
        <div className="container" style={{maxWidth:1200}}>
            <Card title={`${data.name} · ${t('region.overview')}`} right={<button className="btn ghost" onClick={()=>nav('/wallet/atlas')}>{t('globe.backToMap')}</button>}>
                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)'}}>
                    <MetricCard title={t('region.accounts')} value={nf.format(data.accounts)} />
                    <MetricCard title={t('region.txCount')}   value={nf.format(data.txCount)} />
                    <MetricCard title={t('region.transferVolume')} value={`$${nf.format(data.transferVolumeUSD)}`} />
                    <MetricCard title={t('region.tvl')}    value={`$${nf.format(data.tvlUSD)}`} />
                </div>
            </Card>
        </div>
    )
}

function MetricCard({title, value}:{title:string; value:string}) {
    return (
        <div className="card" style={{height:260, display:'grid', placeItems:'center', textAlign:'center'}}>
            {/* 你可以在这里插入你的 3D/插画小岛图片 */}
            <div>
                <div style={{fontWeight:800, fontSize:18, marginBottom:8}}>{title}</div>
                <div style={{fontSize:20}} className="secondary">{value}</div>
            </div>
        </div>
    )
}
