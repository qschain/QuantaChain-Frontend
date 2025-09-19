import type { ModuleDefinition } from '../../app/registry/types';
import { routes } from './routes';
import zhWallets from './subdomains/wallets/shared/i18n/zh.json';
import enWallets from './subdomains/wallets/shared/i18n/en.json';
import zhExplorer from './subdomains/explorer/shared/i18n/zh.json';
import enExplorer from './subdomains/explorer/shared/i18n/en.json';
import zhSr from './subdomains/sr/shared/i18n/zh.json';
import enSr from './subdomains/sr/shared/i18n/en.json';
import zhDapps from './subdomains/dapps/i18n/zh.json';
import enDapps from './subdomains/dapps/i18n/en.json';
import zhBridge from './subdomains/bridge/i18n/zh.json';
import enBridge from './subdomains/bridge/i18n/en.json';
const EcosystemModule: ModuleDefinition = {
    id: 'ecosystem',
    title: '生态模块',
    basePath: '/ecosystem',
    routes,
    i18n: [
        { ns: 'wallets',  resources: { zh: zhWallets,  en: enWallets  } },
        { ns: 'explorer', resources: { zh: zhExplorer, en: enExplorer } },
        { ns: 'sr',       resources: { zh: zhSr,       en: enSr       } },
        { ns: 'dapps',     resources: { zh: zhDapps,    en: enDapps    } },
        { ns: 'bridge', resources: { zh: zhBridge, en: enBridge } }
    ],
};

export default EcosystemModule;
