import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  debounce = 300,
  className,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounce);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
