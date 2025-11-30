import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import Button from '../components/ui/Button';
import StoreSettings from '../components/settings/StoreSettings';
import TaxSettings from '../components/settings/TaxSettings';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';

const SettingsPage = () => {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 0,
    invoicePrefix: 'INV',
    receiptFooter: 'Thank you for your purchase!',
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        storeName: data.data.storeName || '',
        storeAddress: data.data.storeAddress || '',
        storePhone: data.data.storePhone || '',
        storeEmail: data.data.storeEmail || '',
        currency: data.data.currency || 'USD',
        currencySymbol: data.data.currencySymbol || '$',
        taxRate: data.data.taxRate || 0,
        invoicePrefix: data.data.invoicePrefix || 'INV',
        receiptFooter: data.data.receiptFooter || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your store settings</p>
        </div>
        <Button icon={Save} onClick={handleSubmit} loading={updateSettings.isPending}>
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <StoreSettings formData={formData} onChange={handleChange} />
        <TaxSettings formData={formData} onChange={handleChange} />
      </form>
    </motion.div>
  );
};

export default SettingsPage;
