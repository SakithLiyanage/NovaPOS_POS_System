import { motion } from 'framer-motion';
import { Button } from '../ui';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  actionIcon 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 bg-white rounded-xl border border-gray-200"
    >
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
