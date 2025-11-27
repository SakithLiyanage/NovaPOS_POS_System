import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, Skeleton } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const SalesTrendChart = ({ data, loading }) => {
  const chartData = data?.map((d) => ({
    date: d._id?.slice(5) || d.date?.slice(5),
    revenue: d.revenue,
    sales: d.count,
  })) || [];

  return (
    <Card animate={false}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Sales Trend (Last 7 Days)</h3>
      </div>
      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default SalesTrendChart;
