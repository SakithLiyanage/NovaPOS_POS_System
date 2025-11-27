import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, UserCircle, Key } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Table, Modal, Input, Select, Badge, Skeleton } from '../components/ui';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDateTime } from '../utils/formatters';

const UsersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CASHIER' });
  const [newPassword, setNewPassword] = useState('');

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/users', data),
    onSuccess: () => { queryClient.invalidateQueries(['users']); toast.success('User created'); handleCloseForm(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(['users']); toast.success('User updated'); handleCloseForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['users']); toast.success('User deleted'); },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }) => api.post(`/users/${id}/reset-password`, { password }),
    onSuccess: () => { toast.success('Password reset successfully'); setShowPasswordModal(false); setNewPassword(''); },
  });

  const handleOpenForm = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', role: 'CASHIER' });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => { setShowForm(false); setEditUser(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (editUser) delete data.password;
    editUser ? updateMutation.mutate({ id: editUser._id, data }) : createMutation.mutate(data);
  };

  const roleOptions = [
    { value: 'OWNER', label: 'Owner' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'CASHIER', label: 'Cashier' },
  ];

  const roleBadgeVariant = { OWNER: 'active', MANAGER: 'paid', CASHIER: 'default' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage staff accounts and roles</p>
        </div>
        <Button onClick={() => handleOpenForm()} icon={Plus}>Add User</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>User</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Last Login</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.data?.map((user) => (
              <Table.Row key={user._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell><Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge></Table.Cell>
                <Table.Cell><Badge variant={user.isActive ? 'paid' : 'inactive'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></Table.Cell>
                <Table.Cell className="text-gray-500">{user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}</Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setSelectedUser(user); setShowPasswordModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Reset Password"><Key className="w-4 h-4" /></button>
                    <button onClick={() => handleOpenForm(user)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteMutation.mutate(user._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal open={showForm} onClose={handleCloseForm} title={editUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          {!editUser && <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />}
          <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={roleOptions} />
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit" loading={createMutation.isLoading || updateMutation.isLoading}>{editUser ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Reset Password" size="sm">
        <form onSubmit={(e) => { e.preventDefault(); resetPasswordMutation.mutate({ id: selectedUser?._id, password: newPassword }); }} className="space-y-4">
          <p className="text-gray-600">Reset password for <strong>{selectedUser?.name}</strong></p>
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button type="submit" loading={resetPasswordMutation.isLoading}>Reset Password</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UsersPage;
