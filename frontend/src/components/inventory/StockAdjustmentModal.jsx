import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import api from '../../services/api';
import toast from 'react-hot-toast';

const reasons = [
  { value: 'RESTOCK', label: 'Restock' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'RETURN', label: 'Customer Return' },
];

const StockAdjustmentModal = ({ open, onClose, product }) => {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('ADJUSTMENT');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => api.post('/inventory/adjust', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Stock adjusted');
      handleClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to adjust stock'),
  });

  const handleClose = () => {
    setQuantity('');
    setReason('ADJUSTMENT');
    setNotes('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ productId: product._id, quantityChange: parseInt(quantity), reason, notes });
  };

  if (!product) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Adjust Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">Current Stock: <span className="font-mono">{product.currentStock}</span></p>
        </div>
        <Input label="Quantity Change" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Use negative for reduction" required />
        <Select label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} options={reasons} />
        <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={mutation.isPending} className="flex-1">Adjust Stock</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StockAdjustmentModal;
