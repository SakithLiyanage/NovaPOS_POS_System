import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import SaleDetailView from '../components/sales/SaleDetailView';
import RefundModal from '../components/refund/RefundModal';
import { useSale } from '../hooks/useSales';
import { printReceipt, generateReceiptHTML } from '../utils/printUtils';

const SaleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRefund, setShowRefund] = useState(false);

  const { data, isLoading } = useSale(id);
  const sale = data?.data;

  const handlePrint = () => {
    if (sale) {
      const html = generateReceiptHTML(sale);
      printReceipt(html);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sale not found</p>
        <Button variant="secondary" onClick={() => navigate('/sales')} className="mt-4">
          Back to Sales
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/sales')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{sale.invoiceNo}</h1>
            <p className="text-gray-500">Sale Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Printer} onClick={handlePrint}>
            Print Receipt
          </Button>
          {sale.status === 'COMPLETED' && (
            <Button variant="destructive" icon={RotateCcw} onClick={() => setShowRefund(true)}>
              Refund
            </Button>
          )}
        </div>
      </div>

      <SaleDetailView sale={sale} />

      <RefundModal open={showRefund} onClose={() => setShowRefund(false)} sale={sale} />
    </motion.div>
  );
};

export default SaleDetailPage;
