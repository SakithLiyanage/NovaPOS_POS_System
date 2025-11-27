import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Table, Badge } from '../ui';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const SalesTable = ({ sales, loading }) => {
  const navigate = useNavigate();

  const getPaymentBadgeVariant = (method) => {
    const variants = { CASH: 'paid', CARD: 'active', OTHER: 'default' };
    return variants[method] || 'default';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = { COMPLETED: 'paid', REFUNDED: 'due', CANCELLED: 'inactive' };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Date</Table.Head>
          <Table.Head>Customer</Table.Head>
          <Table.Head>Items</Table.Head>
          <Table.Head>Payment</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Total</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sales?.map((sale) => (
          <Table.Row key={sale._id} onClick={() => navigate(`/sales/${sale._id}`)}>
            <Table.Cell>
              <span className="font-mono font-medium text-indigo-600">{sale.invoiceNo}</span>
            </Table.Cell>
            <Table.Cell className="text-gray-500">{formatDateTime(sale.createdAt)}</Table.Cell>
            <Table.Cell>{sale.customer?.name || 'Walk-in'}</Table.Cell>
            <Table.Cell>{sale.items?.length || 0} items</Table.Cell>
            <Table.Cell>
              <Badge variant={getPaymentBadgeVariant(sale.paymentMethod)}>{sale.paymentMethod}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={getStatusBadgeVariant(sale.status)}>{sale.status}</Badge>
            </Table.Cell>
            <Table.Cell className="text-right">
              <span className="font-mono font-semibold">{formatCurrency(sale.grandTotal)}</span>
            </Table.Cell>
            <Table.Cell className="text-right">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/sales/${sale._id}`); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default SalesTable;
