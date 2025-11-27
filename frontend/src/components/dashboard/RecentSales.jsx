import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, Skeleton } from '../ui';
import api from '../../services/api';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const RecentSales = () => {
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery({
    queryKey: ['sales', 'recent'],
    queryFn: () => api.get('/sales', { params: { limit: 5 } }).then(res => res.data),
    refetchInterval: 30000,
  });

  return (
    <Card animate={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Recent Sales</h3>
        </div>
        <button
          onClick={() => navigate('/sales')}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      ) : (
        <ul className="space-y-3">
          {data?.data?.map((sale, index) => (
            <motion.li
              key={sale._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/sales/${sale._id}`)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div>
                <p className="font-mono text-sm font-medium text-indigo-600">{sale.invoiceNo}</p>
                <p className="text-xs text-gray-500">{formatDateTime(sale.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold">{formatCurrency(sale.grandTotal)}</p>
                <Badge variant={sale.paymentMethod === 'CASH' ? 'paid' : 'active'} className="text-xs">
                  {sale.paymentMethod}
                </Badge>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentSales;
