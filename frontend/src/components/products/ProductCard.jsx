import { motion } from 'framer-motion';
import { Package, Edit, MoreVertical, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product, onEdit, onAdjustStock }) => {
  const isLowStock = product.currentStock <= product.lowStockThreshold;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {!product.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="inactive">Inactive</Badge>
          </div>
        )}
        {isLowStock && product.isActive && (
          <div className="absolute top-2 right-2">
            <Badge variant="lowStock" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Low Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 font-mono">{product.sku}</p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-indigo-600 font-mono">
            {formatCurrency(product.salePrice)}
          </span>
          <button
            onClick={() => onAdjustStock?.(product)}
            className={`text-sm font-mono px-2 py-1 rounded ${
              isLowStock ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {product.currentStock} in stock
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
