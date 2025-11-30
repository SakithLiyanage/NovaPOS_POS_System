import { Table, Badge, Card } from '../ui';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const SaleDetailView = ({ sale }) => {
  const statusColors = { COMPLETED: 'paid', REFUNDED: 'inactive', CANCELLED: 'lowStock' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card animate={false}>
          <h3 className="font-semibold mb-4">Items</h3>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Product</Table.Head>
                <Table.Head className="text-center">Qty</Table.Head>
                <Table.Head className="text-right">Price</Table.Head>
                <Table.Head className="text-right">Total</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sale.items?.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </Table.Cell>
                  <Table.Cell className="text-center">{item.quantity}</Table.Cell>
                  <Table.Cell className="text-right font-mono">{formatCurrency(item.unitPrice)}</Table.Cell>
                  <Table.Cell className="text-right font-mono font-semibold">{formatCurrency(item.lineTotal)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>

      <div className="space-y-6">
        <Card animate={false}>
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-500">Invoice</span><span className="font-mono font-medium">{sale.invoiceNo}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{formatDateTime(sale.createdAt)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Cashier</span><span>{sale.cashier?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Customer</span><span>{sale.customer?.name || 'Walk-in'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge variant={statusColors[sale.status]}>{sale.status}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><Badge>{sale.paymentMethod}</Badge></div>
            <hr />
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-mono">{formatCurrency(sale.subtotal)}</span></div>
            {sale.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount ({sale.discount}%)</span><span className="font-mono">-{formatCurrency(sale.discountAmount)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="font-mono">{formatCurrency(sale.taxAmount)}</span></div>
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="font-mono text-indigo-600">{formatCurrency(sale.grandTotal)}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SaleDetailView;
