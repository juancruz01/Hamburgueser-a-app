import { create } from 'zustand';

interface CartItem {
  cartId: string;
  productoId: string;
  nombre: string;
  precioBase: number;
  cantidad: number;
  totalItem: number;
  // Por ahora dejamos extras vacíos para no complicar, luego los sumamos
}

interface CartState {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'cartId' | 'totalItem'>) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addItem: (newItem) => set((state) => {
    const totalItem = newItem.precioBase * newItem.cantidad;
    const itemWithId = { 
      ...newItem, 
      cartId: crypto.randomUUID(), 
      totalItem 
    };
    return { cart: [...state.cart, itemWithId] };
  }),
  removeItem: (cartId) => set((state) => ({
    cart: state.cart.filter((i) => i.cartId !== cartId)
  })),
  clearCart: () => set({ cart: [] }),
}));