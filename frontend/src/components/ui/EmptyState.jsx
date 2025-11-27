import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-6"
    >
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
