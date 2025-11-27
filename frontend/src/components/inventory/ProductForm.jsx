import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct, useCategories, useBrands } from '../../hooks/useProducts';
import { Button, Input, Select } from '../ui';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    categoryId: '',
    brandId: '',
    costPrice: '',
    salePrice: '',
    taxRate: '0',
    currentStock: '0',
    lowStockThreshold: '10',
    imageUrl: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        categoryId: product.categoryId || product.category?._id || '',
        brandId: product.brandId || product.brand?._id || '',
        costPrice: product.costPrice?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        taxRate: product.taxRate?.toString() || '0',
        currentStock: product.currentStock?.toString() || '0',
        lowStockThreshold: product.lowStockThreshold?.toString() || '10',
        imageUrl: product.imageUrl || '',
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      newErrors.salePrice = 'Valid sale price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      costPrice: parseFloat(formData.costPrice) || 0,
      salePrice: parseFloat(formData.salePrice),
      taxRate: parseFloat(formData.taxRate) || 0,
      currentStock: parseInt(formData.currentStock) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
    };

    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product._id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      // Error handled by hook
    }
  };

  const isLoading = createProduct.isLoading || updateProduct.isLoading;

  const categoryOptions = categories?.data?.map(c => ({ value: c._id, label: c.name })) || [];
  const brandOptions = brands?.data?.map(b => ({ value: b._id, label: b.name })) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
        />
        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          error={errors.sku}
          placeholder="e.g., PRD-001"
        />
      </div>

      <Input
        label="Barcode"
        name="barcode"
        value={formData.barcode}
        onChange={handleChange}
        placeholder="Scan or enter barcode"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Select category"
        />
        <Select
          label="Brand"
          name="brandId"
          value={formData.brandId}
          onChange={handleChange}
          options={brandOptions}
          placeholder="Select brand"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Cost Price"
          name="costPrice"
          type="number"
          step="0.01"
          value={formData.costPrice}
          onChange={handleChange}
          placeholder="0.00"
        />
        <Input
          label="Sale Price"
          name="salePrice"
          type="number"
          step="0.01"
          value={formData.salePrice}
          onChange={handleChange}
          error={errors.salePrice}
          placeholder="0.00"
        />
        <Input
          label="Tax Rate (%)"
          name="taxRate"
          type="number"
          step="0.01"
          value={formData.taxRate}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Current Stock"
          name="currentStock"
          type="number"
          value={formData.currentStock}
          onChange={handleChange}
          placeholder="0"
          disabled={!!product}
        />
        <Input
          label="Low Stock Threshold"
          name="lowStockThreshold"
          type="number"
          value={formData.lowStockThreshold}
          onChange={handleChange}
          placeholder="10"
        />
      </div>

      <Input
        label="Image URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://..."
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Product is active
        </label>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
