import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  label,
  error,
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
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
          'text-gray-900 placeholder-gray-400',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
          'transition-colors duration-200',
          'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
