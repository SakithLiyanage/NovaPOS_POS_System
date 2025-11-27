import { useState } from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const NumPad = ({ open, onClose, onConfirm, title = 'Enter Quantity', initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const handleDigit = (digit) => {
    if (value === '0') {
      setValue(digit);
    } else {
      setValue(value + digit);
    }
  };

  const handleBackspace = () => {
    setValue(value.slice(0, -1) || '0');
  };

  const handleClear = () => {
    setValue('0');
  };

  const handleConfirm = () => {
    const num = parseInt(value) || 0;
    if (num > 0) {
      onConfirm(num);
      setValue('');
      onClose();
    }
  };

  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '⌫'];

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <span className="text-4xl font-mono font-bold text-gray-900">
            {value || '0'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <motion.button
              key={btn}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '⌫') handleBackspace();
                else handleDigit(btn);
              }}
              className={`p-4 text-xl font-semibold rounded-xl transition-colors ${
                btn === 'C'
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : btn === '⌫'
                  ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {btn === '⌫' ? <Delete className="w-6 h-6 mx-auto" /> : btn}
            </motion.button>
          ))}
        </div>

        <Button onClick={handleConfirm} className="w-full" size="lg">
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default NumPad;
