import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const Checkbox = forwardRef(({ label, className, checked, onChange, ...props }, ref) => {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
            checked
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-gray-300 bg-white hover:border-gray-400'
          )}
        >
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
