import { cn } from '../../utils/cn';

const Table = ({ children, className }) => (
  <div className={cn('overflow-hidden rounded-xl border border-gray-200 bg-white', className)}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  </div>
);

const TableHeader = ({ children, className }) => (
  <thead className={cn('bg-gray-50', className)}>
    {children}
  </thead>
);

const TableBody = ({ children, className }) => (
  <tbody className={cn('divide-y divide-gray-100', className)}>
    {children}
  </tbody>
);

const TableRow = ({ children, className, onClick }) => (
  <tr 
    onClick={onClick}
    className={cn(
      'hover:bg-gray-50 transition-colors duration-150',
      onClick && 'cursor-pointer',
      className
    )}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className }) => (
  <th className={cn(
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    className
  )}>
    {children}
  </th>
);

const TableCell = ({ children, className }) => (
  <td className={cn('px-6 py-4 text-sm text-gray-900', className)}>
    {children}
  </td>
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
