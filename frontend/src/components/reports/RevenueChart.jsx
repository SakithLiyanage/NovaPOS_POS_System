import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, Skeleton } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const RevenueChart = ({ data, loading }) => {
  const chartData = data?.map((d) => ({
    date: d.date.slice(5),
    revenue: d.revenue,
  })) || [];

  return (
    <Card animate={false}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Revenue Trend</h3>
      </div>
      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#6366F1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default RevenueChart;
