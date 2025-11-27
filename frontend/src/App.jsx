import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PosPage from './pages/PosPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import SaleDetailPage from './pages/SaleDetailPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AuditLogPage from './pages/AuditLogPage';

// Layout & Components
import LayoutShell from './components/layout/LayoutShell';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';
import { ErrorBoundary, LoadingScreen } from './components/common';
import OfflineIndicator from './components/offline/OfflineIndicator';

// Store
import { useAuthStore } from './store/authStore';

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingScreen message="Initializing..." />;
  }

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/sales" element={<SalesHistoryPage />} />
              <Route path="/sales/:id" element={<SaleDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Manager+ routes */}
              <Route element={<RoleGuard allowedRoles={['OWNER', 'MANAGER']} />}>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* Owner only routes */}
              <Route element={<RoleGuard allowedRoles={['OWNER']} />}>
                <Route path="/users" element={<UsersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/audit" element={<AuditLogPage />} />
              </Route>
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F8FAFC',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F8FAFC',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
