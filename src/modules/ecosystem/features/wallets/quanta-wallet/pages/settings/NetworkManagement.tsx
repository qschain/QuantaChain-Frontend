import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function NetworkManagement(){
    const { t } = useTranslation(['wallet'])

    return (
        <Card title={t('settings.networkManagement')}>
            <div className="grid" style={{ gap: 14 }}>
                <div className="row space-between">
                    <div>{t('network.ethMainnet')}（{t('network.chainId', { id: 1 })}）</div>
                    <button className="btn">{t('network.switch')}</button>
                </div>

                <div className="row space-between">
                    <div>{t('network.bsc')}（{t('network.chainId', { id: 56 })}）</div>
                    <button className="btn secondary">{t('network.switch')}</button>
                </div>

                <div className="row space-between">
                    <div>{t('network.polygon')}（{t('network.chainId', { id: 137 })}）</div>
                    <button className="btn secondary">{t('network.switch')}</button>
                </div>

                <button className="btn ghost">+ {t('network.addCustom')}</button>
            </div>
        </Card>
    )
}
