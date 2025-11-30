import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import QuickStats from '../components/dashboard/QuickStats';
import SalesTrendChart from '../components/dashboard/SalesTrendChart';
import LowStockWidget from '../components/dashboard/LowStockWidget';
import RecentSales from '../components/dashboard/RecentSales';
import TopProductsChart from '../components/reports/TopProductsChart';
import AISalesInsights from '../components/ai/AISalesInsights';
import { useTopProducts } from '../hooks/useReports';

const DashboardPage = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.get('/dashboard/stats').then(res => res.data),
    refetchInterval: 60000,
  });

  const { data: topProducts, isLoading: topLoading } = useTopProducts({ limit: 5 });

  const stats = dashboardData?.data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Quick Stats */}
      <QuickStats
        stats={{
          todayRevenue: stats?.today?.revenue,
          todaySales: stats?.today?.sales,
          avgOrderValue: stats?.today?.avgOrder,
          activeProducts: stats?.products?.active,
        }}
        loading={isLoading}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart data={stats?.salesTrend} loading={isLoading} />
        </div>
        <AISalesInsights />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopProductsChart data={topProducts?.data} loading={topLoading} />
        <RecentSales />
        <LowStockWidget />
      </div>
    </motion.div>
  );
};

export default DashboardPage;
