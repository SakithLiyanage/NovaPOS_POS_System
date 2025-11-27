import { Receipt } from 'lucide-react';
import { Card, Input } from '../ui';

const TaxSettings = ({ formData, onChange }) => {
  return (
    <Card animate={false}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Receipt className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold">Tax & Invoice Settings</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={onChange}
        />
        <Input
          label="Currency Symbol"
          name="currencySymbol"
          value={formData.currencySymbol}
          onChange={onChange}
        />
        <Input
          label="Default Tax Rate (%)"
          name="taxRate"
          type="number"
          step="0.01"
          value={formData.taxRate}
          onChange={onChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

export default TaxSettings;
