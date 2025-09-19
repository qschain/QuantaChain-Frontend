import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function AccountOverview(){
    const { t } = useTranslation(['wallet'])

    // 若后续接真实数据，可从 Session/用户接口读取
    const username = 'Username_123'
    const userIdMasked = '0x1a2b...c34d'
    const phoneMasked = '+86 18****8888'
    const emailMasked = 'user**@email.com'

    return (
        <Card title={t('settings.accountOverview')}>
            <div className="row">
                <div className="badge">U</div>
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 700 }}>{username}</div>
                    <div className="secondary">{t('account.userId')}: {userIdMasked}</div>
                </div>
            </div>

            <div className="grid" style={{ gap: 14, marginTop: 16 }}>
                <div className="row space-between">
                    <div>{t('account.avatar')}</div>
                    <button className="btn secondary">{t('actions.chooseFile')}</button>
                </div>

                <div className="row space-between">
                    <div>{t('account.changePassword')}</div>
                    <button className="btn secondary">{t('actions.change')}</button>
                </div>

                <div className="row space-between">
                    <div>{t('account.phone')}</div>
                    <div>
                        {phoneMasked} <button className="btn ghost">{t('actions.change')}</button>
                    </div>
                </div>

                <div className="row space-between">
                    <div>{t('account.email')}</div>
                    <div>
                        {emailMasked} <button className="btn ghost">{t('actions.change')}</button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
