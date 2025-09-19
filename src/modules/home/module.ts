import type { ModuleDefinition } from '../../app/registry/types';
import { routes } from './routes';
import zh from './shared/i18n/zh.json';
import en from './shared/i18n/en.json';

const HomeModule: ModuleDefinition = {
    id: 'home',
    title: '首页',
    basePath: '/home',
    routes,
    i18n: [{ ns: 'home', resources: { zh, en } }]
};
export default HomeModule;
