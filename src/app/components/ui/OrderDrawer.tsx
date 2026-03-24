"use client";

import { Drawer } from "vaul";
import { Plus, Minus } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import NextImage from "next/image";
import { useCartStore } from "../../store/useCartStore";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
}

// Helper para detectar si estamos en el cliente sin disparar warnings de ESLint
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function OrderDrawer({ producto, children }: { producto: Producto, children: React.ReactNode }) {
  const isClient = useIsClient(); // Reemplaza al useEffect + setMounted
  const [cantidad, setCantidad] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [open, setOpen] = useState(false);

  if (!isClient) return <>{children}</>;

  const precioFinal = producto.precio * cantidad;

  const handleAddToCart = () => {
    addItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precioBase: producto.precio,
      cantidad: cantidad
    });
    setOpen(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        {/* Usamos un div pero le quitamos el comportamiento de botón para evitar anidamiento */}
        <div className="w-full h-full outline-none select-none cursor-pointer">
          {children}
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-4xl h-[92%] mt-24 fixed bottom-0 left-0 right-0 z-60 outline-none">
          <Drawer.Title className="sr-only">{producto.nombre}</Drawer.Title>
          <Drawer.Description className="sr-only">Personaliza tu pedido</Drawer.Description>
          
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-slate-200 my-4" />

          <div className="p-6 overflow-y-auto flex-1">
            <div className="max-w-md mx-auto">
              <div className="flex gap-4 mb-8">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                  <NextImage 
                    src={producto.imagen_url} 
                    alt={producto.nombre} 
                    fill 
                    sizes="100px"
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h2 className="font-black text-2xl text-slate-900 uppercase leading-none mb-1">
                    {producto.nombre}
                  </h2>
                  <p className="text-slate-500 text-sm leading-tight">{producto.descripcion}</p>
                </div>
              </div>

                {/* Secciones de extras... (mantén tu código de extras aquí) */}
                {/* SECCIÓN: QUITAR INGREDIENTES */}
                <div className="mb-8">
                    <h4 className="font-bold text-slate-800 mb-4 italic uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        ¿Quitar ingredientes?
                    </h4>
                <div className="flex flex-wrap gap-2">
                    {["Cebolla", "Pepinos", "Tomate", "Lechuga"].map((ing) => (
                    <button 
                        key={ing} 
                        type="button"
                        className="px-4 py-2 rounded-full border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider hover:border-red-200 hover:bg-red-50 active:scale-95 transition-all"
                    >
                        Sin {ing}
                    </button>
                    ))}
                </div>
                </div>

                {/* SECCIÓN: AGREGAR EXTRAS */}
                <div className="mb-8">
                    <h4 className="font-bold text-slate-800 mb-4 italic uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Potenciá tu Burger
                    </h4>
                    <div className="space-y-3">
                        {[
                        { id: '1', name: "Doble Cheddar", price: 1200 },
                        { id: '2', name: "Bacon Ahumado", price: 1500 },
                        { id: '3', name: "Huevo Frito", price: 1000 },
                        { id: '4', name: "Cebolla Caramelizada", price: 800 }
                        ].map((extra) => (
                        <div 
                            key={extra.id} 
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{extra.name}</span>
                                <span className="text-xs font-black text-orange-500">+${extra.price.toLocaleString()}</span>
                            </div>
                            <button 
                                type="button"
                                className="bg-white text-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-transform"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
                        
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-white pb-10">
            <div className="max-w-md mx-auto flex items-center gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                <button 
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))} 
                  className="p-3 bg-white text-gray-500 rounded-xl shadow-sm active:scale-90"
                >
                  <Minus size={20}/>
                </button>
                <span className="px-6 font-black text-xl text-gray-600 tabular-nums">{cantidad}</span>
                <button 
                  type="button"
                  onClick={() => setCantidad(cantidad + 1)} 
                  className="p-3 bg-white text-gray-500 rounded-xl shadow-sm active:scale-90"
                >
                  <Plus size={20}/>
                </button>
              </div>
              <button 
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 text-white h-14 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform"
              >
                AGREGAR — ${precioFinal.toLocaleString('es-AR')}
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}