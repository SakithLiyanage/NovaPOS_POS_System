import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SearchInput } from '../components/ui';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerForm from '../components/customers/CustomerForm';
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { data, isLoading, refetch } = useCustomers({ search });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const handleSubmit = async (formData) => {
    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({ id: editingCustomer._id, data: formData });
      } else {
        await createCustomer.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      // Handled by mutation
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        toast.success('Customer deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingCustomer(null); setShowForm(true); }}>
          Add Customer
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search customers..."
        className="w-full max-w-md"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <CustomerTable
            customers={data?.data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingCustomer(null); }}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingCustomer(null); }}
          loading={createCustomer.isPending || updateCustomer.isPending}
        />
      </Modal>
    </motion.div>
  );
};

export default CustomersPage;
