import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Table } from '../components/ui';
import CategoryForm from '../components/inventory/CategoryForm';
import { useCategories } from '../hooks/useProducts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useCategories();
  const queryClient = useQueryClient();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created');
      }
      queryClient.invalidateQueries(['categories']);
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted');
        queryClient.invalidateQueries(['categories']);
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your products</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingCategory(null); setShowForm(true); }}>
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : data?.data?.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No categories yet</p>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Description</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((category) => (
                <Table.Row key={category._id}>
                  <Table.Cell className="font-medium">{category.name}</Table.Cell>
                  <Table.Cell className="text-gray-500">{category.description || '-'}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <button onClick={() => { setEditingCategory(category); setShowForm(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(category._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingCategory(null); }} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingCategory(null); }}
          loading={loading}
        />
      </Modal>
    </motion.div>
  );
};

export default CategoriesPage;
