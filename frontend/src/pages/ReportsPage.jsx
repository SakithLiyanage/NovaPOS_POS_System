import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import { DateRangePicker, Card } from '../components/ui';
import RevenueChart from '../components/reports/RevenueChart';
import TopProductsChart from '../components/reports/TopProductsChart';
import SummaryCards from '../components/reports/SummaryCards';
import { useDashboardSummary, useSalesByDate, useTopProducts } from '../hooks/useReports';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: salesByDate, isLoading: salesLoading } = useSalesByDate({ startDate: dateRange.from, endDate: dateRange.to });
  const { data: topProducts, isLoading: topLoading } = useTopProducts({ startDate: dateRange.from, endDate: dateRange.to });

  const handleExport = async () => {
    try {
      const response = await exportService.exportSales({ startDate: dateRange.from, endDate: dateRange.to });
      exportService.downloadFile(response.data, `sales_report_${Date.now()}.csv`);
      toast.success('Report exported');
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button variant="secondary" icon={Download} onClick={handleExport}>Export</Button>
        </div>
      </div>

      <SummaryCards data={summary?.data} loading={summaryLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={salesByDate?.data} loading={salesLoading} />
        <TopProductsChart data={topProducts?.data} loading={topLoading} />
      </div>
    </motion.div>
  );
};

export default ReportsPage;
