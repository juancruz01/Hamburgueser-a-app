"use client";
import { useCartStore } from "../../store/useCartStore";
import { ShoppingBasket } from "lucide-react";
import { CheckoutDrawer } from "./CheckoutDrawer";

export default function CartButton() {
  const cart = useCartStore((state) => state.cart);
  
  if (cart.length === 0) return null; // Si no hay nada, no se muestra

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = cart.reduce((acc, item) => acc + item.totalItem, 0);

  return (
    <CheckoutDrawer>
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 animate-in slide-in-from-bottom-10">
            <button className="max-w-md mx-auto w-full bg-slate-900 text-white h-16 rounded-2xl shadow-2xl flex items-center justify-between px-6 active:scale-95 transition-transform">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-lg">
                        <ShoppingBasket size={20} />
                    </div>
                    <span className="font-bold">{totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}</span>
                </div>
                <span className="font-black text-lg text-orange-400">
                    Ver pedido: ${totalPrecio.toLocaleString('es-AR')}
                </span>
            </button>
        </div>
    </CheckoutDrawer>

    
  );
}