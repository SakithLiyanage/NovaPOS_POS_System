import { useCartStore } from '../store/cartStore';

export const useCart = () => {
  const store = useCartStore();

  const addProduct = (product) => {
    store.addItem({
      productId: product._id,
      name: product.name,
      price: product.salePrice,
      taxRate: product.taxRate || 0,
    });
  };

  const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: store.items,
    customer: store.customer,
    discount: store.discount,
    addItem: store.addItem,
    addProduct,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    setCustomer: store.setCustomer,
    setDiscount: store.setDiscount,
    clearCart: store.clearCart,
    subtotal: store.getSubtotal(),
    taxAmount: store.getTaxAmount(),
    total: store.getTotal(),
    itemCount,
    isEmpty: store.items.length === 0,
  };
};

export default useCart;
