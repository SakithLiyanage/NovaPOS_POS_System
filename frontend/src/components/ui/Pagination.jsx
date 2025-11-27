import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const pages = [];
  const maxVisible = 5;
  
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </p>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 text-sm"
            >
              1
            </button>
            {start > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}
        
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            {page}
          </button>
        ))}
        
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 text-sm"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
