import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Receipt, Users, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const GlobalSearch = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: results, isLoading } = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => api.get('/search', { params: { q: query } }).then(res => res.data),
    enabled: query.length >= 2,
  });

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (type, id) => {
    const routes = {
      product: `/products?search=${id}`,
      sale: `/sales/${id}`,
      customer: `/customers?search=${id}`,
    };
    navigate(routes[type] || '/');
    onClose();
  };

  const icons = { product: Package, sale: Receipt, customer: Users };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <div className="flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, sales, customers..."
                className="flex-1 text-lg outline-none placeholder-gray-400"
              />
              <kbd className="hidden sm:block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">ESC</kbd>
            </div>

            <div className="max-h-96 overflow-auto">
              {query.length < 2 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>Type at least 2 characters to search</p>
                </div>
              ) : isLoading ? (
                <div className="p-8 text-center text-gray-500">Searching...</div>
              ) : !results?.data?.length ? (
                <div className="p-8 text-center text-gray-500">No results found</div>
              ) : (
                <ul className="p-2">
                  {results.data.map((item) => {
                    const Icon = icons[item.type] || Package;
                    return (
                      <li key={`${item.type}-${item.id}`}>
                        <button
                          onClick={() => handleSelect(item.type, item.id)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.title}</p>
                            <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
