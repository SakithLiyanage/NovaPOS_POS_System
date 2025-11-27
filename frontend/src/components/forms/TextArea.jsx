import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import FormField from './FormField';

const TextArea = forwardRef(({
  label,
  error,
  required,
  hint,
  rows = 3,
  className,
  ...props
}, ref) => {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
          'text-gray-900 placeholder-gray-400 resize-none',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
          'transition-colors duration-200',
          'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
    </FormField>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
