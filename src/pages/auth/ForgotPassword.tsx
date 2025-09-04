import { Link } from 'react-router-dom'
export default function ForgotPassword() {
    return (
        <>
            <h2 style={{marginTop:0}}>忘记密码</h2>
            <div className="secondary mb-4">输入账户邮箱或手机号，我们将发送验证码验证您的身份。</div>
            <div className="grid" style={{gap:14}}>
                <div><div className="mb-2">账户</div><input className="input" placeholder="邮箱或手机号"/></div>
                <div className="row">
                    <div style={{flex:1}}>
                        <div className="mb-2">验证码</div>
                        <input className="input" placeholder="6位验证码"/>
                    </div>
                    <button className="btn secondary" style={{alignSelf:'end'}}>发送验证码</button>
                </div>
                <div><div className="mb-2">设置新密码</div><input className="input" type="password" placeholder="至少8位，包含字母和数字"/></div>
                <div><div className="mb-2">确认新密码</div><input className="input" type="password" placeholder="再次输入新密码"/></div>
                <button className="btn">重置密码</button>
                <Link to="/auth/login" className="secondary" style={{textAlign:'center'}}>返回登录</Link>
            </div>
        </>
    )
}
