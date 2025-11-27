import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Modal, Input, Skeleton } from '../components/ui';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';

const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });

  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: () => api.get('/customers', { params: { search } }).then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer created');
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/customers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer updated');
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer deleted');
    },
  });

  const handleOpenForm = (customer = null) => {
    if (customer) {
      setEditCustomer(customer);
      setFormData({ name: customer.name, phone: customer.phone || '', email: customer.email || '', notes: customer.notes || '' });
    } else {
      setEditCustomer(null);
      setFormData({ name: '', phone: '', email: '', notes: '' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditCustomer(null);
    setFormData({ name: '', phone: '', email: '', notes: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCustomer) {
      updateMutation.mutate({ id: editCustomer._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <Button onClick={() => handleOpenForm()} icon={Plus}>Add Customer</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : customers?.data?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
          <Button onClick={() => handleOpenForm()} className="mt-4" icon={Plus}>Add Customer</Button>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Phone</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {customers?.data?.map((customer) => (
              <Table.Row key={customer._id}>
                <Table.Cell><span className="font-medium">{customer.name}</span></Table.Cell>
                <Table.Cell>{customer.phone || '-'}</Table.Cell>
                <Table.Cell>{customer.email || '-'}</Table.Cell>
                <Table.Cell>{formatDate(customer.createdAt)}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenForm(customer)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(customer._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal open={showForm} onClose={handleCloseForm} title={editCustomer ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit" loading={createMutation.isLoading || updateMutation.isLoading}>
              {editCustomer ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default CustomersPage;
