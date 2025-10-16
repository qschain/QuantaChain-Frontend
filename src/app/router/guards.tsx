import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../session/PlatformSessionProvider';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { authed, loading } = useSession();
  const location = useLocation();

  // 如果正在加载，显示加载状态
  if (loading) {
    return <div>Loading...</div>;
  }

  // 如果未认证，重定向到登录页
  if (!authed) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}