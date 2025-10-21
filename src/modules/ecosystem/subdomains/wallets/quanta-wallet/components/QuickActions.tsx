import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
export default function QuickActions(){
    const { t } = useTranslation(['wallet'])
    const nav = useNavigate()
    return (
        <div className="row" style={{gap:12, flexWrap:'wrap'}}>
            <button className="btn" onClick={()=>nav('../asset/send')}>▶ {t('send')}</button>
            <button className="btn" onClick={()=>nav('../asset/receive')}>📥{t('receive')}</button>
            <button className="btn secondary" onClick={()=>nav('../swap')}>⭢ {t('activity.swap')}</button>
            <button className="btn secondary" onClick={()=>nav('../bridge')}>🌉 {t('activity.bridge')}</button>
            <button className="btn ghost" onClick={()=>nav('../dapps')}>🧩 {t('dapp')}</button>
            <button className="btn ghost" onClick={()=>nav('../settings')}>👤 {t('personal')}</button>
        </div>
    )
}
