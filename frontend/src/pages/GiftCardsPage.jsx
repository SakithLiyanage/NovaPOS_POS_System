import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Gift } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Table, Badge } from '../components/ui';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const GiftCardsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['gift-cards'],
    queryFn: () => api.get('/gift-cards').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/gift-cards', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['gift-cards']);
      toast.success(`Gift card created: ${res.data.data.code}`);
      setShowForm(false);
      setAmount('');
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="w-8 h-8 text-pink-500" />
          <div><h1 className="text-2xl font-bold">Gift Cards</h1><p className="text-gray-500">Manage gift cards</p></div>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)}>Create Gift Card</Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? <div className="p-8 text-center">Loading...</div> : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Code</Table.Head>
                <Table.Head>Initial Balance</Table.Head>
                <Table.Head>Current Balance</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Expiry</Table.Head>
                <Table.Head>Created</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((card) => (
                <Table.Row key={card._id}>
                  <Table.Cell><code className="px-2 py-1 bg-gray-100 rounded font-mono">{card.code}</code></Table.Cell>
                  <Table.Cell className="font-mono">{formatCurrency(card.initialBalance)}</Table.Cell>
                  <Table.Cell className="font-mono font-bold text-emerald-600">{formatCurrency(card.currentBalance)}</Table.Cell>
                  <Table.Cell><Badge variant={card.isActive ? 'active' : 'inactive'}>{card.isActive ? 'Active' : 'Inactive'}</Badge></Table.Cell>
                  <Table.Cell>{card.expiryDate ? formatDate(card.expiryDate) : 'No Expiry'}</Table.Cell>
                  <Table.Cell>{formatDate(card.createdAt)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Gift Card">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ amount: parseFloat(amount) }); }} className="space-y-4">
          <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Enter gift card value" />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={createMutation.isPending} className="flex-1">Create</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default GiftCardsPage;
