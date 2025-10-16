import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './modules/ecosystem/subdomains/wallets/quanta-wallet/styles/global.css'
import { PlatformSessionProvider } from './app/session/PlatformSessionProvider'
import { UIProvider } from './shared/state/UIProvider'
import App from './App'

// 在开发/指定模式下才启动 MSW
async function bootstrap() {
    // @ts-ignore
    const useMsw = import.meta.env.VITE_USE_MSW === 'true'
    if (useMsw) {
        const { worker } = await import('./shared/mocks/browser')
        await worker.start({ onUnhandledRequest: 'bypass' })
    }


    await import('./shared/lib/i18n/i18n')

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <BrowserRouter>
                <UIProvider>
                    <PlatformSessionProvider>
                        <App />
                    </PlatformSessionProvider>
                </UIProvider>
            </BrowserRouter>
        </React.StrictMode>
    )
}

bootstrap()