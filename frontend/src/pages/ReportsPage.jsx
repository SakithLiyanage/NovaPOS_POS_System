import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, TrendingUp, Package, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSalesByDate, useTopProducts } from '../hooks/useReports';
import { Button, Card, DateRangePicker, Skeleton } from '../components/ui';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({ startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] });

  const { data: salesData, isLoading: salesLoading } = useSalesByDate(dateRange);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts({ ...dateRange, limit: 6 });

  const chartData = salesData?.data?.map(d => ({ date: d.date.slice(5), revenue: d.revenue, sales: d.count })) || [];
  const pieData = topProducts?.data?.map(p => ({ name: p.name, value: p.revenue })) || [];

  const handleExportSales = async () => {
    try {
      const response = await exportService.exportSales(dateRange);
      exportService.downloadFile(response.data, `sales_report_${Date.now()}.csv`);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            value={{ from: dateRange.startDate, to: dateRange.endDate }}
            onChange={({ from, to }) => setDateRange({ startDate: from, endDate: to })}
          />
          <Button variant="secondary" icon={Download} onClick={handleExportSales}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card animate={false}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Revenue Trend</h3>
          </div>
          {salesLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card animate={false}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Daily Sales Count</h3>
          </div>
          {salesLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card animate={false}>
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Top Products by Revenue</h3>
          </div>
          {productsLoading ? <Skeleton className="h-64" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name }) => name.slice(0, 15)}>
                  {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card animate={false}>
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold">Top Products List</h3>
          </div>
          {productsLoading ? <Skeleton className="h-64" /> : (
            <ul className="space-y-3">
              {topProducts?.data?.map((product, index) => (
                <li key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: COLORS[index % COLORS.length] }}>{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.soldCount} units sold</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-gray-900">{formatCurrency(product.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
