import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function FooterBar() {
    const { t } = useTranslation(['wallet'])
    const [time, setTime] = useState<string>('')

    // 实时更新时间
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const formatted = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
            setTime(formatted)
        }

        updateTime() // 初始化
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <footer className="footer">
            <div className="footer-left">
                {t('systemStatus')}：
                <span className="badge green">{t('operational')}</span>
                &emsp;{t('lastSync')}：{time}
            </div>

            <div className="footer-right">
                {t('productName')} v1.0.0&nbsp;
                <span className="badge blue">{t('securityCertified')}</span>
                <span className="badge" style={{ marginLeft: 6 }}>
          {t('multiChainSupport')}
        </span>
                <span className="badge green" style={{ marginLeft: 6 }}>
          {t('quantumEncryption')}
        </span>
            </div>
        </footer>
    )
}
