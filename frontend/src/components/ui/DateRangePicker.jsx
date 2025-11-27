import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const presets = [
  { label: 'Today', getValue: () => { const d = new Date(); return { from: d, to: d }; } },
  { label: 'Yesterday', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 1); return { from: d, to: d }; } },
  { label: 'Last 7 Days', getValue: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 7); return { from, to }; } },
  { label: 'Last 30 Days', getValue: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 30); return { from, to }; } },
  { label: 'This Month', getValue: () => { const now = new Date(); return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now }; } },
];

const formatDate = (date) => date.toISOString().split('T')[0];

const DateRangePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handlePresetClick = (preset) => {
    const { from, to } = preset.getValue();
    onChange({ from: formatDate(from), to: formatDate(to) });
    setOpen(false);
  };

  const displayText = value.from && value.to
    ? `${value.from} - ${value.to}`
    : 'Select date range';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">{displayText}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4 min-w-[300px]"
            >
              <div className="space-y-2 mb-4">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={value.from || ''}
                    onChange={(e) => onChange({ ...value, from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={value.to || ''}
                    onChange={(e) => onChange({ ...value, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangePicker;
