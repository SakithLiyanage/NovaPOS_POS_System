import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Button from '../components/ui/Button';
import { SearchInput, DateRangePicker } from '../components/ui';
import SalesTable from '../components/sales/SalesTable';
import { useSales } from '../hooks/useSales';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';

const SalesHistoryPage = () => {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSales({
    search,
    startDate: dateRange.from,
    endDate: dateRange.to,
    page,
    limit: 20,
  });

  const handleExport = async () => {
    try {
      const response = await exportService.exportSales(dateRange);
      exportService.downloadFile(response.data, `sales_${Date.now()}.csv`);
      toast.success('Sales exported successfully');
    } catch (error) {
      toast.error('Failed to export sales');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
          <p className="text-gray-500 mt-1">View and manage all sales transactions</p>
        </div>
        <Button variant="secondary" icon={Download} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by invoice number..."
          className="w-full sm:w-64"
        />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SalesTable sales={data?.data || []} loading={isLoading} />
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-gray-600">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default SalesHistoryPage;
