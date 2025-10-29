import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../../../../../../app/session/PlatformSessionProvider'

export default function AccountOverview() {
    const { t } = useTranslation(['wallet'])
    const { user, authed, loading } = useSession()

    const username = user?.name ?? ''
    const badge = (username?.[0] ?? 'U').toUpperCase()

    // 这些先保留占位；你有真实字段时再替换
    const userIdMasked = '0x1a2b...c34d'
    const phoneMasked = ''
    const emailMasked = ''

    return (
        <Card title={t('settings.accountOverview')}>
            <div className="row">
                <div className="badge">{badge}</div>
                <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 700 }}>
                        {loading ? '...' : (authed ? (username || '—') : t('actions.signIn'))}
                    </div>
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
