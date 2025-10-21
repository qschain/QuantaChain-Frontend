import { explorerHandlers } from '../../modules/ecosystem/subdomains/explorer/shared/msw/handlers';
import { walletHandlers } from '../../modules/ecosystem/subdomains/wallets/quanta-wallet/shared/msw/handlers';
import { srHandlers } from '../../modules/ecosystem/subdomains/sr/shared/msw/handlers';
import { dappsHandlers } from '../../modules/ecosystem/subdomains/dapps/msw/handlers';
import { bridgeHandlers } from '../../modules/ecosystem/subdomains/bridge/msw/handlers';
export const handlers = [
    ...walletHandlers,
    ...explorerHandlers,
    ...srHandlers,
    ...dappsHandlers,
    ...bridgeHandlers,
];