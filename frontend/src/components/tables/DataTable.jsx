import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Table, Checkbox, Skeleton } from '../ui';
import { cn } from '../../utils/cn';

const DataTable = ({
  columns,
  data,
  loading,
  selectable,
  selectedRows = [],
  onSelectRows,
  sortable,
  defaultSort,
  onRowClick,
  emptyMessage = 'No data available',
}) => {
  const [sort, setSort] = useState(defaultSort || { key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = sortable && sort.key
    ? [...data].sort((a, b) => {
        const aVal = a[sort.key];
        const bVal = b[sort.key];
        const modifier = sort.direction === 'asc' ? 1 : -1;
        if (aVal < bVal) return -1 * modifier;
        if (aVal > bVal) return 1 * modifier;
        return 0;
      })
    : data;

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const toggleAll = () => {
    onSelectRows?.(allSelected ? [] : data.map((_, i) => i));
  };

  const toggleRow = (index) => {
    onSelectRows?.(
      selectedRows.includes(index)
        ? selectedRows.filter(i => i !== index)
        : [...selectedRows, index]
    );
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}
      </div>
    );
  }

  const SortIcon = ({ column }) => {
    if (sort.key !== column) return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    return sort.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-indigo-600" />
      : <ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {selectable && (
            <Table.Head className="w-12">
              <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
            </Table.Head>
          )}
          {columns.map(col => (
            <Table.Head
              key={col.key}
              className={cn(sortable && col.sortable !== false && 'cursor-pointer select-none', col.className)}
              onClick={() => col.sortable !== false && handleSort(col.key)}
            >
              <div className="flex items-center gap-1">
                {col.header}
                {sortable && col.sortable !== false && <SortIcon column={col.key} />}
              </div>
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8 text-gray-500">
              {emptyMessage}
            </Table.Cell>
          </Table.Row>
        ) : (
          sortedData.map((row, index) => (
            <Table.Row key={row._id || index} onClick={() => onRowClick?.(row)} className={onRowClick && 'cursor-pointer'}>
              {selectable && (
                <Table.Cell onClick={e => e.stopPropagation()}>
                  <Checkbox checked={selectedRows.includes(index)} onChange={() => toggleRow(index)} />
                </Table.Cell>
              )}
              {columns.map(col => (
                <Table.Cell key={col.key} className={col.cellClassName}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};

export default DataTable;
