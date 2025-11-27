import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Package } from 'lucide-react';
import { useProducts, useDeleteProduct, useCategories } from '../hooks/useProducts';
import { Button, Input, Table, Badge, Modal, Skeleton } from '../components/ui';
import ProductForm from '../components/inventory/ProductForm';
import { formatCurrency } from '../utils/formatters';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: products, isLoading } = useProducts({ 
    search, 
    category, 
    page, 
    limit: 20 
  });
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your inventory</p>
        </div>
        <Button onClick={() => setShowForm(true)} icon={Plus}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories?.data?.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : products?.data?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Get started by adding a new product</p>
          <Button onClick={() => setShowForm(true)} className="mt-4" icon={Plus}>
            Add Product
          </Button>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Product</Table.Head>
              <Table.Head>SKU</Table.Head>
              <Table.Head>Category</Table.Head>
              <Table.Head>Price</Table.Head>
              <Table.Head>Stock</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products?.data?.map((product) => (
              <Table.Row key={product._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      {product.barcode && (
                        <p className="text-xs text-gray-500 font-mono">{product.barcode}</p>
                      )}
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-mono text-sm">{product.sku}</span>
                </Table.Cell>
                <Table.Cell>{product.category?.name || '-'}</Table.Cell>
                <Table.Cell>
                  <span className="font-mono font-medium">{formatCurrency(product.salePrice)}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className={`font-mono ${
                    product.currentStock <= product.lowStockThreshold 
                      ? 'text-red-600 font-medium' 
                      : 'text-gray-900'
                  }`}>
                    {product.currentStock}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={product.isActive ? 'active' : 'inactive'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(product._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Pagination */}
      {products?.pagination && products.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, products.pagination.total)} of {products.pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= products.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        open={showForm}
        onClose={handleFormClose}
        title={editProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <ProductForm 
          product={editProduct} 
          onSuccess={handleFormClose}
          onCancel={handleFormClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            loading={deleteProduct.isLoading}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ProductsPage;
