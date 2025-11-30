import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { useCategories, useBrands } from '../../hooks/useProducts';

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    brand: '',
    costPrice: '',
    salePrice: '',
    taxRate: '0',
    currentStock: '0',
    lowStockThreshold: '10',
    isActive: true,
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category?._id || product.category || '',
        brand: product.brand?._id || product.brand || '',
        costPrice: product.costPrice?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        taxRate: product.taxRate?.toString() || '0',
        currentStock: product.currentStock?.toString() || '0',
        lowStockThreshold: product.lowStockThreshold?.toString() || '10',
        isActive: product.isActive ?? true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      taxRate: parseFloat(formData.taxRate) || 0,
      currentStock: parseInt(formData.currentStock) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
    });
  };

  const categoryOptions = categories?.data?.map(c => ({ value: c._id, label: c.name })) || [];
  const brandOptions = brands?.data?.map(b => ({ value: b._id, label: b.name })) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="SKU" name="sku" value={formData.sku} onChange={handleChange} required />
        <Input label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} />
        <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categoryOptions} placeholder="Select Category" />
        <Select label="Brand" name="brand" value={formData.brand} onChange={handleChange} options={brandOptions} placeholder="Select Brand" />
        <Input label="Cost Price" name="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={handleChange} />
        <Input label="Sale Price" name="salePrice" type="number" step="0.01" value={formData.salePrice} onChange={handleChange} required />
        <Input label="Tax Rate (%)" name="taxRate" type="number" step="0.01" value={formData.taxRate} onChange={handleChange} />
        <Input label="Current Stock" name="currentStock" type="number" value={formData.currentStock} onChange={handleChange} />
        <Input label="Low Stock Threshold" name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} />
      </div>

      <Checkbox label="Product is active" name="isActive" checked={formData.isActive} onChange={handleChange} />

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{product ? 'Update Product' : 'Create Product'}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
