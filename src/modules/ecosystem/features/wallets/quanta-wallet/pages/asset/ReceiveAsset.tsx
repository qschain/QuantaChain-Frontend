import Card from '../../components/Card'
import QRCodePlaceholder from '../../components/QRCodePlaceholder'
import { api } from '../../../../../../../services/api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ReceiveAsset() {
    const [addr, setAddr] = useState('0x1234...kLmN')
    const { t } = useTranslation(['wallet'])
    useEffect(()=>{ api.getDepositAddress('eth','erc20').then(r=>setAddr(r.address)) },[])
    return (
        <div className="grid" style={{gridTemplateColumns:'1fr 340px', gap:'var(--space-6)'}}>
            <Card title={t('receiveAsset.title')}>
                <div className="row" style={{gap:14, maxWidth:820}}>
                    <div style={{flex:1}}>
                        <div className="mb-2">{t('receiveAsset.selectType')}</div>
                        <select className="select"><option>Crypto</option></select>
                    </div>
                    <div style={{flex:1}}>
                        <div className="mb-2">{t('receiveAsset.selectNetwork')}</div>
                        <select className="select"><option>Ethereum</option></select>
                    </div>
                </div>

                <div className="mt-6" style={{maxWidth:820}}>
                    <div className="mb-2">{t('receiveAsset.yourAddress')}</div>
                    <div className="row">
                        <input className="input" readOnly value={addr}/>
                        <button className="btn secondary" onClick={()=>navigator.clipboard.writeText(addr)}>{t('receiveAsset.copy')}</button>
                    </div>
                    <div className="card" style={{marginTop:12}}>
                        <div className="badge yellow">{t('receiveAsset.securityTip')}</div>
                        <div className="secondary" style={{marginTop:6}}>{t('receiveAsset.securityDesc')}</div>
                    </div>
                </div>
            </Card>

            <div>
                <Card title={t('receiveAsset.qrTitle')}>
                    <div style={{display:'grid', placeItems:'center'}}>
                        <QRCodePlaceholder text={addr}/>
                        <button className="btn ghost" style={{marginTop:12}}>⬇ {t('receiveAsset.downloadQR')}</button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
