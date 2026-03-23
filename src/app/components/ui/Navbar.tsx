"use client"; // Lo marcamos como Client Component porque tendrá interacción (el botón de menú)

import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* LOGO: Texto en columna */}
        <div className="flex flex-col leading-none">
          <span className="text-orange-600 font-black text-xl uppercase tracking-tighter">
            Clay
          </span>
          <span className="text-slate-900 font-bold text-sm uppercase tracking-[0.2em] -mt-1">
            Burger
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* BOTÓN MENÚ HAMBURGUESA */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-900 bg-slate-100 rounded-xl active:scale-90 transition-transform"
          >
            <Menu size={26} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE (Opcional por ahora) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in fade-in slide-in-from-top-2">
          <a href="#menu" className="text-lg font-bold text-slate-800" onClick={() => setIsOpen(false)}>Menú</a>
          <a href="#ordenar" className="text-lg font-bold text-slate-800" onClick={() => setIsOpen(false)}>Mis Pedidos</a>
          <a href="#contacto" className="text-lg font-bold text-slate-800" onClick={() => setIsOpen(false)}>Contacto</a>
        </div>
      )}
    </nav>
  );
}