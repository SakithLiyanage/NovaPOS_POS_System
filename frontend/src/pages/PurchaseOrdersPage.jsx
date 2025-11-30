import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Table, Badge } from '../components/ui';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const PurchaseOrdersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showReceive, setShowReceive] = useState(null);
  const [formData, setFormData] = useState({ supplier: '', items: [], expectedDate: '', notes: '' });

  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({ queryKey: ['purchase-orders'], queryFn: () => api.get('/purchase-orders').then(r => r.data) });
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: () => api.get('/suppliers').then(r => r.data) });
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: () => api.get('/products').then(r => r.data) });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/purchase-orders', data),
    onSuccess: () => { queryClient.invalidateQueries(['purchase-orders']); toast.success('Order created'); setShowForm(false); },
  });

  const receiveMutation = useMutation({
    mutationFn: ({ id, items }) => api.post(`/purchase-orders/${id}/receive`, { items }),
    onSuccess: () => { queryClient.invalidateQueries(['purchase-orders']); queryClient.invalidateQueries(['products']); toast.success('Stock received'); setShowReceive(null); },
  });

  const supplierOptions = suppliers?.data?.map(s => ({ value: s._id, label: s.name })) || [];
  const productOptions = products?.data?.map(p => ({ value: p._id, label: `${p.name} (${p.sku})` })) || [];

  const statusColors = { PENDING: 'due', PARTIAL: 'active', RECEIVED: 'paid', CANCELLED: 'inactive' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-500 mt-1">Manage inventory purchases</p>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)}>New Order</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? <div className="p-8 text-center">Loading...</div> : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Order #</Table.Head>
                <Table.Head>Supplier</Table.Head>
                <Table.Head>Items</Table.Head>
                <Table.Head>Total</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Date</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders?.data?.map((order) => (
                <Table.Row key={order._id}>
                  <Table.Cell className="font-mono font-medium">{order.orderNo}</Table.Cell>
                  <Table.Cell>{order.supplier?.name}</Table.Cell>
                  <Table.Cell>{order.items?.length} items</Table.Cell>
                  <Table.Cell className="font-mono">{formatCurrency(order.totalAmount)}</Table.Cell>
                  <Table.Cell><Badge variant={statusColors[order.status]}>{order.status}</Badge></Table.Cell>
                  <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                  <Table.Cell className="text-right">
                    {order.status !== 'RECEIVED' && order.status !== 'CANCELLED' && (
                      <Button size="sm" onClick={() => setShowReceive(order)}>Receive</Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Create Order Modal - simplified */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Purchase Order" size="lg">
        <div className="text-center py-8 text-gray-500">
          <p>Use the full inventory management system for creating detailed purchase orders.</p>
          <p className="mt-2">This feature requires additional setup.</p>
        </div>
      </Modal>

      {/* Receive Stock Modal */}
      <Modal open={!!showReceive} onClose={() => setShowReceive(null)} title="Receive Stock">
        {showReceive && (
          <div className="space-y-4">
            <p className="text-gray-600">Order: <strong>{showReceive.orderNo}</strong></p>
            {showReceive.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Ordered: {item.quantity} | Received: {item.receivedQty || 0}</p>
                </div>
                <Input
                  type="number"
                  className="w-24"
                  placeholder="Qty"
                  max={item.quantity - (item.receivedQty || 0)}
                  id={`receive-${idx}`}
                />
              </div>
            ))}
            <Button onClick={() => {
              const items = showReceive.items.map((item, idx) => ({
                productId: item.product,
                quantity: parseInt(document.getElementById(`receive-${idx}`)?.value) || 0,
              })).filter(i => i.quantity > 0);
              if (items.length) receiveMutation.mutate({ id: showReceive._id, items });
            }} className="w-full" loading={receiveMutation.isPending}>
              Receive Stock
            </Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default PurchaseOrdersPage;
