import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, RotateCcw } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/formatters';

const HeldSales = ({ open, onClose, onRecall }) => {
  const [heldSales, setHeldSales] = useLocalStorage('novapos-held-sales', []);

  const handleRecall = (sale) => {
    onRecall(sale);
    setHeldSales((prev) => prev.filter((s) => s.id !== sale.id));
    onClose();
  };

  const handleDelete = (saleId) => {
    setHeldSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const getTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Modal open={open} onClose={onClose} title="Held Sales" size="md">
      {heldSales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No held sales</p>
          <p className="text-sm mt-1">Sales you put on hold will appear here</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-auto">
          <AnimatePresence>
            {heldSales.map((sale) => (
              <motion.li
                key={sale.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {sale.customer?.name || 'Walk-in Customer'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.heldAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-mono font-semibold text-indigo-600">
                    {formatCurrency(getTotal(sale.items))}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => handleRecall(sale)}
                    className="flex-1"
                  >
                    Recall
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(sale.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Modal>
  );
};

export default HeldSales;
