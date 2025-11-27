import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select...',
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10',
            'text-gray-900 appearance-none',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
            'transition-colors duration-200',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
