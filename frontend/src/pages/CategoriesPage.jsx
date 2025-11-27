import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Modal, Input, Card, Skeleton } from '../components/ui';
import api from '../services/api';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [activeTab, setActiveTab] = useState('categories');

  const queryClient = useQueryClient();

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data),
  });

  const { data: brands, isLoading: brandLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => api.get('/brands').then(res => res.data),
  });

  const createCatMutation = useMutation({
    mutationFn: (data) => api.post('/categories', data),
    onSuccess: () => { queryClient.invalidateQueries(['categories']); toast.success('Category created'); handleCloseForm(); },
  });

  const updateCatMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['categories']); toast.success('Category updated'); handleCloseForm(); },
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['categories']); toast.success('Category deleted'); },
  });

  const createBrandMutation = useMutation({
    mutationFn: (data) => api.post('/brands', data),
    onSuccess: () => { queryClient.invalidateQueries(['brands']); toast.success('Brand created'); handleCloseForm(); },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/brands/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['brands']); toast.success('Brand updated'); handleCloseForm(); },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id) => api.delete(`/brands/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['brands']); toast.success('Brand deleted'); },
  });

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({ name: item.name, description: item.description || '' });
    } else {
      setEditItem(null);
      setFormData({ name: '', description: '' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => { setShowForm(false); setEditItem(null); setFormData({ name: '', description: '' }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'categories') {
      editItem ? updateCatMutation.mutate({ id: editItem._id, data: formData }) : createCatMutation.mutate(formData);
    } else {
      editItem ? updateBrandMutation.mutate({ id: editItem._id, data: { name: formData.name } }) : createBrandMutation.mutate({ name: formData.name });
    }
  };

  const handleDelete = (id) => {
    if (activeTab === 'categories') deleteCatMutation.mutate(id);
    else deleteBrandMutation.mutate(id);
  };

  const isLoading = activeTab === 'categories' ? catLoading : brandLoading;
  const items = activeTab === 'categories' ? categories?.data : brands?.data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories & Brands</h1>
          <p className="text-gray-500 mt-1">Organize your products</p>
        </div>
        <Button onClick={() => handleOpenForm()} icon={Plus}>Add {activeTab === 'categories' ? 'Category' : 'Brand'}</Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['categories', 'brands'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : !items?.length ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FolderTree className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No {activeTab} found</h3>
          <Button onClick={() => handleOpenForm()} className="mt-4" icon={Plus}>Add {activeTab === 'categories' ? 'Category' : 'Brand'}</Button>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              {activeTab === 'categories' && <Table.Head>Description</Table.Head>}
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item._id}>
                <Table.Cell><span className="font-medium">{item.name}</span></Table.Cell>
                {activeTab === 'categories' && <Table.Cell className="text-gray-500">{item.description || '-'}</Table.Cell>}
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenForm(item)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal open={showForm} onClose={handleCloseForm} title={`${editItem ? 'Edit' : 'Add'} ${activeTab === 'categories' ? 'Category' : 'Brand'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          {activeTab === 'categories' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit">{editItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default CategoriesPage;
