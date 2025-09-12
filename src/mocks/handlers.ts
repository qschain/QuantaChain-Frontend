import { explorerHandlers } from '../modules/ecosystem/features/explorer/msw/handlers';
import { walletHandlers } from '../modules/ecosystem/features/wallets/msw/handlers';
import { srHandlers } from '../modules/ecosystem/features/sr/msw/handlers';
// 如果还有其它模块（sr、browser 等），继续在这里导入并展开
export const handlers = [
    ...walletHandlers,
    ...explorerHandlers,
    ...srHandlers,
];