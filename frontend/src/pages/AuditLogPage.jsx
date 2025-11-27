import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Table, Badge, Skeleton, Select } from '../components/ui';
import api from '../services/api';
import { formatDateTime } from '../utils/formatters';

const actionLabels = {
  USER_LOGIN: 'User Login',
  USER_CREATED: 'User Created',
  USER_UPDATED: 'User Updated',
  PRODUCT_CREATED: 'Product Created',
  PRODUCT_UPDATED: 'Product Updated',
  STOCK_ADJUSTED: 'Stock Adjusted',
  SALE_CREATED: 'Sale Created',
  SETTINGS_UPDATED: 'Settings Updated',
};

const actionColors = {
  USER_LOGIN: 'active',
  USER_CREATED: 'paid',
  PRODUCT_CREATED: 'paid',
  SALE_CREATED: 'paid',
  STOCK_ADJUSTED: 'due',
  default: 'default',
};

const AuditLogPage = () => {
  const [filters, setFilters] = useState({ action: '', page: 1 });

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => api.get('/audit', { params: filters }).then(res => res.data),
  });

  const actionOptions = Object.entries(actionLabels).map(([value, label]) => ({ value, label }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500">Track all system activities</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
          options={actionOptions}
          placeholder="All Actions"
          className="w-48"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Action</Table.Head>
              <Table.Head>User</Table.Head>
              <Table.Head>Details</Table.Head>
              <Table.Head>IP Address</Table.Head>
              <Table.Head>Date</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.data?.map((log) => (
              <Table.Row key={log._id}>
                <Table.Cell>
                  <Badge variant={actionColors[log.action] || 'default'}>
                    {actionLabels[log.action] || log.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-medium">{log.userId?.name || 'System'}</span>
                </Table.Cell>
                <Table.Cell className="max-w-xs truncate text-gray-500">
                  {log.details ? JSON.stringify(log.details) : '-'}
                </Table.Cell>
                <Table.Cell className="font-mono text-sm">{log.ipAddress || '-'}</Table.Cell>
                <Table.Cell className="text-gray-500">{formatDateTime(log.createdAt)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </motion.div>
  );
};

export default AuditLogPage;
