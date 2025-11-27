import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeItem(item.productId);
    } else {
      updateQuantity(item.productId, newQty);
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 rounded-lg p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            {formatCurrency(item.price)} each
          </p>
        </div>
        <button
          onClick={() => removeItem(item.productId)}
          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        {/* Quantity controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-10 text-center font-medium text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Line total */}
        <span className="font-semibold text-gray-900 font-mono">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>
    </motion.li>
  );
};

export default CartItem;
