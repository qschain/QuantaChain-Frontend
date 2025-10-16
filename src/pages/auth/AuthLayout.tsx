import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
    return (
        <div style={{minHeight:'100%', display:'grid', placeItems:'center'}}>
            <div className="card" style={{width:520, marginTop:40}}>
                <Outlet />
            </div>
        </div>
    )
}
