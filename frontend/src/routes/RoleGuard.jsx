import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleGuard = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
