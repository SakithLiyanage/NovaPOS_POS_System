import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, User, Percent } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CartItem from './CartItem';
import Button from '../ui/Button';
import AIRecommendations from '../ai/AIRecommendations';
import { formatCurrency } from '../../utils/formatters';

const CartPanel = ({ onCheckout, onCustomerClick, onDiscountClick }) => {
  const {
    items,
    customer,
    discount,
    clearCart,
    addItem,
    getSubtotal,
    getTaxAmount,
    getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const total = getTotal();
  const discountAmount = subtotal * (discount / 100);

  const handleAddRecommendedProduct = (product) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      taxRate: product.taxRate,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-96 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Current Sale</h2>
            {items.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <button onClick={onCustomerClick} className="mt-3 w-full flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 flex-1">{customer?.name || 'Walk-in Customer'}</span>
          <span className="text-xs text-indigo-600">Change</span>
        </button>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Add products to start a sale</p>
            </motion.div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </ul>
          )}
        </AnimatePresence>

        {/* AI Recommendations */}
        <AIRecommendations cartItems={items} onAddProduct={handleAddRecommendedProduct} />
      </div>

      {/* Discount button */}
      {items.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <button onClick={onDiscountClick} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
            <Percent className="w-4 h-4" />
            {discount > 0 ? `Discount: ${discount}%` : 'Add Discount'}
          </button>
        </div>
      )}

      {/* Totals */}
      <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount ({discount}%)</span>
              <span className="font-mono">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span className="font-mono">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="font-mono text-indigo-600">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-4" size="lg">
          Checkout (F4)
        </Button>
      </div>
    </motion.div>
  );
};

export default CartPanel;
