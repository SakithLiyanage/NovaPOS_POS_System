import { Search, Grid, List } from 'lucide-react';
import { useCategories } from '../../hooks/useProducts';

const ProductSearch = ({ value, onChange, onCategoryChange, selectedCategory }) => {
  const { data: categories } = useCategories();

  return (
    <div className="flex gap-4 items-center">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          id="product-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, SKU, or scan barcode..."
          className="w-full pl-12 pr-4 py-3 text-lg bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          autoComplete="off"
        />
      </div>

      {/* Category filter */}
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Categories</option>
        {categories?.data?.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
};

export default ProductSearch;
