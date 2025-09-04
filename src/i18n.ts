// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

// 页面/功能命名空间（按需增减）
const NS = ['common'] as const

void i18n
    .use(HttpBackend)          // 懒加载 /locales/{{lng}}/{{ns}}.json
    .use(LanguageDetector)     // 检测浏览器&localStorage
    .use(initReactI18next)
    .init({
        fallbackLng: 'zh',
        supportedLngs: ['zh', 'en'],
        ns: NS as unknown as string[],
        defaultNS: 'common',
        load: 'languageOnly',
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        interpolation: {
            escapeValue: false, // React 已处理 XSS
        },
        react: {
            useSuspense: true, // 懒加载语言资源时配合 Suspense
        },
        debug: import.meta.env.DEV,
    })

export default i18n