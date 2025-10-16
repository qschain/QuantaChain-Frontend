import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function TxResultModal({
                                          open, trxHash, onClose,
                                      }: { open: boolean; trxHash?: string; onClose(): void }) {
    const { t } = useTranslation('sr')
    const nav = useNavigate()
    if (!open) return null

    const copy = async () => {
        if (!trxHash) return
        try { await navigator.clipboard.writeText(trxHash); alert(t('toast.copyOk')) } catch {}
    }
    const go = () => { if (trxHash) nav(`/ecosystem/explorer/tx/${trxHash}`) }

    return (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:99, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="sr-panel" style={{ width:520, maxWidth:'92%' }}>
                <div className="sr-panel__head"><div className="sr-panel__title">{t('resultModal.title')}</div></div>
                <div className="sr-col sr-gap-16">
                    <div>{t('resultModal.hash')}：</div>
                    {trxHash ? (
                        <a
                            className="sr-link"
                            style={{ wordBreak:'break-all' }}
                            onClick={go}
                        >
                            {trxHash}
                        </a>
                    ) : (
                        <code style={{ background:'#0f141a', border:'1px solid #1f2a37', padding:'10px 12px', borderRadius:10, wordBreak:'break-all' }}>-</code>
                    )}
                    <div className="sr-row sr-gap-16" style={{ justifyContent:'flex-end' }}>
                        <button className="sr-btn" onClick={copy} disabled={!trxHash}>{t('common.copy')}</button>
                        <button className="sr-btn" onClick={onClose}>{t('common.close')}</button>
                        <button className="sr-btn primary" onClick={go} disabled={!trxHash}>{t('common.viewTx')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


