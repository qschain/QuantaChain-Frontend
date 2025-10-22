// src/wallet/shared/prefs/WalletPrefsProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useUI } from '../../../../../shared/state/UIProvider'

export type WalletTheme = 'dark' | 'light' | 'deep' | 'bright' | 'system'
export type WalletLang = 'zh-CN' | 'en-US'
export type WalletCurrency = 'USD' | 'CNY'

type Ctx = {
    theme: WalletTheme
    resolvedTheme: Exclude<WalletTheme, 'system'>
    setTheme: (t: WalletTheme) => void
    language: WalletLang
    setLanguage: (l: WalletLang) => void
    currency: WalletCurrency
    setCurrency: (c: WalletCurrency) => void
    scopeRef: React.RefObject<HTMLDivElement> // 供需要时拿到容器
}

const C = createContext<Ctx | null>(null)

function systemTheme(): 'dark' | 'light' {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children, inherit = true }: { children: React.ReactNode; inherit?: boolean }) {
    // 从全局 UIProvider 继承默认值（可关闭 inherit）
    const { theme: globalTheme, language: globalLang, currency: globalCur } = useUI()

    const initTheme = (localStorage.getItem('walletTheme') as WalletTheme) || (inherit ? (globalTheme as WalletTheme) : 'dark')
    const initLang = (localStorage.getItem('walletLang') as WalletLang) || (inherit ? (globalLang as WalletLang) : 'zh-CN')
    const initCur = (localStorage.getItem('walletCurrency') as WalletCurrency) || (inherit ? (globalCur as WalletCurrency) : 'USD')

    const [theme, setTheme] = useState<WalletTheme>(initTheme)
    const [resolvedTheme, setResolvedTheme] = useState<Exclude<WalletTheme, 'system'>>(
        initTheme === 'system' ? systemTheme() : (initTheme as Exclude<WalletTheme, 'system'>)
    )
    const [language, setLanguage] = useState<WalletLang>(initLang)
    const [currency, setCurrency] = useState<WalletCurrency>(initCur)

    const scopeRef = useRef<HTMLDivElement>(null)

    // 应用主题到钱包容器（不碰全局 <html>）
    useEffect(() => {
        const eff = theme === 'system' ? systemTheme() : theme
        setResolvedTheme(eff as Exclude<WalletTheme, 'system'>)
        scopeRef.current?.setAttribute('data-wallet-theme', eff)
        localStorage.setItem('walletTheme', theme)
    }, [theme])

    // system 跟随 OS
    useEffect(() => {
        if (theme !== 'system') return
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => {
            const eff = mql.matches ? 'dark' : 'light'
            setResolvedTheme(eff)
            scopeRef.current?.setAttribute('data-wallet-theme', eff)
        }
        mql.addEventListener?.('change', onChange)
        return () => mql.removeEventListener?.('change', onChange)
    }, [theme])

    // 语言/货币持久化
    useEffect(() => { localStorage.setItem('walletLang', language) }, [language])
    useEffect(() => { localStorage.setItem('walletCurrency', currency) }, [currency])

    const value = useMemo(
        () => ({ theme, resolvedTheme, setTheme, language, setLanguage, currency, setCurrency, scopeRef }),
        [theme, resolvedTheme, language, currency]
    )

    return (
        <C.Provider value={value}>
            <div ref={scopeRef} className="wallet-root">{children}</div>
        </C.Provider>
    )
}

export function useWalletTheme() {
    const ctx = useContext(C)
    if (!ctx) throw new Error('useWalletPrefs 必须在 WalletPrefsProvider 内使用')
    return ctx
}
