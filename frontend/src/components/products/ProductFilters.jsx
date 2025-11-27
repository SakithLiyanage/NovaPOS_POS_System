import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button, Select, Checkbox } from '../ui';
import { useCategories, useBrands } from '../../hooks/useProducts';

const ProductFilters = ({ filters, onChange, onClear, open, onToggle }) => {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const categoryOptions = categories?.data?.map(c => ({ value: c._id, label: c.name })) || [];
  const brandOptions = brands?.data?.map(b => ({ value: b._id, label: b.name })) || [];

  const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== undefined).length;

  return (
    <div className="relative">
      <Button
        variant="secondary"
        icon={Filter}
        onClick={onToggle}
        className="relative"
      >
        Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={onToggle} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <Select
                  label="Category"
                  value={filters.category || ''}
                  onChange={(e) => onChange({ ...filters, category: e.target.value })}
                  options={categoryOptions}
                  placeholder="All Categories"
                />

                <Select
                  label="Brand"
                  value={filters.brand || ''}
                  onChange={(e) => onChange({ ...filters, brand: e.target.value })}
                  options={brandOptions}
                  placeholder="All Brands"
                />

                <div className="space-y-2">
                  <Checkbox
                    label="Show inactive products"
                    checked={filters.showInactive}
                    onChange={(e) => onChange({ ...filters, showInactive: e.target.checked })}
                  />
                  <Checkbox
                    label="Low stock only"
                    checked={filters.lowStockOnly}
                    onChange={(e) => onChange({ ...filters, lowStockOnly: e.target.checked })}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" onClick={onClear} className="flex-1">
                    Clear
                  </Button>
                  <Button onClick={onToggle} className="flex-1">
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;
