import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 内置的“公共”命名空间（全局通用）
import enCommon from '../../i18n/en/common.json';
import zhCommon from '../../i18n/zh/common.json';

const resources = {
    en: { common: enCommon },
    zh: { common: zhCommon },
};

// 读取本地选择（默认 zh）
const saved = localStorage.getItem('lang') ?? 'zh';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        lng: saved,
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh'],
        ns: ['common'],
        defaultNS: 'common',
        interpolation: { escapeValue: false },
        detection: {
            // 先用本地存储；如无则尝试浏览器语言
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'lang',
        },
    });

/** 允许模块在运行时注入自己的词条 */
export function registerBundles(
    bundles: { ns: string; resources: { en?: any; zh?: any } }[]
) {
    bundles.forEach(({ ns, resources }) => {
        if (resources.en) i18n.addResourceBundle('en', ns, resources.en, true, true);
        if (resources.zh) i18n.addResourceBundle('zh', ns, resources.zh, true, true);
    });
}

/** 外部调用切换语言（并持久化） */
export function changeAppLanguage(lng: 'en' | 'zh') {
    localStorage.setItem('lang', lng);
    return i18n.changeLanguage(lng);
}

export default i18n;
