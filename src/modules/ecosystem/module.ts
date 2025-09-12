
import type { ModuleDefinition } from '../../app/registry/types';
import { routes } from './routes';
import zhWallets from './features/wallets/i18n/zh.json';
import enWallets from './features/wallets/i18n/en.json';
import zhExplorer from './features/explorer/i18n/zh.json';
import enExplorer from './features/explorer/i18n/en.json';
import zhSr from './features/sr/i18n/zh.json';
import enSr from './features/sr/i18n/en.json';

const EcosystemModule: ModuleDefinition = {
    id: 'ecosystem',
    title: '生态模块',
    basePath: '/ecosystem',
    routes,
    i18n: [
        { ns: 'wallets',  resources: { zh: zhWallets,  en: enWallets  } },
        { ns: 'explorer', resources: { zh: zhExplorer, en: enExplorer } },
        { ns: 'sr',       resources: { zh: zhSr,       en: enSr       } },
    ],
};

export default EcosystemModule;
