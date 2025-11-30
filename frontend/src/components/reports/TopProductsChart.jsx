import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'];

const TopProductsChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Card animate={false}>
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Top Products by Revenue</h3>
        </div>
        <Skeleton className="h-64" />
      </Card>
    );
  }

  const chartData = (data || []).map((p) => ({
    name: p.name || 'Unknown',
    value: p.revenue || 0,
  }));

  return (
    <Card animate={false}>
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Top Products by Revenue</h3>
      </div>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name }) => name?.slice(0, 12) || ''}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default TopProductsChart;
