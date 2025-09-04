import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/auth.css'

export default function ForgotPassword() {
    // 进入/离开时切换 auth-page 类，用于隐藏全局 footbar/返回按钮
    useEffect(() => {
        const root = document.documentElement
        root.classList.add('auth-page')
        return () => root.classList.remove('auth-page')
    }, [])

    const [account, setAccount] = useState('')
    const [code, setCode] = useState('')
    const [pwd1, setPwd1] = useState('')
    const [pwd2, setPwd2] = useState('')
    const [sending, setSending] = useState(false)
    const [sec, setSec] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)

    // 简易倒计时
    useEffect(() => {
        if (sec <= 0) return
        const t = setInterval(() => setSec(s => (s > 0 ? s - 1 : 0)), 1000)
        return () => clearInterval(t)
    }, [sec])

    const sendCode = async () => {
        if (!account) {
            setMsg('请输入账户邮箱或手机号 / Please enter email or phone.')
            return
        }
        setMsg(null)
        setSending(true)
        try {
            // TODO: 接入后端或 MSW：POST /api/auth/send-code
            await new Promise(res => setTimeout(res, 600))
            setSec(60)
        } finally {
            setSending(false)
        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMsg(null)

        if (!account || !code || !pwd1 || !pwd2) {
            setMsg('请完整填写表单 / Please complete the form.')
            return
        }
        if (pwd1.length < 8 || !/\d/.test(pwd1) || !/[A-Za-z]/.test(pwd1)) {
            setMsg('新密码需至少8位且包含字母和数字 / Password must be 8+ chars with letters and digits.')
            return
        }
        if (pwd1 !== pwd2) {
            setMsg('两次输入的密码不一致 / Passwords do not match.')
            return
        }

        setSubmitting(true)
        try {
            // TODO: 接入后端或 MSW：POST /api/auth/reset-password
            await new Promise(res => setTimeout(res, 800))
            setMsg('重置成功，请返回登录 / Reset succeeded. Please sign in.')
        } catch (e: any) {
            setMsg(e?.message || '重置失败，请稍后再试 / Reset failed, please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="auth-root">
            <div className="auth-card">
                <div className="auth-head">
                    <div className="logo">🔑</div>
                    <div className="titles">
                        <h2 className="title">
                            忘记密码 <span className="divider">/</span> Forgot Password
                        </h2>
                        <p className="subtitle">
                            输入账户邮箱或手机号，我们将发送验证码验证您的身份。
                            <span className="dot"> • </span>
                            Enter your email or phone number to receive a verification code.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="form">
                    {msg && <div className="alert">{msg}</div>}

                    <div className="field">
                        <label className="bilabel" htmlFor="fp-account">
                            <span className="zh">账户</span>
                            <span className="en">Account</span>
                        </label>
                        <input
                            id="fp-account"
                            className="input"
                            value={account}
                            onChange={e => setAccount(e.target.value)}
                            placeholder="邮箱或手机号 / Email or phone number"
                            autoComplete="username"
                        />
                    </div>

                    <div className="row" style={{ gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label className="bilabel" htmlFor="fp-code">
                                <span className="zh">验证码</span>
                                <span className="en">Verification code</span>
                            </label>
                            <input
                                id="fp-code"
                                className="input"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="6位验证码 / 6-digit code"
                                inputMode="numeric"
                            />
                        </div>
                        <button
                            type="button"
                            className="btn-ghost strong"
                            style={{ alignSelf: 'end', minWidth: 128 }}
                            onClick={sendCode}
                            disabled={sending || sec > 0}
                        >
                            {sec > 0
                                ? `重新发送 ${sec}s / Resend in ${sec}s`
                                : sending
                                    ? '发送中… / Sending…'
                                    : '发送验证码 / Send code'}
                        </button>
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="fp-pwd1">
                            <span className="zh">设置新密码</span>
                            <span className="en">New password</span>
                        </label>
                        <input
                            id="fp-pwd1"
                            className="input"
                            type="password"
                            value={pwd1}
                            onChange={e => setPwd1(e.target.value)}
                            placeholder="至少8位，包含字母和数字 / 8+ chars with letters & digits"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="field">
                        <label className="bilabel" htmlFor="fp-pwd2">
                            <span className="zh">确认新密码</span>
                            <span className="en">Confirm new password</span>
                        </label>
                        <input
                            id="fp-pwd2"
                            className="input"
                            type="password"
                            value={pwd2}
                            onChange={e => setPwd2(e.target.value)}
                            placeholder="再次输入新密码 / Re-enter new password"
                            autoComplete="new-password"
                        />
                    </div>

                    <button className="btn-primary" disabled={submitting}>
                        {submitting ? '重置中… / Resetting…' : '重置密码 / Reset password'}
                    </button>

                    <div className="row center hint">
                        <Link to="/auth/login" className="link strong">
                            ← 返回登录 <span className="en-sm">Back to Sign in</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
