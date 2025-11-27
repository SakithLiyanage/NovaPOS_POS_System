import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Receipt, Eye } from 'lucide-react';
import { useSales } from '../hooks/useSales';
import { Table, Badge, Skeleton } from '../components/ui';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    paymentMethod: '',
    page: 1,
  });

  const { data: sales, isLoading } = useSales(filters);

  const handleRowClick = (sale) => {
    navigate(`/sales/${sale._id}`);
  };

  const paymentMethodBadge = (method) => {
    const variants = {
      CASH: 'paid',
      CARD: 'active',
      OTHER: 'default',
    };
    return <Badge variant={variants[method] || 'default'}>{method}</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
        <p className="text-gray-500 mt-1">View and manage your sales transactions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
              placeholder="Search by invoice number..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value, page: 1 }))}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value, page: 1 }))}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={filters.paymentMethod}
          onChange={(e) => setFilters(f => ({ ...f, paymentMethod: e.target.value, page: 1 }))}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Payment Methods</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : sales?.data?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No sales found</h3>
          <p className="text-gray-500 mt-1">Sales will appear here after checkout</p>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Invoice</Table.Head>
              <Table.Head>Date</Table.Head>
              <Table.Head>Customer</Table.Head>
              <Table.Head>Cashier</Table.Head>
              <Table.Head>Items</Table.Head>
              <Table.Head>Payment</Table.Head>
              <Table.Head className="text-right">Total</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sales?.data?.map((sale) => (
              <Table.Row key={sale._id} onClick={() => handleRowClick(sale)}>
                <Table.Cell>
                  <span className="font-mono font-medium text-indigo-600">
                    {sale.invoiceNo}
                  </span>
                </Table.Cell>
                <Table.Cell>{formatDateTime(sale.createdAt)}</Table.Cell>
                <Table.Cell>{sale.customer?.name || 'Walk-in'}</Table.Cell>
                <Table.Cell>{sale.cashier?.name}</Table.Cell>
                <Table.Cell>{sale.items?.length || 0} items</Table.Cell>
                <Table.Cell>{paymentMethodBadge(sale.paymentMethod)}</Table.Cell>
                <Table.Cell className="text-right">
                  <span className="font-mono font-semibold">
                    {formatCurrency(sale.grandTotal)}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRowClick(sale); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Pagination */}
      {sales?.pagination && sales.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {filters.page} of {sales.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              disabled={filters.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              disabled={filters.page >= sales.pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SalesHistoryPage;
