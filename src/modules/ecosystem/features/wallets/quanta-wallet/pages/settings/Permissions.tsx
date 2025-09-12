import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function Permissions(){
    const { t } = useTranslation(['wallet'])
    return (
        <Card title={t('settings.permissions')}>
            <div className="grid" style={{gap:12}}>
                <div className="row space-between">
                    <div>{t('permissions.readBalances')}</div>
                    <button className="btn ghost">{t('actions.revoke')}</button>
                </div>
                <div className="row space-between">
                    <div>{t('permissions.submitTransactions')}</div>
                    <button className="btn ghost">{t('actions.grant')}</button>
                </div>
            </div>
        </Card>
    )
}
