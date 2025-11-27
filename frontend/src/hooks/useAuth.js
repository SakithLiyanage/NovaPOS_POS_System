import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, checkAuth } = useAuthStore();

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isOwner = () => hasRole('OWNER');
  const isManager = () => hasRole('OWNER', 'MANAGER');
  const isCashier = () => hasRole('OWNER', 'MANAGER', 'CASHIER');

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
    isOwner,
    isManager,
    isCashier,
  };
};

export default useAuth;
