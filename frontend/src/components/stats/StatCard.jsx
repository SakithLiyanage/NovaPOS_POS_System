import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

const StatCard = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  iconColor = 'indigo',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    );
  }

  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">{value}</p>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm',
              isPositive && 'text-emerald-600',
              isNegative && 'text-red-600',
              !isPositive && !isNegative && 'text-gray-500'
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> :
               isNegative ? <TrendingDown className="w-4 h-4" /> :
               <Minus className="w-4 h-4" />}
              <span>{Math.abs(change)}% {changeLabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-${iconColor}-100`}>
            <Icon className={`w-6 h-6 text-${iconColor}-600`} />
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${iconColor}-500 to-${iconColor}-400`} />
    </motion.div>
  );
};

export default StatCard;
