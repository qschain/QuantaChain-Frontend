import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function PrivacySecurity(){
    const { t } = useTranslation()
    return (
        <Card title={t('settings.privacySecurity')}>
            <div className="grid" style={{gap:12}}>
                <label className="row space-between">
                    <span>{t('security.twoFactor')}</span>
                    <button className="btn ghost">{t('actions.configure')}</button>
                </label>
                <label className="row space-between">
                    <span>{t('security.loginAlerts')}</span>
                    <button className="btn ghost">{t('actions.enable')}</button>
                </label>
                <div className="row" style={{gap:8}}>
                    <button className="btn">{t('actions.saveChanges')}</button>
                    <button className="btn ghost">{t('actions.resetDefault')}</button>
                </div>
            </div>
        </Card>
    )
}
