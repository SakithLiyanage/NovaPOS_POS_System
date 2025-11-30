import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-gray-50 rounded-lg p-3"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{item.name}</p>
          <p className="text-sm text-gray-500 font-mono">
            {formatCurrency(item.price)}
          </p>
        </div>
        <button
          onClick={() => removeItem(item.productId)}
          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span className="font-semibold font-mono text-indigo-600">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>
    </motion.li>
  );
};

export default CartItem;
