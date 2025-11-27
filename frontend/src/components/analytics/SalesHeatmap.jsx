import { useQuery } from '@tanstack/react-query';
import { Card, Skeleton } from '../ui';
import api from '../../services/api';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const SalesHeatmap = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'heatmap'],
    queryFn: () => api.get('/reports/sales-heatmap').then(res => res.data),
  });

  const getColor = (value, max) => {
    if (!value) return 'bg-gray-100';
    const intensity = Math.min(value / max, 1);
    if (intensity < 0.25) return 'bg-indigo-100';
    if (intensity < 0.5) return 'bg-indigo-300';
    if (intensity < 0.75) return 'bg-indigo-500';
    return 'bg-indigo-700';
  };

  const heatmapData = data?.data || {};
  const maxValue = Math.max(...Object.values(heatmapData).map(d => d.count || 0), 1);

  return (
    <Card animate={false}>
      <h3 className="text-lg font-semibold mb-4">Sales by Day & Hour</h3>
      {isLoading ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-1 mb-2 ml-12">
            {hours.filter(h => h % 3 === 0).map(h => (
              <span key={h} className="text-xs text-gray-500 w-8 text-center">{h}:00</span>
            ))}
          </div>
          {days.map(day => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="w-10 text-xs text-gray-500 text-right pr-2">{day}</span>
              {hours.map(hour => {
                const key = `${day}-${hour}`;
                const value = heatmapData[key]?.count || 0;
                return (
                  <div
                    key={hour}
                    className={`w-3 h-3 rounded-sm ${getColor(value, maxValue)}`}
                    title={`${day} ${hour}:00 - ${value} sales`}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="w-3 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-100 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-300 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-700 rounded-sm" />
            <span>More</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SalesHeatmap;
