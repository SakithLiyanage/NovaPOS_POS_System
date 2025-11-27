import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Switch = ({ checked, onChange, disabled = false, label, className }) => {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        )}
      >
        <motion.span
          layout
          className="inline-block h-4 w-4 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 22 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
};

export default Switch;
