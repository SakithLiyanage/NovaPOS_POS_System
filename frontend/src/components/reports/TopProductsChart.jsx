import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';
import { Card, Skeleton } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'];

const TopProductsChart = ({ data, loading }) => {
  const chartData = data?.map((p) => ({
    name: p.name,
    value: p.revenue,
  })) || [];

  return (
    <Card animate={false}>
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Top Products by Revenue</h3>
      </div>
      {loading ? (
        <Skeleton className="h-64" />
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
              label={({ name }) => name.slice(0, 12)}
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
