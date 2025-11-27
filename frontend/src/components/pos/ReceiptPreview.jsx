import { forwardRef } from 'react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const ReceiptPreview = forwardRef(({ sale, storeName = 'NovaPOS' }, ref) => {
  if (!sale) return null;

  return (
    <div ref={ref} className="bg-white p-6 max-w-xs mx-auto font-mono text-sm">
      {/* Header */}
      <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
        <h1 className="text-xl font-bold">{storeName}</h1>
        <p className="text-gray-600 text-xs mt-1">Thank you for your purchase!</p>
      </div>

      {/* Invoice Info */}
      <div className="text-xs text-gray-600 mb-4">
        <p>Invoice: {sale.invoiceNo}</p>
        <p>Date: {formatDateTime(sale.createdAt)}</p>
        <p>Cashier: {sale.cashier?.name}</p>
        {sale.customer && <p>Customer: {sale.customer.name}</p>}
      </div>

      {/* Items */}
      <div className="border-t border-b border-dashed border-gray-300 py-3 mb-3">
        {sale.items?.map((item, index) => (
          <div key={index} className="flex justify-between text-xs mb-2">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
            </div>
            <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({sale.discount}%)</span>
            <span>-{formatCurrency(sale.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(sale.taxAmount)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-300">
          <span>TOTAL</span>
          <span>{formatCurrency(sale.grandTotal)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="mt-4 pt-3 border-t border-dashed border-gray-300 text-xs text-center">
        <p>Paid by: {sale.paymentMethod}</p>
        <p className="mt-4 text-gray-500">Thank you for shopping with us!</p>
      </div>
    </div>
  );
});

ReceiptPreview.displayName = 'ReceiptPreview';

export default ReceiptPreview;
