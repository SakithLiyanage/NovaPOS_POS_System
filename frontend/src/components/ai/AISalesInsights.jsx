import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, RefreshCw, Lightbulb } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import api from '../../services/api';

const AISalesInsights = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['ai-sales-analysis', refreshKey],
    queryFn: () => api.get('/ai/sales-analysis').then(res => res.data),
    staleTime: 300000,
  });

  return (
    <Card animate={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setRefreshKey(k => k + 1)}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 whitespace-pre-line">{data?.data?.analysis}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AISalesInsights;
