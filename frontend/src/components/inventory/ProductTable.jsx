import { Edit, Trash2, Package } from 'lucide-react';
import { Table, Badge } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const ProductTable = ({ products, loading, onEdit, onDelete, onAdjustStock }) => {
  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!products?.length) return <div className="p-8 text-center text-gray-500">No products found</div>;

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Product</Table.Head>
          <Table.Head>SKU</Table.Head>
          <Table.Head>Category</Table.Head>
          <Table.Head className="text-right">Price</Table.Head>
          <Table.Head className="text-center">Stock</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((product) => {
          const isLowStock = product.currentStock <= product.lowStockThreshold;
          return (
            <Table.Row key={product._id}>
              <Table.Cell className="font-medium">{product.name}</Table.Cell>
              <Table.Cell className="font-mono text-gray-500">{product.sku}</Table.Cell>
              <Table.Cell>{product.category?.name || '-'}</Table.Cell>
              <Table.Cell className="text-right font-mono">{formatCurrency(product.salePrice)}</Table.Cell>
              <Table.Cell className="text-center">
                <button onClick={() => onAdjustStock?.(product)} className={`px-2 py-1 rounded text-sm font-mono ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                  {product.currentStock}
                </button>
              </Table.Cell>
              <Table.Cell><Badge variant={product.isActive ? 'active' : 'inactive'}>{product.isActive ? 'Active' : 'Inactive'}</Badge></Table.Cell>
              <Table.Cell className="text-right">
                <button onClick={() => onEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(product._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default ProductTable;
