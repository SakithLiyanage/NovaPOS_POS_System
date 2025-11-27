import { useState, useEffect } from 'react';
import { Button, Input } from '../ui';

const CategoryForm = ({ category, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [category]);

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
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter category name"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Optional description..."
        />
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
