import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../shared/state/SessionProvider';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { authed } = useSession();
    const location = useLocation();

    if (!authed) {
        return <Navigate to="/wallet/auth/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
}
