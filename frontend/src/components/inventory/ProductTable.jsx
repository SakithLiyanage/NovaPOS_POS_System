import { Package, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Table, Badge } from '../ui';
import { formatCurrency } from '../../utils/formatters';

const ProductTable = ({ products, onEdit, onDelete, onAdjustStock }) => {
  return (
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
        {products?.map((product) => {
          const isLowStock = product.currentStock <= product.lowStockThreshold;
          
          return (
            <Table.Row key={product._id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
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
              <Table.Cell className="text-gray-500">{product.category?.name || '-'}</Table.Cell>
              <Table.Cell>
                <span className="font-mono font-medium">{formatCurrency(product.salePrice)}</span>
              </Table.Cell>
              <Table.Cell>
                <button
                  onClick={() => onAdjustStock?.(product)}
                  className={`inline-flex items-center gap-1 font-mono ${
                    isLowStock ? 'text-red-600 font-medium' : 'text-gray-900'
                  }`}
                >
                  {isLowStock && <AlertTriangle className="w-3 h-3" />}
                  {product.currentStock}
                </button>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={product.isActive ? 'active' : 'inactive'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default ProductTable;
