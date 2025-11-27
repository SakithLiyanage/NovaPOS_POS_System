import { Store } from 'lucide-react';
import { Card, Input } from '../ui';

const StoreSettings = ({ formData, onChange }) => {
  return (
    <Card animate={false}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Store className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold">Store Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Store Name"
          name="storeName"
          value={formData.storeName}
          onChange={onChange}
        />
        <Input
          label="Phone"
          name="storePhone"
          value={formData.storePhone}
          onChange={onChange}
        />
        <Input
          label="Email"
          name="storeEmail"
          type="email"
          value={formData.storeEmail}
          onChange={onChange}
        />
        <Input
          label="Address"
          name="storeAddress"
          value={formData.storeAddress}
          onChange={onChange}
        />
      </div>
    </Card>
  );
};

export default StoreSettings;
