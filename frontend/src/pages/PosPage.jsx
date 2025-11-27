import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductSearch from '../components/pos/ProductSearch';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import PaymentDialog from '../components/pos/PaymentDialog';
import CustomerSelector from '../components/pos/CustomerSelector';
import DiscountModal from '../components/pos/DiscountModal';
import { useCartStore } from '../store/cartStore';
import { useProducts } from '../hooks/useProducts';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const PosPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  
  const { items, addItem, customer, setCustomer, clearCart } = useCartStore();
  const { data: products, isLoading } = useProducts({ 
    search: searchQuery,
    category: selectedCategory,
    limit: 50,
    isActive: true,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'F2': () => document.getElementById('product-search')?.focus(),
    'F3': () => setShowCustomerSelector(true),
    'F4': () => items.length > 0 && setShowPayment(true),
    'F5': () => items.length > 0 && setShowDiscountModal(true),
    'Escape': () => {
      setShowPayment(false);
      setShowCustomerSelector(false);
      setShowDiscountModal(false);
    },
  });

  const handleProductSelect = useCallback((product) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      taxRate: product.taxRate,
    });
  }, [addItem]);

  const handlePaymentComplete = useCallback(() => {
    setShowPayment(false);
    clearCart();
  }, [clearCart]);

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-6">
      {/* Left: Products area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search bar */}
        <ProductSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        {/* Product grid */}
        <motion.div 
          className="flex-1 mt-4 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ProductGrid 
            products={products?.data || []}
            loading={isLoading}
            onProductSelect={handleProductSelect}
          />
        </motion.div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded">F2</kbd> Search</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded">F3</kbd> Customer</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded">F4</kbd> Checkout</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded">F5</kbd> Discount</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd> Cancel</span>
        </div>
      </div>

      {/* Right: Cart panel */}
      <CartPanel 
        onCheckout={() => setShowPayment(true)}
        onCustomerClick={() => setShowCustomerSelector(true)}
        onDiscountClick={() => setShowDiscountModal(true)}
      />

      {/* Modals */}
      <PaymentDialog 
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onComplete={handlePaymentComplete}
      />

      <CustomerSelector 
        open={showCustomerSelector}
        onClose={() => setShowCustomerSelector(false)}
        onSelect={setCustomer}
        currentCustomer={customer}
      />

      <DiscountModal 
        open={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
      />
    </div>
  );
};

export default PosPage;
