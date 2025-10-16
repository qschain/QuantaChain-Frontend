import { registerModule } from './ModuleRegistry';

// 顶层模块：首页、生态、通证集成、开发者（后两者先占位）
registerModule('home',      () => import('../../modules/home/module'));
registerModule('ecosystem', () => import('../../modules/ecosystem/module'));
registerModule('token',     () => import('../../modules/token/module'));      // 占位
registerModule('developer', () => import('../../modules/developer/module'));  // 占位
registerModule('ai',        () => import('../../modules/ai/module'));