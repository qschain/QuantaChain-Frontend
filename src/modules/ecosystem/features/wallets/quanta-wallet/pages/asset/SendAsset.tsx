import Card from '../../components/Card'
import { useEffect, useState } from 'react'
import { api } from '../../../../../../../services/api'
import { useTranslation } from 'react-i18next'
import i18n from '../../../../../../../core/i18n/i18n'

export default function SendAsset() {
    const [balance, setBalance] = useState(12.543)
    const [fee, setFee] = useState<{fee:number; fiat:number}>({fee:0.002, fiat:5.8})
    const { t } = useTranslation(['wallet'])

    useEffect(()=>{ api.quoteWithdraw('eth','erc20',0.1).then(r=>setFee({fee:r.fee, fiat:r.fiat}))},[])

    const locale = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US'

    return (
        <div className="container">
            <Card title={t('sendAsset.title')}>
                <div className="grid" style={{gap:14, maxWidth:720}}>
                    <div>
                        <div className="mb-2">{t('sendAsset.recipient')}</div>
                        <input className="input" placeholder={t('sendAsset.recipient.placeholder')} />
                    </div>
                    <div className="row" style={{gap:14}}>
                        <div style={{flex:2}}>
                            <div className="mb-2">{t('sendAsset.asset')}</div>
                            <select className="select"><option>Ethereum (ETH)</option></select>
                        </div>
                        <div style={{flex:1}}>
                            <div className="mb-2">{t('sendAsset.amount')}</div>
                            <input className="input" placeholder="0.00" />
                        </div>
                    </div>
                    <div className="row space-between secondary">
                        <div>{t('sendAsset.balance')}：{balance} ETH</div>
                        <div>{t('sendAsset.estimatedFee')} ≈ {fee.fee} ETH ({fee.fiat.toLocaleString(locale,{style:'currency',currency:'USD'})})</div>
                    </div>
                    <button className="btn">{t('continue')}</button>
                </div>
            </Card>
        </div>
    )
}
