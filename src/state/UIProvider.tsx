import { createContext, useContext, useEffect, useState } from 'react'

type UI = {
    theme: 'dark'|'deep'|'light'|'bright'
    language: 'zh-CN'|'en-US'
    currency: 'USD'|'CNY'
    setTheme: (t:UI['theme'])=>void
    setLanguage: (l:UI['language'])=>void
    setCurrency: (c:UI['currency'])=>void
}
const C = createContext<UI>(null as any)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<UI['theme']>(() => (localStorage.getItem('theme') as any) || 'dark')
    const [language, setLanguage] = useState<UI['language']>('zh-CN')
    const [currency, setCurrency] = useState<UI['currency']>('USD')

    useEffect(()=>{ localStorage.setItem('theme', theme) }, [theme])

    return (
        <C.Provider value={{ theme, language, currency, setTheme, setLanguage, setCurrency }}>
            {children}
        </C.Provider>
    )
}
export const useUI = () => useContext(C)
