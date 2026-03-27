"use client";

import { Drawer } from "vaul";
import { Plus, Minus, Check } from "lucide-react";
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

interface Extra {
  id: string;
  name: string;
  price: number;
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function OrderDrawer({ producto, children }: { producto: Producto, children: React.ReactNode }) {
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  
  // ESTADOS PARA PERSONALIZACIÓN
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Extra[]>([]);
  const [quitarIngredientes, setQuitarIngredientes] = useState<string[]>([]);
  
  const addItem = useCartStore((state) => state.addItem);

  if (!isClient) return <>{children}</>;

  // LÓGICA DE PRECIOS
  const precioExtras = extrasSeleccionados.reduce((acc, e) => acc + e.price, 0);
  const precioFinal = (producto.precio + precioExtras) * cantidad;

  const toggleExtra = (extra: { id: string, name: string, price: number }) => {
    setExtrasSeleccionados(prev => 
      prev.find(e => e.id === extra.id) 
        ? prev.filter(e => e.id !== extra.id) 
        : [...prev, extra]
    );
  };

  const toggleQuitar = (ing: string) => {
    setQuitarIngredientes(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const handleAddToCart = () => {
    addItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precioBase: producto.precio,
      cantidad: cantidad,
      extras: extrasSeleccionados.map(e => ({ id: e.id, nombre: e.name, precio: e.price })),
      quitar: quitarIngredientes
    });
    setOpen(false);
    // Resetear estados para la próxima vez
    setCantidad(1);
    setExtrasSeleccionados([]);
    setQuitarIngredientes([]);
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        <div className="w-full h-full outline-none select-none cursor-pointer">
          {children}
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-4xl h-[92%] mt-24 fixed bottom-0 left-0 right-0 z-60 outline-none shadow-2xl">
          <Drawer.Title className="sr-only">{producto.nombre}</Drawer.Title>
          <Drawer.Description className="sr-only">Personaliza tu pedido</Drawer.Description>
          
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-slate-200 my-4" />

          <div className="p-6 overflow-y-auto flex-1">
            <div className="max-w-md mx-auto">
              <div className="flex gap-4 mb-8">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                  <NextImage src={producto.imagen_url} alt={producto.nombre} fill sizes="100px" className="object-cover" />
                </div>
                <div>
                  <h2 className="font-black text-2xl text-slate-900 uppercase leading-none mb-1">{producto.nombre}</h2>
                  <p className="text-slate-500 text-sm leading-tight">{producto.descripcion}</p>
                </div>
              </div>

              {/* SECCIÓN: QUITAR */}
              <div className="mb-8">
                <h4 className="font-bold text-slate-800 mb-4 italic uppercase flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> ¿Quitar ingredientes?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Cebolla", "Pepinos", "Tomate", "Lechuga"].map((ing) => {
                    const isSelected = quitarIngredientes.includes(ing);
                    return (
                      <button 
                        key={ing} type="button" onClick={() => toggleQuitar(ing)}
                        className={`px-4 py-2 rounded-full border text-xs font-bold uppercase transition-all ${
                          isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 text-slate-400'
                        }`}
                      >
                        Sin {ing}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECCIÓN: EXTRAS */}
              <div className="mb-8">
                <h4 className="font-bold text-slate-800 mb-4 italic uppercase flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Potenciá tu Burger
                </h4>
                <div className="space-y-3">
                  {[
                    { id: '1', name: "Doble Cheddar", price: 1200 },
                    { id: '2', name: "Bacon Ahumado", price: 1500 },
                    { id: '3', name: "Huevo Frito", price: 1000 },
                    { id: '4', name: "Cebolla Caramelizada", price: 800 },
                    { id: '5', name: "Salsa Clay Especial", price: 600 }
                  ].map((extra) => {
                    const isSelected = extrasSeleccionados.find(e => e.id === extra.id);
                    return (
                      <button 
                        key={extra.id} type="button" onClick={() => toggleExtra(extra)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          isSelected ? 'bg-green-50 border-green-500 shadow-sm' : 'bg-slate-50 border-transparent'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className={`font-bold ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>{extra.name}</span>
                          <span className="text-xs font-black text-orange-500">+${extra.price}</span>
                        </div>
                        <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-green-500 text-white' : 'bg-white text-slate-900 border border-slate-100'}`}>
                          {isSelected ? <Check size={20} /> : <Plus size={20} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-100 bg-white pb-10">
            <div className="max-w-md mx-auto flex items-center gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                <button type="button" onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="p-3 bg-white text-gray-500 rounded-xl shadow-sm"><Minus size={20}/></button>
                <span className="px-6 font-black text-xl text-gray-600 tabular-nums">{cantidad}</span>
                <button type="button" onClick={() => setCantidad(cantidad + 1)} className="p-3 bg-white text-gray-500 rounded-xl shadow-sm"><Plus size={20}/></button>
              </div>
              <button 
                type="button" onClick={handleAddToCart}
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