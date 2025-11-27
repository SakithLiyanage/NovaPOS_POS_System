import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { TextArea } from '../forms';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const RefundModal = ({ open, onClose, sale }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [refundType, setRefundType] = useState('full');
  const queryClient = useQueryClient();

  const refundMutation = useMutation({
    mutationFn: (data) => api.post(`/sales/${sale._id}/refund`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      toast.success('Refund processed successfully');
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to process refund'),
  });

  const handleItemToggle = (itemIndex) => {
    setSelectedItems(prev =>
      prev.includes(itemIndex)
        ? prev.filter(i => i !== itemIndex)
        : [...prev, itemIndex]
    );
  };

  const getRefundAmount = () => {
    if (refundType === 'full') return sale?.grandTotal || 0;
    return selectedItems.reduce((sum, idx) => sum + (sale?.items[idx]?.lineTotal || 0), 0);
  };

  const handleSubmit = () => {
    refundMutation.mutate({
      type: refundType,
      items: refundType === 'partial' ? selectedItems : undefined,
      reason,
    });
  };

  if (!sale) return null;

  return (
    <Modal open={open} onClose={onClose} title="Process Refund" size="md">
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">This action cannot be undone</p>
            <p>Refunding will restore inventory and update sales records.</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-gray-900">Refund Type</p>
          <div className="flex gap-4">
            {['full', 'partial'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value={type}
                  checked={refundType === type}
                  onChange={(e) => setRefundType(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="capitalize">{type} Refund</span>
              </label>
            ))}
          </div>
        </div>

        {refundType === 'partial' && (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">Select Items to Refund</p>
            {sale.items.map((item, idx) => (
              <label key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <Checkbox checked={selectedItems.includes(idx)} onChange={() => handleItemToggle(idx)} />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>
                <span className="font-mono">{formatCurrency(item.lineTotal)}</span>
              </label>
            ))}
          </div>
        )}

        <TextArea
          label="Refund Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for refund..."
          required
        />

        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Refund Amount</span>
            <span className="text-2xl font-bold text-red-600 font-mono">
              {formatCurrency(getRefundAmount())}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            variant="destructive"
            icon={RotateCcw}
            onClick={handleSubmit}
            loading={refundMutation.isLoading}
            disabled={!reason || (refundType === 'partial' && selectedItems.length === 0)}
            className="flex-1"
          >
            Process Refund
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RefundModal;
