import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './shared/styles/global.css'
import { SessionProvider } from './shared/state/SessionProvider'
import { UIProvider } from './shared/state/UIProvider'
import App from './app/App'

// 在开发/指定模式下才启动 MSW
async function bootstrap() {
    const useMsw = import.meta.env.VITE_USE_MSW === 'true'
    if (useMsw) {
        const { worker } = await import('../src/mocks/browser')
        await worker.start({ onUnhandledRequest: 'bypass' })
    }


    await import('./core/i18n/i18n')

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <BrowserRouter>
                <UIProvider>
                    <SessionProvider>
                        <App />
                    </SessionProvider>
                </UIProvider>
            </BrowserRouter>
        </React.StrictMode>
    )
}

bootstrap()