import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Button, Input, Select } from '../ui';
import api from '../../services/api';
import toast from 'react-hot-toast';

const reasons = [
  { value: 'PURCHASE', label: 'Purchase / Restock' },
  { value: 'ADJUSTMENT', label: 'Inventory Adjustment' },
  { value: 'DAMAGE', label: 'Damaged Goods' },
  { value: 'RETURN', label: 'Customer Return' },
  { value: 'CORRECTION', label: 'Stock Correction' },
];

const StockAdjustmentModal = ({ open, onClose, product }) => {
  const [formData, setFormData] = useState({
    quantityChange: '',
    reason: 'ADJUSTMENT',
    notes: '',
  });

  const queryClient = useQueryClient();

  const adjustMutation = useMutation({
    mutationFn: (data) => api.post('/inventory/adjust', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['inventory']);
      toast.success('Stock adjusted successfully');
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to adjust stock');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    adjustMutation.mutate({
      productId: product._id,
      quantityChange: parseInt(formData.quantityChange),
      reason: formData.reason,
      notes: formData.notes,
    });
  };

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title="Adjust Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          <p className="text-sm text-gray-500">Current Stock: <span className="font-semibold">{product.currentStock}</span></p>
        </div>

        <Input
          label="Quantity Change"
          type="number"
          value={formData.quantityChange}
          onChange={(e) => setFormData({ ...formData, quantityChange: e.target.value })}
          placeholder="Enter positive or negative number"
          required
        />

        <Select
          label="Reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          options={reasons}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional notes..."
          />
        </div>

        {formData.quantityChange && (
          <div className="p-3 bg-indigo-50 rounded-lg text-sm">
            <span className="text-gray-600">New Stock: </span>
            <span className="font-semibold text-indigo-600">
              {product.currentStock + parseInt(formData.quantityChange || 0)}
            </span>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={adjustMutation.isLoading}>Adjust Stock</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StockAdjustmentModal;
