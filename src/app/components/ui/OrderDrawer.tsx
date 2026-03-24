"use client";

import { Drawer } from "vaul";
import { Plus, Minus,} from "lucide-react";
import { useState } from "react";
import NextImage from "next/image";
import { useCartStore } from "../../store/useCartStore";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
}

export function OrderDrawer({ producto, children }: {producto : Producto, children: React.ReactNode}) {
    const [cantidad, setCantidad] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const [open, setOpen] = useState(false);

    const precioFinal = producto.precio * cantidad;

    const handleAddToCart = () => {
        addItem({
        productoId: producto.id,
        nombre: producto.nombre,
        precioBase: producto.precio,
        cantidad: cantidad
        });
        
        // Cerramos el drawer después de agregar
        setOpen(false);
        
        // Opcional: Una pequeña alerta o vibración (feedback)
        console.log("Añadido al carrito!");
    };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-4xl h-[92%] mt-24 fixed bottom-0 left-0 right-0 z-60 outline-none">
          
          {/* Handle para arrastrar */}
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-slate-200 my-4" />

          <div className="p-6 overflow-y-auto flex-1">
            <div className="max-w-md mx-auto">
              
              {/* Info de la Burger */}
              <div className="flex gap-4 mb-8">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                   <NextImage src={producto.imagen_url} alt={producto.nombre} fill className="object-cover" />
                </div>
                <div>
                  <Drawer.Title className="font-black text-2xl text-slate-900 uppercase">
                    {producto.nombre}
                  </Drawer.Title>
                  <p className="text-slate-500 text-sm leading-tight">{producto.descripcion}</p>
                </div>
              </div>

              {/* SECCIÓN: QUITAR INGREDIENTES */}
              <div className="mb-8">
                <h4 className="font-bold text-slate-800 mb-4 italic uppercase">¿Quitar ingredientes?</h4>
                <div className="flex flex-wrap gap-2">
                  {["Cebolla", "Pepinos", "Tomate"].map((ing) => (
                    <button key={ing} className="px-4 py-2 rounded-full border border-slate-300 text-gray-400 text-sm font-medium active:bg-red-50 active:border-red-200">
                      Sin {ing}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECCIÓN: EXTRAS (Esto vendría de tu tabla 'extras') */}
              <div className="mb-8">
                <h4 className="font-bold text-slate-800 mb-4 italic uppercase">Agregar Extras</h4>
                <div className="space-y-3">
                  {[
                    { name: "Extra Bacon", price: 1500 },
                    { name: "Huevo Frito", price: 1000 }
                  ].map((extra) => (
                    <div key={extra.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="font-bold text-slate-700">{extra.name} (+${extra.price})</span>
                      <button className="bg-orange-500 text-white p-1 rounded-lg">
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER FIJO: CANTIDAD Y BOTÓN FINAL */}
          <div className="p-6 border-t border-slate-100 bg-white pb-10">
            <div className="max-w-md mx-auto flex items-center gap-4">
            {/* Selector de cantidad */}
                <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                    <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="p-3 bg-white text-gray-500 rounded-xl shadow-sm"><Minus size={20}/></button>
                    <span className="px-6 font-black text-xl text-gray-600">{cantidad}</span>
                    <button onClick={() => setCantidad(cantidad + 1)} className="p-3 bg-white text-gray-500 rounded-xl shadow-sm"><Plus size={20}/></button>
                </div>
              
              {/* BOTÓN CONECTADO A ZUSTAND */}
              <button 
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