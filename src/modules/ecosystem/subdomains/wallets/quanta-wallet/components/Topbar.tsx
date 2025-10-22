import { useTranslation } from 'react-i18next'
import i18n from '../../../../../../shared/lib/i18n/i18n'
import { useCallback, useState } from 'react'

export default function Topbar() {
    const { t } = useTranslation(['wallet'])
    const isZh = i18n.language?.startsWith('zh')

    // 可选：回车触发搜索（不改你的 API，这里只做演示）
    const [q, setQ] = useState('')
    const onSearch = useCallback(() => {
        // TODO: 调用你的搜索逻辑
        // console.log('search:', q)
    }, [q])

    return (
        <header className="topbar" role="banner">
            {/* 左：搜索区 */}
            <div className="search" role="search">
                <input
                    className="input"
                    placeholder={t('searchPlaceholder')}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    aria-label={t('search')}
                />
                <button className="btn secondary" onClick={onSearch}>
                    {t('search')}
                </button>
            </div>

            {/* 右：状态/操作区 */}
            <div className="row">
                <span className="badge green">{t('mainNetworkConnected')}</span>

                <button className="btn secondary">
                    {t('quickActions')}
                </button>

                <button
                    className="btn ghost"
                    title={t('language')}
                    onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
                    aria-label={t('language')}
                >
                    {isZh ? '中文' : 'EN'}
                </button>

                {/* 用户徽标（占位） */}
                <div className="badge" aria-label={t('profile')}>U</div>
            </div>
        </header>
    )
}
