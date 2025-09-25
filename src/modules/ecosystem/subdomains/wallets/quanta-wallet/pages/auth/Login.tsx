import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSession } from '../../state/WalletSessionProvider'
import { useEffect, useState } from 'react'
import '../../styles/auth.css'

export default function Login() {
    const { login, authed } = useSession()
    const nav = useNavigate()
    const loc = useLocation()
    const from = (loc.state as any)?.from?.pathname || '../../dashboard'

    const [id, setId] = useState('')
    const [pwd, setPwd] = useState('')
    const [remember, setRemember] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 如果已经登录，直接跳转
    useEffect(() => {
        if (authed) {
            nav(from, { replace: true })
        }
    }, [authed, nav, from])

    // 进入登录页时隐藏外层“返回首页 / footbar”等；离开时还原
    useEffect(() => {
        const root = document.documentElement
        root.classList.add('auth-page')
        return () => root.classList.remove('auth-page')
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!id || !pwd) {
            setError('请输入账户名和密码 / Please enter username and password.')
            return
        }

        setLoading(true)
        setError(null)
        
        try {
            await login(id, pwd)
            nav(from, { replace: true })
        } catch (err: any) {
            setError(err?.message || '登录失败，请检查网络或启用本地 Mock（VITE_USE_MSW=true）')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-root">
              <button 
                className="custom-back-button" // 使用 btn-primary 样式
                onClick={() => nav('/ecosystem/wallets')} // 返回钱包集成页面
                style={{ position: 'absolute' , top: '20px', left: '20px' }}
            >
                返回钱包集成
            </button>
            <div className="auth-card">
                <div className="auth-head">
                    <div className="logo">🔒</div>
                    <div className="titles">
                        <h2 className="title">
                            登录系统 <span className="divider">/</span> Sign In
                        </h2>
                        <p className="subtitle">
                            访问您的数字资产仪表盘 <span className="dot">•</span> Access your digital-asset dashboard
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="form">
                    {error && <div className="alert">{error}</div>}

                    <div className="field">
                        <label className="bilabel" htmlFor="login-id">
                            <span className="zh">账户名 / 邮箱</span>
                            <span className="en">Username / Email</span>
                        </label>
                        <input
                            id="login-id"
                            className="input"
                            value={id}
                            onChange={e => setId(e.target.value)}
                            placeholder="输入邮箱或账户名 / Enter email or username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="login-pwd">
                            <span className="zh">密码</span>
                            <span className="en">Password</span>
                        </label>
                        <input
                            id="login-pwd"
                            className="input"
                            type="password"
                            value={pwd}
                            onChange={e => setPwd(e.target.value)}
                            placeholder="输入密码 / Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="row between">
                        <label className="check">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={e => setRemember(e.target.checked)}
                            />
                            <span>
                记住我 <span className="en-sm">Remember me</span>
              </span>
                        </label>

                        <Link to="../forgot" className="link">
                            忘记密码？ <span className="en-sm">Forgot password?</span>
                        </Link>
                    </div>

                    <button className="btn-primary" disabled={loading}>
                        {loading ? '登录中… / Signing in…' : '安全登录 / Secure Sign-in'}
                    </button>

                    <div className="row center hint">
                        还没有账户？ <span className="en-sm">Don’t have an account?</span>&nbsp;
                        <Link to="../register" className="link strong">
                            立即注册 <span className="en-sm">Create one</span>
                        </Link>
                    </div>

                    <div className="or">
                        <span>或 / OR</span>
                    </div>

                    <div className="oauth">
                        <button type="button" className="btn-ghost" title="Sign in with Google">
                            G <span className="en-sm">Google</span>
                        </button>
                        <button type="button" className="btn-ghost" title="Sign in with Phone">
                             <span className="en-sm">Phone</span>
                        </button>
                        <button type="button" className="btn-ghost" title="Sign in with Wechat">
                            wx <span className="en-sm">Weixin</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
