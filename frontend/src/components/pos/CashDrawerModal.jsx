import { useState } from 'react';
import { DollarSign, Lock, Unlock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const CashDrawerModal = ({ open, onClose }) => {
  const [openingBalance, setOpeningBalance] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: drawer, isLoading } = useQuery({
    queryKey: ['cash-drawer', 'current'],
    queryFn: () => api.get('/cash-drawer/current').then(res => res.data),
    enabled: open,
  });

  const openDrawer = useMutation({
    mutationFn: (data) => api.post('/cash-drawer/open', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cash-drawer']);
      toast.success('Cash drawer opened');
      setOpeningBalance('');
      setNotes('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to open drawer'),
  });

  const closeDrawer = useMutation({
    mutationFn: (data) => api.post('/cash-drawer/close', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['cash-drawer']);
      toast.success('Cash drawer closed');
      setClosingBalance('');
      setNotes('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to close drawer'),
  });

  const handleOpen = () => {
    openDrawer.mutate({ openingBalance: parseFloat(openingBalance) || 0, notes });
  };

  const handleClose = () => {
    closeDrawer.mutate({ closingBalance: parseFloat(closingBalance), notes });
  };

  const isOpen = drawer?.data?.status === 'OPEN';

  return (
    <Modal open={open} onClose={onClose} title="Cash Drawer" size="md">
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading...</div>
      ) : isOpen ? (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <Unlock className="w-5 h-5" />
              <span className="font-semibold">Drawer is OPEN</span>
            </div>
            <p className="text-sm text-emerald-600">
              Opened by {drawer.data.openedBy?.name} at {new Date(drawer.data.openedAt).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Opening Balance</p>
              <p className="text-xl font-bold font-mono">{formatCurrency(drawer.data.openingBalance)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Expected Balance</p>
              <p className="text-xl font-bold font-mono text-indigo-600">
                {formatCurrency(drawer.data.openingBalance + (drawer.data.cashSales || 0))}
              </p>
            </div>
          </div>

          <Input
            label="Actual Closing Balance"
            type="number"
            step="0.01"
            value={closingBalance}
            onChange={(e) => setClosingBalance(e.target.value)}
            placeholder="Count your cash..."
          />

          <Input
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about discrepancies..."
          />

          <Button onClick={handleClose} loading={closeDrawer.isPending} icon={Lock} className="w-full" variant="destructive">
            Close Cash Drawer
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-gray-100 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">Drawer is CLOSED</span>
            </div>
            <p className="text-sm text-gray-500">Open the drawer to start accepting sales</p>
          </div>

          <Input
            label="Opening Balance"
            type="number"
            step="0.01"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="Enter starting cash amount..."
          />

          <Input
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button onClick={handleOpen} loading={openDrawer.isPending} icon={Unlock} className="w-full">
            Open Cash Drawer
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default CashDrawerModal;
