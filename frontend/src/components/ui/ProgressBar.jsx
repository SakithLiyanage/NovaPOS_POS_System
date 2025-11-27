import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const colors = {
  primary: 'bg-indigo-600',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const ProgressBar = ({ value, max = 100, color = 'primary', showLabel = false, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{value}</span>
          <span className="text-gray-400">{max}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colors[color])}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
