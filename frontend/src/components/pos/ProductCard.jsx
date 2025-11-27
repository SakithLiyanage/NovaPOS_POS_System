import { motion } from 'framer-motion';
import { Package, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProductCard = ({ product, onSelect }) => {
  const isLowStock = product.currentStock <= product.lowStockThreshold;
  const isOutOfStock = product.currentStock <= 0;

  return (
    <motion.button
      variants={item}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isOutOfStock && onSelect(product)}
      disabled={isOutOfStock}
      className={`
        relative bg-white rounded-xl border border-gray-200 p-4 text-left
        transition-shadow hover:shadow-lg hover:border-indigo-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-8 h-8 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
      <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
      <p className="text-lg font-semibold text-indigo-600 mt-1 font-mono">
        {formatCurrency(product.salePrice)}
      </p>

      {/* Stock indicator */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">
          <AlertTriangle className="w-3 h-3" />
          Low
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
          Out of Stock
        </div>
      )}
    </motion.button>
  );
};

export default ProductCard;
