import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
    return (
        <div style={{minHeight:'100%', display:'grid', placeItems:'center'}}>
            <div className="card" style={{width:520, marginTop:40}}>
                <Outlet />
            </div>
            <div className="footer">
                <div>系统状态：<span className="badge green">正常运行</span>　最后同步：2025-01-20 14:30:25　区块高度：#2,847,392</div>
                <div>数字资产®OS v1.0.0　<span className="badge blue">安全认证</span> <span className="badge">多链支持</span> <span className="badge">量子级加密</span></div>
            </div>
            <Link to="/" style={{position:'fixed', left:16, top:16, opacity:.5}}>← 返回首页</Link>
        </div>
    )
}
