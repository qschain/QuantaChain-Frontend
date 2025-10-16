import React from 'react'
import { useSr } from '../state/store'
import { nf } from '../shared/format'
import {useTranslation} from "react-i18next";

export default function SRDetailDrawer() {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const it = state.selected
    if (!state.detailOpen || !it) return null

    return (
        <div className="sr-detail-overlay">
            <div className="sr-detail-panel">
                <div className="sr-detail-head">
                    <div>
                        <div className="sr-detail-title">{it.name}</div>
                        <div className="sr-detail-address">{it.address}</div>
                    </div>
                    <button className="sr-btn ghost" onClick={() => dispatch({ type: 'closeDetail' })}>{t('common.close')}</button>
                </div>

                <div className="sr-detail-grid">
                    <InfoItem label={t('detail.rank', { defaultValue: '排名' })} value={it.realTimeRanking} />
                    <InfoItem label={t('list.realtimeVotes')} value={nf(it.realTimeVotes)} />
                    <InfoItem label={t('detail.change', { defaultValue: '变动票' })} value={nf(it.changeVotes)} />
                    <InfoItem label={t('detail.brokerage', { defaultValue: '佣金' })} value={`${it.brokerage ?? 0}%`} />
                    <InfoItem label={t('detail.voterBrokerage', { defaultValue: '投票分成' })} value={`${it.voterBrokerage ?? 0}%`} />
                    <InfoItem label={t('list.annualized')} value={`${Number(it.annualizedRate || 0).toFixed(3)}%`} />
                    <InfoItem label={t('detail.producedTotal', { defaultValue: '生产总量' })} value={nf(it.producedTotal)} />
                    <InfoItem label={t('detail.producedEfficiency', { defaultValue: '出块效率' })} value={`${it.producedEfficiency?.toFixed?.(2) ?? 0}%`} />
                    <InfoItem label={t('detail.version', { defaultValue: '版本号' })} value={it.version} />
                    <InfoItem label="URL" value={<a href={it.url} className="sr-link" target="_blank" rel="noreferrer">{it.url}</a>} />
                    <InfoItem label={t('detail.hasPage', { defaultValue: '有详情页' })} value={it.hasPage ? t('common.confirm', { defaultValue: '是' }) : t('common.cancel', { defaultValue: '否' })} />
                </div>
            </div>
        </div>
    )
}

function InfoItem({ label, value }: { label: string; value: any }) {
    return (
        <div className="sr-detail-item">
            <div className="label">{label}</div>
            <div className="value">{value ?? '-'}</div>
        </div>
    )
}

