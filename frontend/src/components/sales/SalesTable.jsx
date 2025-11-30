import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Table, Badge } from '../ui';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const SalesTable = ({ sales, loading }) => {
  const navigate = useNavigate();

  const statusColors = {
    COMPLETED: 'paid',
    REFUNDED: 'inactive',
    CANCELLED: 'lowStock',
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (!sales?.length) {
    return <div className="p-8 text-center text-gray-500">No sales found</div>;
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Date</Table.Head>
          <Table.Head>Cashier</Table.Head>
          <Table.Head>Customer</Table.Head>
          <Table.Head>Total</Table.Head>
          <Table.Head>Payment</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sales.map((sale) => (
          <Table.Row key={sale._id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/sales/${sale._id}`)}>
            <Table.Cell className="font-mono font-medium text-indigo-600">{sale.invoiceNo}</Table.Cell>
            <Table.Cell className="text-gray-500">{formatDateTime(sale.createdAt)}</Table.Cell>
            <Table.Cell>{sale.cashier?.name || 'N/A'}</Table.Cell>
            <Table.Cell>{sale.customer?.name || 'Walk-in'}</Table.Cell>
            <Table.Cell className="font-mono font-semibold">{formatCurrency(sale.grandTotal)}</Table.Cell>
            <Table.Cell><Badge variant="default">{sale.paymentMethod}</Badge></Table.Cell>
            <Table.Cell><Badge variant={statusColors[sale.status]}>{sale.status}</Badge></Table.Cell>
            <Table.Cell className="text-right">
              <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={(e) => { e.stopPropagation(); navigate(`/sales/${sale._id}`); }}>
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default SalesTable;
