import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Mail, Download } from 'lucide-react';
import { useSale } from '../hooks/useSales';
import { Button, Card, Badge, Skeleton } from '../components/ui';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const SaleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sale, isLoading } = useSale(id);

  const handlePrint = () => {
    toast.success('Receipt sent to printer');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!sale?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sale not found</p>
        <Button onClick={() => navigate('/sales')} className="mt-4">
          Back to Sales
        </Button>
      </div>
    );
  }

  const saleData = sale.data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/sales')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice {saleData.invoiceNo}
            </h1>
            <p className="text-gray-500">{formatDateTime(saleData.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Mail} onClick={() => toast.success('Email sent')}>
            Email
          </Button>
          <Button variant="secondary" icon={Download}>
            PDF
          </Button>
          <Button icon={Printer} onClick={handlePrint}>
            Print
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <Card className="overflow-hidden" animate={false}>
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">NovaPOS</h2>
              <p className="text-indigo-200 mt-1">Demo Store</p>
            </div>
            <div className="text-right">
              <Badge variant={saleData.status === 'COMPLETED' ? 'paid' : 'due'}>
                {saleData.status}
              </Badge>
              <p className="text-indigo-200 mt-2">{saleData.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="p-6 grid grid-cols-2 gap-6 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
            <p className="font-medium text-gray-900">
              {saleData.customer?.name || 'Walk-in Customer'}
            </p>
            {saleData.customer?.phone && (
              <p className="text-gray-600">{saleData.customer.phone}</p>
            )}
            {saleData.customer?.email && (
              <p className="text-gray-600">{saleData.customer.email}</p>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cashier</h3>
            <p className="font-medium text-gray-900">{saleData.cashier?.name}</p>
            <p className="text-gray-600">{saleData.cashier?.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Item</th>
                <th className="text-center py-3 text-sm font-medium text-gray-500">Qty</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Price</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {saleData.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
                  </td>
                  <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                  <td className="text-right py-4 font-mono text-gray-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="text-right py-4 font-mono font-medium text-gray-900">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-6 bg-gray-50">
          <div className="max-w-xs ml-auto space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(saleData.subtotal)}</span>
            </div>
            {saleData.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({saleData.discount}%)</span>
                <span className="font-mono">-{formatCurrency(saleData.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span className="font-mono">{formatCurrency(saleData.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span className="font-mono text-indigo-600">{formatCurrency(saleData.grandTotal)}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SaleDetailPage;
