import { Outlet } from 'react-router-dom';
import TopNav from './TopNav/TopNav';
import Footbar from "./Footbar/Footbar";
export default function AppLayout() {
    return (
        <div className="app-shell">
            <TopNav />
            <main className="app-content">
                <Outlet />
            </main>
            <Footbar version={'v1.0.0'} />
        </div>
    );
}