import type { ModuleDefinition } from '../../app/registry/types';
import { routes } from './routes';
import zh from './i18n/zh.json';
import en from './i18n/en.json';

const AiModule: ModuleDefinition = {
    id: 'ai',
    title: 'AI探索',
    basePath: '/ai',
    routes,
    i18n: [
        { ns: 'ai', resources: { zh, en } }
    ],
    // 如需：providers、mswHandlers 可后续加
};

export default AiModule;
