import type { ModuleDefinition } from '../../app/registry/types';
import { routes } from './routes';

const DeveloperModule: ModuleDefinition = {
    id: 'developer',
    title: '开发者',
    basePath: '/dev',
    routes,
};
export default DeveloperModule;
