import { Edit, Trash2 } from 'lucide-react';
import { Table } from '../ui';
import { formatDate } from '../../utils/formatters';

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  if (!customers?.length) {
    return <div className="p-8 text-center text-gray-500">No customers found</div>;
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Phone</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Added</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {customers.map((customer) => (
          <Table.Row key={customer._id}>
            <Table.Cell className="font-medium">{customer.name}</Table.Cell>
            <Table.Cell>{customer.phone || '-'}</Table.Cell>
            <Table.Cell>{customer.email || '-'}</Table.Cell>
            <Table.Cell className="text-gray-500">{formatDate(customer.createdAt)}</Table.Cell>
            <Table.Cell className="text-right">
              <button onClick={() => onEdit(customer)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(customer._id)}
                className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default CustomerTable;
