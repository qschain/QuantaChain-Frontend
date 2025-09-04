import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSession } from '../../state/SessionProvider'
import { useState } from 'react'

export default function Login() {
    const { login } = useSession()
    const nav = useNavigate()
    const loc = useLocation()
    const from = (loc.state as any)?.from?.pathname || '/dashboard'

    const [id, setId] = useState('user@email.com')
    const [pwd, setPwd] = useState('123456')
    const [remember, setRemember] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
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
        <>
            <div style={{textAlign:'center', marginBottom:16}}>
                <div className="badge">🔒</div>
                <h2 style={{margin:'8px 0'}}>登录系统</h2>
                <div className="secondary">访问您的数字资产仪表盘</div>
            </div>

            <form onSubmit={submit} className="grid" style={{gap:'14px'}}>
                {error && (
                    <div className="card" style={{background:'#fdd', color:'#900', padding:'8px 10px'}}>
                        {error}
                    </div>
                )}
                <div>
                    <div className="mb-2">账户名/邮箱</div>
                    <input
                        className="input"
                        value={id}
                        onChange={e=>setId(e.target.value)}
                        placeholder="请输入邮箱或账户名"
                    />
                </div>
                <div>
                    <div className="mb-2">密码</div>
                    <input
                        className="input"
                        type="password"
                        value={pwd}
                        onChange={e=>setPwd(e.target.value)}
                        placeholder="请输入密码"
                    />
                </div>
                <label className="row">
                    <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> 记住我
                </label>
                <button className="btn" disabled={loading}>
                    {loading ? '登录中…' : '安全登录'}
                </button>
                <div className="row space-between">
                    <Link to="/auth/forgot" className="secondary">忘记密码？</Link>
                    <div className="secondary">还没有账户？ <Link to="/auth/register">立即注册</Link></div>
                </div>
            </form>

            <hr className="mt-6"/>
            <div className="row" style={{justifyContent:'center', gap:12, marginTop:10}}>
                <button className="btn secondary">G</button>
                <button className="btn secondary">f</button>
                <button className="btn secondary">𝙶𝚑</button>
            </div>
        </>
    )
}
