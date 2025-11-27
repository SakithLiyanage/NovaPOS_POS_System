import { useState } from 'react';
import { Printer, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';

const PrintButton = ({ onPrint, onEmail, onDownload }) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: 'Print Receipt', onClick: onPrint, icon: '🖨️' },
    { label: 'Email Receipt', onClick: onEmail, icon: '📧' },
    { label: 'Download PDF', onClick: onDownload, icon: '📄' },
  ].filter(o => o.onClick);

  if (options.length === 1) {
    return (
      <Button icon={Printer} onClick={options[0].onClick}>
        {options[0].label}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button icon={Printer} onClick={() => setOpen(!open)}>
        Print <ChevronDown className="w-4 h-4 ml-1" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border z-50 py-1 min-w-[160px]"
            >
              {options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => { option.onClick(); setOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrintButton;
