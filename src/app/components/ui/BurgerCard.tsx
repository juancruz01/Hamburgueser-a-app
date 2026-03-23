"use client";

import NextImage from "next/image"; // 👈 Usamos 'NextImage' para que no choque con el nativo
import { Plus } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
}

export const BurgerCard = ({ producto }: { producto: Producto }) => {
  
  const handleAddClick = () => {
    console.log("Personalizando:", producto.nombre);
  };

  return (
    <div 
      onClick={handleAddClick}
      className="group relative bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden active:scale-95 transition-all duration-200 flex flex-col"
    >
      {/* CONTENEDOR DE IMAGEN */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <NextImage 
          src={producto.imagen_url || "https://via.placeholder.com/300"} 
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority={false}
        />
        {/* Badge de precio */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm z-10">
          <span className="text-orange-600 font-black text-xs">
            ${producto.precio.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* CONTENIDO TEXTUAL */}
      <div className="p-3 flex flex-col flex-1 bg-linear-to-b from-white to-slate-50">
        <h3 className="font-extrabold text-slate-800 text-sm leading-tight mb-1 line-clamp-1">
          {producto.nombre}
        </h3>
        
        <p className="text-[10px] text-slate-500 leading-tight line-clamp-2 mb-3 flex-1">
          {producto.descripcion}
        </p>

        <button className="w-full bg-slate-900 text-white py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors">
          <Plus size={14} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-wider">Agregar</span>
        </button>
      </div>
    </div>
  );
};