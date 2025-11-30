import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const SummaryCards = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    { 
      title: "Today's Revenue", 
      value: formatCurrency(data?.todayRevenue || 0), 
      icon: DollarSign, 
      color: 'indigo' 
    },
    { 
      title: "Today's Sales", 
      value: formatNumber(data?.todaySales || 0), 
      icon: ShoppingCart, 
      color: 'emerald' 
    },
    { 
      title: 'Avg. Order Value', 
      value: formatCurrency(data?.avgOrderValue || 0), 
      icon: TrendingUp, 
      color: 'purple' 
    },
    { 
      title: 'Active Products', 
      value: formatNumber(data?.activeProducts || 0), 
      icon: Package, 
      color: 'amber' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden" animate={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-${card.color}-100`}>
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
