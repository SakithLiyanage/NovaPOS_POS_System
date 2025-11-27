import { useState } from 'react';
import { Search, User, Plus, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';

const CustomerSelector = ({ open, onClose, onSelect, currentCustomer }) => {
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: () => api.get('/customers', { params: { search, limit: 10 } }).then(res => res.data),
    enabled: open,
  });

  const handleSelect = (customer) => {
    onSelect(customer);
    onClose();
  };

  const handleWalkIn = () => {
    onSelect(null);
    onClose();
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/customers', newCustomer);
      handleSelect(res.data.data);
      setShowCreateForm(false);
      setNewCustomer({ name: '', phone: '', email: '' });
    } catch (error) {
      console.error('Failed to create customer');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Select Customer" size="md">
      {!showCreateForm ? (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <button
            onClick={handleWalkIn}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 mb-3 transition-colors ${
              !currentCustomer ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Walk-in Customer</p>
              <p className="text-sm text-gray-500">No customer record</p>
            </div>
            {!currentCustomer && <Check className="w-5 h-5 text-indigo-600" />}
          </button>

          <div className="max-h-64 overflow-auto space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : customers?.data?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No customers found</div>
            ) : (
              customers?.data?.map((customer) => (
                <button
                  key={customer._id}
                  onClick={() => handleSelect(customer)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    currentCustomer?._id === customer._id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{customer.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone || customer.email || 'No contact'}</p>
                  </div>
                  {currentCustomer?._id === customer._id && <Check className="w-5 h-5 text-indigo-600" />}
                </button>
              ))
            )}
          </div>

          <Button
            variant="secondary"
            icon={Plus}
            onClick={() => setShowCreateForm(true)}
            className="w-full mt-4"
          >
            Create New Customer
          </Button>
        </>
      ) : (
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <Input
            label="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">Create & Select</Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CustomerSelector;
