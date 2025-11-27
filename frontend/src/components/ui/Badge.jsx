import { cn } from '../../utils/cn';

const variants = {
  paid: 'bg-emerald-100 text-emerald-800',
  due: 'bg-amber-100 text-amber-800',
  refunded: 'bg-gray-100 text-gray-800',
  lowStock: 'bg-red-100 text-red-800',
  active: 'bg-indigo-100 text-indigo-800',
  inactive: 'bg-gray-100 text-gray-600',
  default: 'bg-gray-100 text-gray-800',
};

const Badge = ({ children, variant = 'default', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
