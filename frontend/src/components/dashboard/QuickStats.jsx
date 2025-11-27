import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const QuickStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Revenue', value: stats?.todayRevenue, format: 'currency', change: stats?.revenueChange },
    { label: 'Sales', value: stats?.todaySales, format: 'number', change: stats?.salesChange },
    { label: 'Avg Order', value: stats?.avgOrderValue, format: 'currency', change: stats?.aovChange },
    { label: 'Products', value: stats?.activeProducts, format: 'number' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-2xl font-bold font-mono mt-1">
            {item.format === 'currency' ? formatCurrency(item.value || 0) : formatNumber(item.value || 0)}
          </p>
          {item.change !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${
              item.change > 0 ? 'text-emerald-600' : item.change < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {item.change > 0 ? <TrendingUp className="w-3 h-3" /> : 
               item.change < 0 ? <TrendingDown className="w-3 h-3" /> : 
               <Minus className="w-3 h-3" />}
              <span>{Math.abs(item.change || 0)}%</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
