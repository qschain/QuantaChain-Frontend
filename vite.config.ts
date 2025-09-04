import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    // @ts-ignore
    const env = loadEnv(mode, process.cwd(), '')
    const proxyTarget = env.VITE_API_PROXY_TARGET // 例如 http://localhost:8080

    return {
        plugins: [react()],
        server: {
            port: 5173,
            proxy: proxyTarget
                ? {
                    '/api': {
                        target: proxyTarget,
                        changeOrigin: true,
                        secure: false,
                    }
                }
                : undefined
        },
    }
})