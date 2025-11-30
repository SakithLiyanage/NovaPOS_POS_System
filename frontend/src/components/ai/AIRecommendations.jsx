import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const AIRecommendations = ({ cartItems, onAddProduct }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-recommendations', cartItems?.map(i => i.productId)],
    queryFn: () => api.post('/ai/recommendations', { cartItems }).then(res => res.data),
    enabled: cartItems?.length > 0,
    staleTime: 60000,
  });

  if (!cartItems?.length || isLoading || !data?.data?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-700">AI Recommends</span>
      </div>
      <div className="space-y-2">
        {data.data.slice(0, 3).map((product) => (
          <div key={product._id} className="flex items-center justify-between bg-white p-2 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">{product.name}</p>
              <p className="text-xs text-gray-500">{formatCurrency(product.salePrice)}</p>
            </div>
            <button
              onClick={() => onAddProduct(product)}
              className="p-1.5 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIRecommendations;
