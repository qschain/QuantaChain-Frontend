type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
    method?: HttpMethod
    headers?: Record<string, string>
    query?: Record<string, any>
    body?: any
    timeoutMs?: number
    withAuth?: boolean
    useRealApi?: boolean
    withCredentials?: boolean
}

// @ts-ignore
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
// @ts-ignore
const REAL_API_URL = import.meta.env.VITE_API_PROXY_TARGET || 'http://192.168.99.88:8080/api'

function buildBaseAbsolute(base: string) {
    if (/^https?:\/\//i.test(base)) return base.replace(/\/$/, '') + '/'
    if (base.startsWith('/')) return (window.location.origin + base).replace(/\/$/, '') + '/'
    return (window.location.origin + '/' + base).replace(/\/$/, '') + '/'
}

function buildUrl(path: string, query?: Record<string, any>, useRealApi: boolean = false) {
    const isAbsolutePath = /^https?:\/\//i.test(path)

    if (useRealApi && !isAbsolutePath) {
        const realBase = buildBaseAbsolute(REAL_API_URL)
        const cleanPath = path.replace(/^\/?api\//, '')
        const url = new URL(cleanPath, realBase)

        if (query) {
            Object.entries(query).forEach(([k, v]) => {
                if (v === undefined || v === null) return
                url.searchParams.set(k, String(v))
            })
        }
        return url.toString()
    }

    const baseAbs = buildBaseAbsolute(BASE_URL)
    const cleanPath = path.replace(/^\//, '')
    const url = new URL(isAbsolutePath ? path : new URL(cleanPath, baseAbs).toString())

    if (query) {
        Object.entries(query).forEach(([k, v]) => {
            if (v === undefined || v === null) return
            url.searchParams.set(k, String(v))
        })
    }
    return url.toString()
}

let AUTH_TOKEN: string | null = null
export function setAuthToken(token: string | null) {
    AUTH_TOKEN = token
}

async function doFetch<T>(path: string, opts: RequestOptions = {}) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15000)

    try {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            ...opts.headers,
        }

        const withAuth = opts.withAuth ?? true
        const token = AUTH_TOKEN ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)
        if (withAuth && token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`
        }

        let body: BodyInit | undefined
        if (opts.body !== undefined) {
            const ct = headers['Content-Type']
            if ((ct && ct.includes('application/json')) || typeof opts.body === 'object') {
                headers['Content-Type'] = ct ?? 'application/json'
                body = headers['Content-Type'].startsWith('application/json') ? JSON.stringify(opts.body) : (opts.body as any)
            } else {
                body = opts.body
            }
        }

        const res = await fetch(buildUrl(path, opts.query, opts.useRealApi ?? false), {
            method: opts.method ?? 'GET',
            headers,
            body,
            signal: controller.signal,
            credentials: opts.withCredentials ? 'include' : 'omit', // ⭐ 默认 omit
        })

        const contentType = res.headers.get('content-type') || ''
        const isJson = contentType.includes('application/json')

        if (!res.ok) {
            const errText = isJson ? JSON.stringify(await res.json()).slice(0, 1000) : (await res.text()).slice(0, 1000)
            throw new Error(errText || `HTTP ${res.status}`)
        }

        return (isJson ? res.json() : (res.text() as any)) as Promise<T>
    } finally {
        clearTimeout(timeout)
    }
    let optionsOrHeadersYouCareAbout;
    console.log('[http] fetch', path, optionsOrHeadersYouCareAbout);
}

export const http = {
    get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'GET' }),

    post: <T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'POST', body }),

    put: <T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'PUT', body }),

    patch: <T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'PATCH', body }),

    delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'DELETE' }),

    setAuthToken,
}
