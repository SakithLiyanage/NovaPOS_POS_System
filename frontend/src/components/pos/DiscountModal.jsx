import { useState } from 'react';
import { Percent } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useCartStore } from '../../store/cartStore';

const DiscountModal = ({ open, onClose }) => {
  const { discount, setDiscount, getSubtotal } = useCartStore();
  const [value, setValue] = useState(discount.toString());
  const subtotal = getSubtotal();

  const handleApply = () => {
    const numValue = parseFloat(value) || 0;
    setDiscount(Math.min(100, Math.max(0, numValue)));
    onClose();
  };

  const presetDiscounts = [5, 10, 15, 20, 25, 50];

  return (
    <Modal open={open} onClose={onClose} title="Apply Discount" size="sm">
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Discount Percentage"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-10"
          />
          <Percent className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-3 gap-2">
          {presetDiscounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setValue(preset.toString())}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                parseFloat(value) === preset
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>

        {/* Preview */}
        {parseFloat(value) > 0 && (
          <div className="p-3 bg-emerald-50 rounded-lg text-sm">
            <div className="flex justify-between text-emerald-700">
              <span>Discount Amount:</span>
              <span className="font-mono font-medium">
                -${((subtotal * parseFloat(value)) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={() => { setValue('0'); setDiscount(0); onClose(); }} className="flex-1">
            Clear
          </Button>
          <Button onClick={handleApply} className="flex-1">Apply</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DiscountModal;
