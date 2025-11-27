import { useState, useEffect } from 'react';
import { Button, Input } from '../ui';

const CustomerForm = ({ customer, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        notes: customer.notes || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Customer name"
      />
      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone number"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email@example.com"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Additional notes..."
        />
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
