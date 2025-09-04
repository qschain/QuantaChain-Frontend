import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import { SessionProvider } from './state/SessionProvider'
import { UIProvider } from './state/UIProvider'
import App from './App'

// 在开发/指定模式下才启动 MSW
async function bootstrap() {
    const useMsw = import.meta.env.VITE_USE_MSW === 'true'
    if (useMsw) {
        const { worker } = await import('../src/mocks/browser')
        await worker.start({ onUnhandledRequest: 'bypass' })
    }


    await import('./i18n')

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