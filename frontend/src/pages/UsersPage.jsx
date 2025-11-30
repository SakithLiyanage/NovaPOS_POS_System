import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, Badge, Avatar } from '../components/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';

const roles = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'CASHIER', label: 'Cashier' },
];

const UsersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CASHIER' });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, { name: formData.name, email: formData.email, role: formData.role });
        toast.success('User updated');
      } else {
        await api.post('/users', formData);
        toast.success('User created');
      }
      queryClient.invalidateQueries(['users']);
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'CASHIER' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deactivated');
        queryClient.invalidateQueries(['users']);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (newPassword && newPassword.length >= 6) {
      try {
        await api.post(`/users/${id}/reset-password`, { password: newPassword });
        toast.success('Password reset successfully');
      } catch (error) {
        toast.error('Failed to reset password');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage system users and roles</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'CASHIER' }); setShowForm(true); }}>
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>User</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>Role</Table.Head>
                <Table.Head>Last Login</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-gray-500">{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={user.role === 'OWNER' ? 'paid' : user.role === 'MANAGER' ? 'active' : 'default'}>
                      {user.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-gray-500">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={user.isActive ? 'active' : 'inactive'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <button onClick={() => handleResetPassword(user._id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Reset Password">
                      <Key className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(user)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          {!editingUser && (
            <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
          )}
          <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={roles} />
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={loading}>{editingUser ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UsersPage;
