import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CustomerForm = ({ customer, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });

  useEffect(() => {
    if (customer) {
      setFormData({ name: customer.name || '', phone: customer.phone || '', email: customer.email || '', notes: customer.notes || '' });
    }
  }, [customer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
      <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <Input label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{customer ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};

export default CustomerForm;
