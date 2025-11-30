import Input from '../ui/Input';
import Card from '../ui/Card';

const StoreSettings = ({ formData, onChange }) => {
  return (
    <Card animate={false}>
      <h2 className="text-lg font-semibold mb-4">Store Information</h2>
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
          value={formData.storeEmail}
          onChange={onChange}
        />
        <Input
          label="Address"
          name="storeAddress"
          value={formData.storeAddress}
          onChange={onChange}
        />
        <Input
          label="Invoice Prefix"
          name="invoicePrefix"
          value={formData.invoicePrefix}
          onChange={onChange}
        />
        <Input
          label="Receipt Footer"
          name="receiptFooter"
          value={formData.receiptFooter}
          onChange={onChange}
        />
      </div>
    </Card>
  );
};

export default StoreSettings;
