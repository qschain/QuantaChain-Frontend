import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function Notifications(){
    const { t } = useTranslation(['wallet'])
    return (
        <Card title={t('settings.notifications')}>
            <div className="grid" style={{gap:12}}>
                <label className="row space-between">
                    <span>{t('notify.priceAlerts')}</span>
                    <button className="btn ghost">{t('actions.enable')}</button>
                </label>
                <label className="row space-between">
                    <span>{t('notify.txUpdates')}</span>
                    <button className="btn ghost">{t('actions.manage')}</button>
                </label>
            </div>
        </Card>
    )
}
