import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';
import { Card, Badge, Skeleton, ProgressBar } from '../ui';
import { useLowStock } from '../../hooks/useReports';

const LowStockWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useLowStock();

  const items = data?.data?.slice(0, 5) || [];

  return (
    <Card animate={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Low Stock Alert</h3>
        </div>
        <button
          onClick={() => navigate('/products?filter=low-stock')}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">All products well stocked!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((product) => {
            const stockPercent = (product.currentStock / product.lowStockThreshold) * 100;
            const isOutOfStock = product.currentStock === 0;
            
            return (
              <li
                key={product._id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => navigate(`/products?search=${product.sku}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 truncate">{product.name}</span>
                  <Badge variant={isOutOfStock ? 'lowStock' : 'due'}>
                    {product.currentStock} left
                  </Badge>
                </div>
                <ProgressBar
                  value={product.currentStock}
                  max={product.lowStockThreshold * 2}
                  color={isOutOfStock ? 'danger' : 'warning'}
                />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default LowStockWidget;
