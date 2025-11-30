import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Percent, Tag, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, Badge } from '../components/ui';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const DiscountsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxDiscount: '', startDate: '', endDate: '', usageLimit: '',
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => api.get('/discounts').then(res => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/discounts/${editing._id}`, data) : api.post('/discounts', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['discounts']);
      toast.success(editing ? 'Discount updated' : 'Discount created');
      closeForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/discounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['discounts']);
      toast.success('Discount deleted');
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ name: '', code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxDiscount: '', startDate: '', endDate: '', usageLimit: '' });
  };

  const handleEdit = (discount) => {
    setEditing(discount);
    setFormData({
      name: discount.name,
      code: discount.code || '',
      type: discount.type,
      value: discount.value,
      minPurchase: discount.minPurchase || '',
      maxDiscount: discount.maxDiscount || '',
      startDate: discount.startDate?.split('T')[0] || '',
      endDate: discount.endDate?.split('T')[0] || '',
      usageLimit: discount.usageLimit || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      value: parseFloat(formData.value),
      minPurchase: parseFloat(formData.minPurchase) || 0,
      maxDiscount: parseFloat(formData.maxDiscount) || null,
      usageLimit: parseInt(formData.usageLimit) || null,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts & Promotions</h1>
          <p className="text-gray-500 mt-1">Manage discount codes and promotions</p>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)}>Create Discount</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Code</Table.Head>
                <Table.Head>Type</Table.Head>
                <Table.Head>Value</Table.Head>
                <Table.Head>Usage</Table.Head>
                <Table.Head>Valid Until</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((discount) => (
                <Table.Row key={discount._id}>
                  <Table.Cell className="font-medium">{discount.name}</Table.Cell>
                  <Table.Cell><code className="px-2 py-1 bg-gray-100 rounded text-sm">{discount.code || '-'}</code></Table.Cell>
                  <Table.Cell><Badge variant={discount.type === 'PERCENTAGE' ? 'active' : 'default'}>{discount.type}</Badge></Table.Cell>
                  <Table.Cell className="font-mono">{discount.type === 'PERCENTAGE' ? `${discount.value}%` : formatCurrency(discount.value)}</Table.Cell>
                  <Table.Cell>{discount.usedCount || 0}{discount.usageLimit ? `/${discount.usageLimit}` : ''}</Table.Cell>
                  <Table.Cell>{discount.endDate ? formatDate(discount.endDate) : 'No expiry'}</Table.Cell>
                  <Table.Cell className="text-right">
                    <button onClick={() => handleEdit(discount)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(discount._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={showForm} onClose={closeForm} title={editing ? 'Edit Discount' : 'Create Discount'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input label="Code (Optional)" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g., SAVE20" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} options={[{value:'PERCENTAGE',label:'Percentage'},{value:'FIXED',label:'Fixed Amount'}]} />
            <Input label="Value" type="number" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Purchase" type="number" value={formData.minPurchase} onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} />
            <Input label="Max Discount" type="number" value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
          </div>
          <Input label="Usage Limit" type="number" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} placeholder="Leave empty for unlimited" />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeForm} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveMutation.isPending} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default DiscountsPage;
