import type { ModuleDefinition } from '../../app/registry/types';
import { routes } from './routes';

const TokenModule: ModuleDefinition = {
    id: 'token',
    title: '通证集成',
    basePath: '/token',
    routes,
};
export default TokenModule;
