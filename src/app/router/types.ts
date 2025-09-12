export type RouteMeta = {
    title?: string;          // 页面标题
    requiresAuth?: boolean;  // 是否需要登录
    icon?: string;           // 侧边栏图标 key（可选）
    hidden?: boolean;        // 是否在侧边栏隐藏
};
