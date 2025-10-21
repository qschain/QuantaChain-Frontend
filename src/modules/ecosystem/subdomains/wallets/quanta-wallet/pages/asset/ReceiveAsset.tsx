import Card from '../../components/Card'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../../../../../app/session/PlatformSessionProvider'
import QRCode from 'qrcode' // 需要：npm i qrcode

export default function ReceiveAsset() {
    const { t } = useTranslation(['wallet'])
    const { user } = useSession()

    // 1) 地址来自 SessionProvider
    const addr = user?.address ?? ''

    // 2) 受控选择（示例：Crypto + Ethereum/TRON，可按需扩展）
    const [assetType, setAssetType] = useState<'Crypto'>('Crypto')
    const [network, setNetwork] = useState<'Ethereum' | 'TRON'>('Ethereum')

    // 3) 按网络生成 QR 载荷
    //    - Ethereum：使用“ethereum:<address>”的 URI 形式（兼容多数钱包，EIP-681 简化版）
    //    - TRON：大多数钱包接受裸地址；也可用“tron:<address>”
    const qrPayload = useMemo(() => {
        if (!addr) return ''
        if (network === 'Ethereum') return `ethereum:${addr}`
        return `tron:${addr}` // 或者直接 addr
    }, [addr, network])

    // 4) 生成 DataURL 用于展示 & 下载
    const [qrUrl, setQrUrl] = useState<string>('')
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            if (!qrPayload) return setQrUrl('')
            const url = await QRCode.toDataURL(qrPayload, { margin: 1, width: 260 })
            if (!cancelled) setQrUrl(url)
        })()
        return () => {
            cancelled = true
        }
    }, [qrPayload])

    // 下载 QR 图片
    const downloadQR = () => {
        if (!qrUrl) return
        const a = document.createElement('a')
        a.href = qrUrl
        a.download = `receive-${network}.png`
        a.click()
    }

    return (
        <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
            <Card title={t('receiveAsset.title')}>
                <div className="row" style={{ gap: 14, maxWidth: 820 }}>
                    <div style={{ flex: 1 }}>
                        <div className="mb-2">{t('receiveAsset.selectType')}</div>
                        <select className="select" value={assetType} onChange={() => setAssetType('Crypto')}>
                            <option value="Crypto">Crypto</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div className="mb-2">{t('receiveAsset.selectNetwork')}</div>
                        <select
                            className="select"
                            value={network}
                            onChange={(e) => setNetwork(e.target.value as 'Ethereum' | 'TRON')}
                        >
                            <option value="Ethereum">Ethereum</option>
                            <option value="TRON">TRON</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6" style={{ maxWidth: 820 }}>
                    <div className="mb-2">{t('receiveAsset.yourAddress')}</div>
                    <div className="row">
                        <input className="input" readOnly value={addr} />
                        <button className="btn secondary" onClick={() => navigator.clipboard.writeText(addr)}>
                            {t('receiveAsset.copy')}
                        </button>
                    </div>

                    <div className="card" style={{ marginTop: 12 }}>
                        <div className="badge yellow">{t('receiveAsset.securityTip')}</div>
                        <div className="secondary" style={{ marginTop: 6 }}>
                            {t('receiveAsset.securityDesc')}
                        </div>
                    </div>
                </div>
            </Card>

            <div>
                <Card title={t('receiveAsset.qrTitle')}>
                    <div style={{ display: 'grid', placeItems: 'center' }}>
                        {qrUrl ? (
                            <img src={qrUrl} alt="Receive QR" style={{ width: 260, height: 260 }} />
                        ) : (
                            <div className="secondary" style={{ height: 260, display: 'grid', placeItems: 'center' }}>
                                {addr ? t('loading') : t('na')}
                            </div>
                        )}
                        <button className="btn ghost" style={{ marginTop: 12 }} onClick={downloadQR}>
                            ⬇ {t('receiveAsset.downloadQR')}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
