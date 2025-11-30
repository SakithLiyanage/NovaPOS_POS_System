import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Wallet, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useCartStore } from '../../store/cartStore';
import { useCreateSale } from '../../hooks/useSales';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'CASH', label: 'Cash', icon: Banknote },
  { id: 'CARD', label: 'Card', icon: CreditCard },
  { id: 'OTHER', label: 'Other', icon: Wallet },
];

const PaymentDialog = ({ open, onClose, onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState('CASH');
  const [amountPaid, setAmountPaid] = useState('');
  
  const { items, customer, discount, getSubtotal, getTaxAmount, getTotal, clearCart } = useCartStore();
  const createSale = useCreateSale();

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const total = getTotal();
  const discountAmount = subtotal * (discount / 100);
  const change = parseFloat(amountPaid || 0) - total;

  const handlePayment = async () => {
    try {
      const saleData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customerId: customer?._id,
        discount,
        paymentMethod: selectedMethod,
        amountPaid: parseFloat(amountPaid) || total,
      };

      await createSale.mutateAsync(saleData);
      toast.success('Sale completed successfully!');
      clearCart();
      onComplete?.();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const quickAmounts = [total, Math.ceil(total / 5) * 5, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20, 50, 100]
    .filter((v, i, a) => a.indexOf(v) === i && v >= total)
    .slice(0, 4);

  return (
    <Modal open={open} onClose={onClose} title="Complete Payment" size="md">
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount ({discount}%)</span>
              <span className="font-mono">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span className="font-mono">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total</span>
            <span className="font-mono text-indigo-600">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-colors ${
                  selectedMethod === method.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-indigo-600' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Paid (for Cash) */}
        {selectedMethod === 'CASH' && (
          <div>
            <Input
              label="Amount Received"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder={total.toFixed(2)}
            />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setAmountPaid(amount.toString())}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
            {parseFloat(amountPaid) >= total && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                <div className="flex justify-between text-emerald-700">
                  <span className="font-medium">Change</span>
                  <span className="font-mono font-bold">{formatCurrency(change)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            loading={createSale.isPending}
            disabled={selectedMethod === 'CASH' && parseFloat(amountPaid || 0) < total}
            icon={Check}
            className="flex-1"
          >
            Complete Sale
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDialog;
