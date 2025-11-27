import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Banknote, Wallet, CheckCircle, Printer } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useCreateSale } from '../../hooks/useSales';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'CASH', name: 'Cash', icon: Banknote },
  { id: 'CARD', name: 'Card', icon: CreditCard },
  { id: 'OTHER', name: 'Other', icon: Wallet },
];

const PaymentDialog = ({ open, onClose, onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState('CASH');
  const [amountReceived, setAmountReceived] = useState('');
  const [saleComplete, setSaleComplete] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  const { items, customer, discount, getTotal, clearCart } = useCartStore();
  const createSale = useCreateSale();

  const total = getTotal();
  const change = parseFloat(amountReceived) - total;

  const handleSubmit = async () => {
    if (selectedMethod === 'CASH' && parseFloat(amountReceived) < total) {
      toast.error('Insufficient amount received');
      return;
    }

    try {
      const saleData = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          taxRate: item.taxRate || 0,
        })),
        customerId: customer?._id || null,
        discount,
        paymentMethod: selectedMethod,
      };

      const result = await createSale.mutateAsync(saleData);
      setCompletedSale(result.data);
      setSaleComplete(true);
    } catch (error) {
      toast.error('Failed to complete sale');
    }
  };

  const handleNewSale = () => {
    setSaleComplete(false);
    setCompletedSale(null);
    setSelectedMethod('CASH');
    setAmountReceived('');
    onComplete();
  };

  const handlePrint = () => {
    toast.success('Receipt sent to printer');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!saleComplete ? onClose : undefined}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {!saleComplete ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Total */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-4xl font-bold text-gray-900 font-mono">
                    {formatCurrency(total)}
                  </p>
                </div>

                {/* Payment methods */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`
                          flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                          ${selectedMethod === method.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }
                        `}
                      >
                        <method.icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash amount input */}
                {selectedMethod === 'CASH' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 text-2xl font-mono text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus
                    />
                    {parseFloat(amountReceived) >= total && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-center text-lg font-semibold text-emerald-600"
                      >
                        Change: {formatCurrency(change)}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Quick amounts for cash */}
                {selectedMethod === 'CASH' && (
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[10, 20, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setAmountReceived(amount.toString())}
                        className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <Button
                  onClick={handleSubmit}
                  loading={createSale.isLoading}
                  disabled={selectedMethod === 'CASH' && parseFloat(amountReceived) < total}
                  className="w-full"
                  size="lg"
                >
                  Complete Sale
                </Button>
              </div>
            </>
          ) : (
            /* Success state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Complete!</h2>
              <p className="text-gray-500 mb-2">Invoice #{completedSale?.invoiceNo}</p>
              <p className="text-3xl font-bold text-emerald-600 font-mono mb-6">
                {formatCurrency(total)}
              </p>

              {selectedMethod === 'CASH' && change > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-amber-800 font-medium">
                    Change Due: <span className="font-mono">{formatCurrency(change)}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handlePrint}
                  icon={Printer}
                  className="flex-1"
                >
                  Print Receipt
                </Button>
                <Button
                  onClick={handleNewSale}
                  className="flex-1"
                >
                  New Sale
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentDialog;
