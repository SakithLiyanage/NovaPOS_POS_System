import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Receipt, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, Badge, DateRangePicker } from '../components/ui';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const categories = [
  { value: 'RENT', label: 'Rent' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'SALARIES', label: 'Salaries' },
  { value: 'SUPPLIES', label: 'Supplies' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'OTHER', label: 'Other' },
];

const ExpensesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [formData, setFormData] = useState({ category: 'OTHER', amount: '', description: '', vendor: '', date: new Date().toISOString().split('T')[0] });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['expenses', dateRange],
    queryFn: () => api.get('/expenses', { params: { startDate: dateRange.from, endDate: dateRange.to } }).then(res => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/expenses/${editing._id}`, data) : api.post('/expenses', data),
    onSuccess: () => { queryClient.invalidateQueries(['expenses']); toast.success('Expense saved'); closeForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/expenses/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['expenses']); toast.success('Expense deleted'); },
  });

  const closeForm = () => { setShowForm(false); setEditing(null); setFormData({ category: 'OTHER', amount: '', description: '', vendor: '', date: new Date().toISOString().split('T')[0] }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Expenses</h1><p className="text-gray-500">Track business expenses</p></div>
        <div className="flex gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button icon={Plus} onClick={() => setShowForm(true)}>Add Expense</Button>
        </div>
      </div>

      {data?.summary && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Total Expenses</p><p className="text-2xl font-bold text-red-600">{formatCurrency(data.summary.total)}</p></div>
          <div className="bg-white rounded-xl p-4 border"><p className="text-sm text-gray-500">Number of Entries</p><p className="text-2xl font-bold">{data.summary.count}</p></div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Date</Table.Head>
              <Table.Head>Category</Table.Head>
              <Table.Head>Description</Table.Head>
              <Table.Head>Vendor</Table.Head>
              <Table.Head className="text-right">Amount</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.data?.map((e) => (
              <Table.Row key={e._id}>
                <Table.Cell>{formatDate(e.date)}</Table.Cell>
                <Table.Cell><Badge>{e.category}</Badge></Table.Cell>
                <Table.Cell>{e.description}</Table.Cell>
                <Table.Cell>{e.vendor || '-'}</Table.Cell>
                <Table.Cell className="text-right font-mono text-red-600">{formatCurrency(e.amount)}</Table.Cell>
                <Table.Cell className="text-right">
                  <button onClick={() => { setEditing(e); setFormData({ category: e.category, amount: e.amount, description: e.description, vendor: e.vendor || '', date: e.date.split('T')[0] }); setShowForm(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteMutation.mutate(e._id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Modal open={showForm} onClose={closeForm} title={editing ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate({ ...formData, amount: parseFloat(formData.amount) }); }} className="space-y-4">
          <Select label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} options={categories} />
          <Input label="Amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
          <Input label="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          <Input label="Vendor" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} />
          <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeForm} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveMutation.isPending} className="flex-1">Save</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default ExpensesPage;
