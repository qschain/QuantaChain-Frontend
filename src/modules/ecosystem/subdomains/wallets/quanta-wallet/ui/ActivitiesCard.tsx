import Card from '../components/Card'
import { useDashboardData } from '../model/DashboardContext'
import { useTranslation } from 'react-i18next'

export default function ActivitiesCard(){
    const { activities } = useDashboardData()
    const { t } = useTranslation(['wallet'])

    const activityTypeText = (type: '接收'|'发送'|'兑换') =>
        type === '接收' ? t('activity.receive') :
            type === '发送' ? t('activity.send') :
                t('activity.swap')

    return (
        <Card title={t('latestActivities')} right={<button className="btn ghost">{t('all')} ▾</button>}>
            <div className="grid" style={{gap:10}}>
                {activities.map((a, i)=>(
                    <div key={i} className="row space-between card" style={{padding:'12px 14px', background:'var(--bg-surface)'}}>
                        <div className="row" style={{gap:10}}>
                            <span className={`badge ${a.type==='接收'?'green':a.type==='发送'?'':'blue'}`}>{activityTypeText(a.type)}</span>
                            <div className="secondary">{a.time}</div>
                        </div>
                        <div className={a.delta?.includes('+')?'green-text':'red-text'}>{a.delta || a.amount}</div>
                    </div>
                ))}
                <div style={{textAlign:'center'}} className="secondary">{t('loadMoreActivities')}</div>
            </div>
        </Card>
    )
}
