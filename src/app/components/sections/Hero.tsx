"use client";

import { ChevronRight, UtensilsCrossed } from "lucide-react";

export default function Hero() {
  const scrollToMenu = () => {
    const menu = document.getElementById("menu");
    menu?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      {/* Decoración de fondo: Un círculo naranja desenfocado para dar profundidad */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative px-6 py-16 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Badge superior opcional */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold mb-6 animate-fade-in">
          <UtensilsCrossed size={14} />
          SABOR ARTESANAL EN CADA MORDIDA
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl font-black text-white leading-[0.9] mb-4 tracking-tighter uppercase">
          Clay <br /> 
          <span className="text-orange-500">Burger</span>
        </h1>

        <p className="text-slate-400 text-sm mb-10 max-w-70 leading-relaxed">
          Hamburguesas premium con ingredientes seleccionados y el punto justo de cocción.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => console.log("Ir a Checkout/Pedido")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            ORDENAR AHORA
            <ChevronRight size={20} />
          </button>
          
          <button 
            onClick={scrollToMenu}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 rounded-2xl border border-slate-700 transition-all active:scale-95"
          >
            VER MENÚ
          </button>
        </div>
      </div>
    </section>
  );
}