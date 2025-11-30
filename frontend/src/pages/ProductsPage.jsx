import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SearchInput } from '../components/ui';
import ProductTable from '../components/inventory/ProductTable';
import ProductForm from '../components/inventory/ProductForm';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import BulkImportModal from '../components/inventory/BulkImportModal';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);

  const { data, isLoading } = useProducts({ search, limit: 100 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct._id, data: formData });
      } else {
        await createProduct.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this product?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Upload} onClick={() => setShowImport(true)}>
            Import
          </Button>
          <Button icon={Plus} onClick={() => { setEditingProduct(null); setShowForm(true); }}>
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search products..."
          className="w-full max-w-md"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <ProductTable
          products={data?.data || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdjustStock={setStockProduct}
        />
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          loading={createProduct.isPending || updateProduct.isPending}
        />
      </Modal>

      <StockAdjustmentModal
        open={!!stockProduct}
        onClose={() => setStockProduct(null)}
        product={stockProduct}
      />

      <BulkImportModal open={showImport} onClose={() => setShowImport(false)} />
    </motion.div>
  );
};

export default ProductsPage;
