import { create } from 'zustand';

interface CartItem {
  cartId: string;
  productoId: string;
  nombre: string;
  precioBase: number;
  cantidad: number;
  extras: { id: string, nombre: string, precio: number }[];
  quitar: string[]; // Lista de ingredientes a quitar
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
      const precioExtras = newItem.extras.reduce((acc, e) => acc + e.precio, 0);
      const totalItem = (newItem.precioBase + precioExtras) * newItem.cantidad;
  
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