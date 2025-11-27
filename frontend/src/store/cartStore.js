import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  customer: null,
  discount: 0,

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.items.findIndex(i => i.productId === item.productId);
      
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + (item.quantity || 1),
        };
        return { items: newItems };
      }
      
      return { 
        items: [...state.items, { ...item, quantity: item.quantity || 1 }] 
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(i => i.productId !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));
  },

  setCustomer: (customer) => set({ customer }),
  
  setDiscount: (discount) => set({ discount: Math.min(100, Math.max(0, discount)) }),

  clearCart: () => set({ items: [], customer: null, discount: 0 }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTaxAmount: () => {
    const { items, discount } = get();
    const subtotal = get().getSubtotal();
    const discountedSubtotal = subtotal * (1 - discount / 100);
    
    return items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity * (1 - discount / 100);
      return sum + itemTotal * (item.taxRate / 100);
    }, 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discount;
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = get().getTaxAmount();
    
    return subtotal - discountAmount + taxAmount;
  },
}));
