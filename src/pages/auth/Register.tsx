import { Link } from 'react-router-dom'

export default function Register() {
    return (
        <>
            <h2 style={{marginTop:0}}>创建您的账户</h2>
            <div className="secondary mb-4">欢迎加入下一代数字资产管理平台</div>

            <div className="grid" style={{gap:14}}>
                <div><div className="mb-2">电子邮件</div><input className="input" placeholder="you@example.com"/></div>
                <div><div className="mb-2">用户名</div><input className="input" placeholder="选择一个独特的用户名"/></div>
                <div><div className="mb-2">密码</div><input className="input" type="password" placeholder="至少8位"/></div>
                <div><div className="mb-2">确认密码</div><input className="input" type="password" placeholder="再次输入"/></div>
                <label className="row"><input type="checkbox"/> 我已阅读并同意《条款》和《隐私政策》</label>
                <button className="btn">注册</button>
                <div className="secondary">已有账号？ <Link to="/auth/login">立即登录</Link></div>
            </div>
        </>
    )
}
