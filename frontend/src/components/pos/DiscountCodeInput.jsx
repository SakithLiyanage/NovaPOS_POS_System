import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Button from '../ui/Button';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const DiscountCodeInput = ({ subtotal, onApply, appliedDiscount, onRemove }) => {
  const [code, setCode] = useState('');

  const validateDiscount = useMutation({
    mutationFn: (data) => api.post('/discounts/validate', data).then(res => res.data),
    onSuccess: (res) => {
      onApply(res.data);
      setCode('');
      toast.success(`Discount applied: ${formatCurrency(res.data.discountAmount)} off`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Invalid discount code'),
  });

  const handleApply = () => {
    if (!code.trim()) return;
    validateDiscount.mutate({ code: code.trim(), subtotal });
  };

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            {appliedDiscount.discount.code || appliedDiscount.discount.name}
          </span>
          <span className="text-sm text-emerald-600">
            (-{formatCurrency(appliedDiscount.discountAmount)})
          </span>
        </div>
        <button onClick={onRemove} className="p-1 hover:bg-emerald-100 rounded">
          <X className="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Discount code"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <Button size="sm" onClick={handleApply} loading={validateDiscount.isPending} disabled={!code.trim()}>
        <Check className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DiscountCodeInput;
