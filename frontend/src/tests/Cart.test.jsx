import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add item to cart', () => {
    const { addItem, items } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Test Product',
      price: 10.00,
      taxRate: 10,
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('should increment quantity for existing item', () => {
    const { addItem } = useCartStore.getState();
    
    addItem({ productId: '1', name: 'Test', price: 10, taxRate: 0 });
    addItem({ productId: '1', name: 'Test', price: 10, taxRate: 0 });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    
    addItem({ productId: '1', name: 'Test', price: 10, taxRate: 0 });
    removeItem('1');

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should calculate subtotal correctly', () => {
    const { addItem, getSubtotal } = useCartStore.getState();
    
    addItem({ productId: '1', name: 'Product 1', price: 10, taxRate: 0 });
    addItem({ productId: '2', name: 'Product 2', price: 20, taxRate: 0 });

    expect(useCartStore.getState().getSubtotal()).toBe(30);
  });

  it('should calculate total with tax', () => {
    const { addItem, getTotal } = useCartStore.getState();
    
    addItem({ productId: '1', name: 'Product', price: 100, taxRate: 10 });

    // 100 + 10% tax = 110
    expect(useCartStore.getState().getTotal()).toBe(110);
  });

  it('should clear cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    
    addItem({ productId: '1', name: 'Test', price: 10, taxRate: 0 });
    clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().customer).toBeNull();
    expect(useCartStore.getState().discount).toBe(0);
  });
});
