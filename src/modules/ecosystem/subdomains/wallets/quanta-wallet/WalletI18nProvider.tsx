import { useEffect, type ReactNode } from 'react';
import { registerBundles } from '../../../../../shared/lib/i18n/i18n';

// 本地导入钱包命名空间资源
import wallet_en from './shared/i18n/en.json';
import wallet_zh from './shared/i18n/zh.json';

/** 进入钱包子应用时，动态注册 wallet 命名空间 */
export default function WalletI18nProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        registerBundles([
            { ns: 'wallet', resources: { en: wallet_en, zh: wallet_zh } }
        ]);
    }, []);

    return <>{children}</>;
}
