import { Card, Badge } from '../ui';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const SaleDetailView = ({ sale }) => {
  if (!sale) return null;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card animate={false} padding="sm">
          <p className="text-sm text-gray-500">Invoice Number</p>
          <p className="text-lg font-mono font-bold text-indigo-600">{sale.invoiceNo}</p>
        </Card>
        <Card animate={false} padding="sm">
          <p className="text-sm text-gray-500">Date & Time</p>
          <p className="text-lg font-medium">{formatDateTime(sale.createdAt)}</p>
        </Card>
        <Card animate={false} padding="sm">
          <p className="text-sm text-gray-500">Status</p>
          <Badge variant={sale.status === 'COMPLETED' ? 'paid' : 'due'} className="mt-1">
            {sale.status}
          </Badge>
        </Card>
      </div>

      {/* Customer & Cashier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card animate={false}>
          <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
          <p className="font-medium">{sale.customer?.name || 'Walk-in Customer'}</p>
          {sale.customer?.phone && <p className="text-gray-500 text-sm">{sale.customer.phone}</p>}
          {sale.customer?.email && <p className="text-gray-500 text-sm">{sale.customer.email}</p>}
        </Card>
        <Card animate={false}>
          <h3 className="font-semibold text-gray-900 mb-3">Cashier</h3>
          <p className="font-medium">{sale.cashier?.name}</p>
          <p className="text-gray-500 text-sm">{sale.cashier?.email}</p>
        </Card>
      </div>

      {/* Items */}
      <Card animate={false}>
        <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
        <div className="divide-y divide-gray-100">
          {sale.items?.map((item, index) => (
            <div key={index} className="py-3 flex justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-mono font-medium">{formatCurrency(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Totals */}
      <Card animate={false} className="bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(sale.subtotal)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount ({sale.discount}%)</span>
              <span className="font-mono">-{formatCurrency(sale.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span className="font-mono">{formatCurrency(sale.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200">
            <span>Grand Total</span>
            <span className="font-mono text-indigo-600">{formatCurrency(sale.grandTotal)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SaleDetailView;
