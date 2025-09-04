import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/auth.css'

export default function Register() {
    // 进入/离开时切换 auth-page 类：隐藏全局 footbar/返回等
    useEffect(() => {
        const root = document.documentElement
        root.classList.add('auth-page')
        return () => root.classList.remove('auth-page')
    }, [])

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [pwd1, setPwd1] = useState('')
    const [pwd2, setPwd2] = useState('')
    const [agree, setAgree] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMsg(null)

        if (!email || !username || !pwd1 || !pwd2) {
            setMsg('请完整填写表单 / Please complete the form.')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMsg('邮箱格式不正确 / Invalid email format.')
            return
        }
        if (pwd1.length < 8) {
            setMsg('密码至少 8 位 / Password must be at least 8 characters.')
            return
        }
        if (pwd1 !== pwd2) {
            setMsg('两次输入的密码不一致 / Passwords do not match.')
            return
        }
        if (!agree) {
            setMsg('请先阅读并同意条款 / Please accept Terms & Privacy.')
            return
        }

        setSubmitting(true)
        try {
            // TODO: 接入后端或 MSW：POST /api/auth/register
            await new Promise(res => setTimeout(res, 900))
            setMsg('注册成功，请前往登录 / Registration succeeded. Please sign in.')
        } catch (e: any) {
            setMsg(e?.message || '注册失败，请稍后再试 / Registration failed, please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="auth-root">
            <div className="auth-card">
                <div className="auth-head">
                    <div className="logo">🧩</div>
                    <div className="titles">
                        <h2 className="title">
                            创建您的账户 <span className="divider">/</span> Create your account
                        </h2>
                        <p className="subtitle">
                            欢迎加入下一代数字资产管理平台
                            <span className="dot"> • </span>
                            Welcome to the next-gen digital asset platform
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="form">
                    {msg && <div className="alert">{msg}</div>}

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-email">
                            <span className="zh">电子邮件</span>
                            <span className="en">Email</span>
                        </label>
                        <input
                            id="reg-email"
                            className="input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-username">
                            <span className="zh">用户名</span>
                            <span className="en">Username</span>
                        </label>
                        <input
                            id="reg-username"
                            className="input"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="选择一个独特的用户名 / Pick a unique username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-pwd1">
                            <span className="zh">密码</span>
                            <span className="en">Password</span>
                        </label>
                        <input
                            id="reg-pwd1"
                            className="input"
                            type="password"
                            value={pwd1}
                            onChange={e => setPwd1(e.target.value)}
                            placeholder="至少 8 位 / At least 8 characters"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="reg-pwd2">
                            <span className="zh">确认密码</span>
                            <span className="en">Confirm password</span>
                        </label>
                        <input
                            id="reg-pwd2"
                            className="input"
                            type="password"
                            value={pwd2}
                            onChange={e => setPwd2(e.target.value)}
                            placeholder="再次输入 / Re-enter"
                            autoComplete="new-password"
                        />
                    </div>

                    <label className="row" style={{ gap: 8 }}>
                        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                        <span>
              我已阅读并同意《条款》和《隐私政策》
              <span className="en-sm"> I have read and agree to the Terms & Privacy</span>
            </span>
                    </label>

                    <button className="btn-primary" disabled={submitting}>
                        {submitting ? '注册中… / Registering…' : '注册 / Sign up'}
                    </button>

                    <div className="row center hint">
            <span className="secondary">
              已有账号？ <span className="en-sm">Already have an account?</span>{' '}
                <Link to="/auth/login" className="link strong">
                立即登录 <span className="en-sm">Sign in</span>
              </Link>
            </span>
                    </div>
                </form>
            </div>
        </div>
    )
}
