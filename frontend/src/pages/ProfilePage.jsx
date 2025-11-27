import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Card, Button, Input, Avatar } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => api.put('/users/profile', data),
    onSuccess: (res) => {
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => api.put('/users/change-password', data),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Info */}
      <Card animate={false}>
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user?.name} size="xl" />
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label="Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            required
          />
          <Button type="submit" icon={Save} loading={updateProfileMutation.isLoading}>
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card animate={false}>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            required
            minLength={6}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            required
          />
          <Button type="submit" icon={Lock} loading={changePasswordMutation.isLoading}>
            Change Password
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
