import { Edit, Trash2, Eye } from 'lucide-react';
import { Table } from '../ui';
import { formatDate } from '../../utils/formatters';

const CustomerTable = ({ customers, onEdit, onDelete, onView }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Phone</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Created</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {customers?.map((customer) => (
          <Table.Row key={customer._id}>
            <Table.Cell>
              <span className="font-medium text-gray-900">{customer.name}</span>
            </Table.Cell>
            <Table.Cell className="text-gray-500">{customer.phone || '-'}</Table.Cell>
            <Table.Cell className="text-gray-500">{customer.email || '-'}</Table.Cell>
            <Table.Cell className="text-gray-500">{formatDate(customer.createdAt)}</Table.Cell>
            <Table.Cell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {onView && (
                  <button
                    onClick={() => onView(customer)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onEdit(customer)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(customer._id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default CustomerTable;
