import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Truck, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Table } from '../components/ui';
import api from '../services/api';
import toast from 'react-hot-toast';

const SuppliersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', email: '', phone: '', address: '' });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => api.get('/suppliers').then(res => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? api.put(`/suppliers/${editing._id}`, data) : api.post('/suppliers', data),
    onSuccess: () => { queryClient.invalidateQueries(['suppliers']); toast.success('Saved'); closeForm(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/suppliers/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['suppliers']); toast.success('Deleted'); },
  });

  const closeForm = () => { setShowForm(false); setEditing(null); setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' }); };

  const handleEdit = (supplier) => { setEditing(supplier); setFormData(supplier); setShowForm(true); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-500 mt-1">Manage your suppliers</p>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)}>Add Supplier</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? <div className="p-8 text-center">Loading...</div> : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Contact Person</Table.Head>
                <Table.Head>Phone</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((supplier) => (
                <Table.Row key={supplier._id}>
                  <Table.Cell className="font-medium">{supplier.name}</Table.Cell>
                  <Table.Cell>{supplier.contactPerson || '-'}</Table.Cell>
                  <Table.Cell>{supplier.phone || '-'}</Table.Cell>
                  <Table.Cell>{supplier.email || '-'}</Table.Cell>
                  <Table.Cell className="text-right">
                    <button onClick={() => handleEdit(supplier)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(supplier._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={showForm} onClose={closeForm} title={editing ? 'Edit Supplier' : 'Add Supplier'}>
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input label="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeForm} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveMutation.isPending} className="flex-1">Save</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default SuppliersPage;
