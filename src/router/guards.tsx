import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../state/SessionProvider';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { authed } = useSession()
  const location = useLocation()

  if (!authed) {
    // 未登录：带上来源地址，登录后可原路返回
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
