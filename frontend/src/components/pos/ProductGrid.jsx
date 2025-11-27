import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Skeleton from '../ui/Skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const ProductGrid = ({ products, loading, onProductSelect }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Package className="w-12 h-12 mb-4 opacity-50" />
        <p>No products found</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {products.map((product) => (
        <ProductCard 
          key={product._id}
          product={product}
          onSelect={onProductSelect}
        />
      ))}
    </motion.div>
  );
};

export default ProductGrid;
