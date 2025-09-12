type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
    method?: HttpMethod
    headers?: Record<string, string>
    query?: Record<string, any>
    body?: any
    timeoutMs?: number
    withAuth?: boolean
    /** 本次请求走“真实/混合”（供 MSW 识别） */
    bypassMock?: boolean
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

function buildBaseAbsolute(base: string) {
    // 绝对地址直接返回
    if (/^https?:\/\//i.test(base)) return base.replace(/\/$/, '') + '/'
    // 以 / 开头的相对路径：挂到当前站点 origin 下
    if (base.startsWith('/')) return (window.location.origin + base).replace(/\/$/, '') + '/'
    // 其它相对片段：同样挂到 origin 下
    return (window.location.origin + '/' + base).replace(/\/$/, '') + '/'
}

function buildUrl(path: string, query?: Record<string, any>) {
    const isAbsolutePath = /^https?:\/\//i.test(path)
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

        // 鉴权头
        const withAuth = opts.withAuth ?? true
        const token = AUTH_TOKEN ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)
        if (withAuth && token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // “本次请求走真实/混合”的信号（供 MSW handler 判断）
        const query: Record<string, any> = { ...(opts.query || {}) }
        if (opts.bypassMock) {
            headers['x-msw-bypass'] = headers['x-msw-bypass'] ?? '1'
            // 兜底：同时加一个 query 标记，防止某些环境下自定义头被中间层剥离
            if (!('__real' in query)) query.__real = '1'
        }

        // Body 编码
        let body: BodyInit | undefined
        if (opts.body !== undefined) {
            const ct = headers['Content-Type']
            if ((ct && ct.includes('application/json')) || typeof opts.body === 'object') {
                headers['Content-Type'] = ct ?? 'application/json'
                body = headers['Content-Type'].startsWith('application/json') ? JSON.stringify(opts.body) : opts.body
            } else {
                body = opts.body
            }
        }

        const res = await fetch(buildUrl(path, query), {
            method: opts.method ?? 'GET',
            headers,
            body,
            signal: controller.signal,
            credentials: 'include',
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
}

export const http = {
    get:   <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'GET' }),
    post:  <T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'POST', body }),
    put:   <T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'PUT', body }),
    patch: <T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'PATCH', body }),
    delete:<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        doFetch<T>(path, { ...options, method: 'DELETE' }),
    setAuthToken,
}
