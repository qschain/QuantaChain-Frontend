import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './styles/bridge.css';

export default function BridgeLayout() {
    const loc = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as any }); }, [loc.pathname]);

    return (
        <div className="bridge-shell">
            <main className="bridge-main">
                <div className="bridge-main-inner">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
