import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';

const CategoryForm = ({ category, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name || '', description: category.description || '', isActive: category.isActive ?? true });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      <Checkbox label="Active" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{category ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};

export default CategoryForm;
