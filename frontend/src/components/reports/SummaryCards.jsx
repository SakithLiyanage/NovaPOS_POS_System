import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, TrendingUp, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, Skeleton } from '../ui';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const iconMap = {
  revenue: DollarSign,
  sales: ShoppingCart,
  average: TrendingUp,
  products: Package,
};

const colorMap = {
  revenue: 'indigo',
  sales: 'emerald',
  average: 'purple',
  products: 'amber',
};

const SummaryCard = ({ title, value, change, format = 'number', type = 'revenue', loading, delay = 0 }) => {
  const Icon = iconMap[type] || DollarSign;
  const color = colorMap[type] || 'indigo';

  if (loading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="relative overflow-hidden" animate={false}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">{formattedValue}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{Math.abs(change)}% vs yesterday</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-500 to-${color}-400`} />
      </Card>
    </motion.div>
  );
};

const SummaryCards = ({ data, loading }) => {
  const cards = [
    { title: "Today's Revenue", value: data?.todayRevenue, change: data?.revenueChange, format: 'currency', type: 'revenue' },
    { title: "Today's Sales", value: data?.todaySales, change: data?.salesChange, format: 'number', type: 'sales' },
    { title: 'Avg. Order Value', value: data?.avgOrderValue, change: data?.aovChange, format: 'currency', type: 'average' },
    { title: 'Active Products', value: data?.activeProducts, format: 'number', type: 'products' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <SummaryCard key={card.title} {...card} loading={loading} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default SummaryCards;
