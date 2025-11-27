import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Receipt, Bell } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input } from '../components/ui';
import api from '../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    storeName: '', storeAddress: '', storePhone: '', storeEmail: '',
    currency: 'USD', currencySymbol: '$', taxRate: 0,
    invoicePrefix: 'INV', receiptFooter: '',
    showProductImages: true, lowStockWarning: true,
  });

  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(res => res.data),
  });

  useEffect(() => {
    if (settings?.data) setFormData(settings.data);
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/settings', data),
    onSuccess: () => { queryClient.invalidateQueries(['settings']); toast.success('Settings saved'); },
  });

  const handleSubmit = (e) => { e.preventDefault(); updateMutation.mutate(formData); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your store preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card animate={false}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg"><Store className="w-5 h-5 text-indigo-600" /></div>
            <h2 className="text-lg font-semibold">Store Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} />
            <Input label="Phone" name="storePhone" value={formData.storePhone} onChange={handleChange} />
            <Input label="Email" name="storeEmail" type="email" value={formData.storeEmail} onChange={handleChange} />
            <Input label="Address" name="storeAddress" value={formData.storeAddress} onChange={handleChange} />
          </div>
        </Card>

        <Card animate={false}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg"><Receipt className="w-5 h-5 text-emerald-600" /></div>
            <h2 className="text-lg font-semibold">Tax & Currency</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Currency" name="currency" value={formData.currency} onChange={handleChange} />
            <Input label="Currency Symbol" name="currencySymbol" value={formData.currencySymbol} onChange={handleChange} />
            <Input label="Default Tax Rate (%)" name="taxRate" type="number" value={formData.taxRate} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Invoice Prefix" name="invoicePrefix" value={formData.invoicePrefix} onChange={handleChange} />
            <Input label="Receipt Footer" name="receiptFooter" value={formData.receiptFooter} onChange={handleChange} />
          </div>
        </Card>

        <Card animate={false}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg"><Bell className="w-5 h-5 text-amber-600" /></div>
            <h2 className="text-lg font-semibold">POS Preferences</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="showProductImages" checked={formData.showProductImages} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
              <span className="text-gray-700">Show product images in POS</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="lowStockWarning" checked={formData.lowStockWarning} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
              <span className="text-gray-700">Show low stock warnings</span>
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" icon={Save} loading={updateMutation.isLoading}>Save Settings</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
