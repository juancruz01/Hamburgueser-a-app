"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase";
import { Check, PackageCheck, LogOut } from "lucide-react";
import AdminLogin from "../admin/AdminLogin";

// --- INTERFACES ---
interface CartItemPedido {
  cantidad: number;
  nombre: string;
  precioBase: number;
  totalItem: number;
  extras?: { id: string, nombre: string, precio: number }[]; // Agregamos extras
  quitar?: string[]; // Agregamos quitar
}

interface Pedido {
  id: string;
  numero_orden: number;
  cliente_nombre: string;
  cliente_telefono: string;
  total: number;
  estado: string;
  detalles: CartItemPedido[];
  created_at: string;
}

// --- HELPER PARA AUTH SIN ERRORES DE ESLINT ---
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

function useAdminAuth() {
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem("admin_auth") === "true",
    () => false // Valor inicial en el servidor
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function AdminPanel() {
  const isAuthorized = useAdminAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Efecto para Cargar Pedidos y Realtime
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchPedidos = async () => {
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });
      setPedidos(data || []);
    };

    fetchPedidos();

    const channel = supabase
      .channel('cambios-pedidos')
      .on(
        'postgres_changes', 
        { event: 'INSERT', table: 'pedidos', schema: 'public' }, 
        (payload) => {
          const nuevoPedido = payload.new as Pedido;
          setPedidos((current) => [nuevoPedido, ...current]);
          new Audio('/notification.mp3').play().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized]);

  // --- NUEVA FUNCIÓN DE DESPACHO ---
  const despacharPedido = async (pedido: Pedido) => {
    // 1. Actualizar en Supabase
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: 'completado' })
      .eq('id', pedido.id);

    if (error) {
      console.error("Error al despachar:", error);
      return;
    }

    // 2. Actualizar estado local para UI
    setPedidos(pedidos.map(p => p.id === pedido.id ? { ...p, estado: 'completado' } : p));

    // 3. NOTIFICAR AL CLIENTE VÍA WHATSAPP
    const mensaje = `*¡Hola ${pedido.cliente_nombre}!* 🍔✨%0A%0A` +
                    `Tu pedido de *Clay Burger* ya está listo y en camino. 🛵💨%0A%0A` +
                    `*Detalle:* Orden #${pedido.numero_orden}%0A` +
                    `¡Que lo disfrutes!`;

    // Limpiamos el teléfono (quitamos espacios o caracteres raros)
    const telefonoLimpio = pedido.cliente_telefono.replace(/\D/g, '');
    
    // Abrimos WhatsApp Web o App
    const whatsappUrl = `https://wa.me/${telefonoLimpio}?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    // Forzamos un evento de storage para que useSyncExternalStore reaccione
    window.dispatchEvent(new Event("storage"));
  };

  // Si no está autorizado, mostramos el login
  if (!isAuthorized) {
    return <AdminLogin onAccess={() => {
      localStorage.setItem("admin_auth", "true");
      window.dispatchEvent(new Event("storage"));
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Kitchen <span className="text-orange-500">Display</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Clay Burger Admin</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-2 rounded-2xl text-xs font-black italic">
            {pedidos.filter(p => p.estado === 'pendiente').length} PENDIENTES
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {pedidos.map((pedido) => (
            <div 
              key={pedido.id} 
              className={`p-6 rounded-4xl border-2 transition-all duration-300 ${
                pedido.estado === 'pendiente' 
                  ? 'border-orange-500 bg-slate-900 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                  : 'border-slate-800 bg-slate-900/40 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Orden #{pedido.numero_orden}</span>
                  <h3 className="text-xl font-bold truncate max-w-37.5">{pedido.cliente_nombre}</h3>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Total</span>
                  <span className="font-black text-orange-500 text-lg">${pedido.total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 h-48 overflow-y-auto pr-2 custom-scrollbar">
                {pedido.detalles?.map((item: CartItemPedido, idx: number) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-lg uppercase tracking-tight">
                          <span className="text-orange-500 mr-2">{item.cantidad}x</span> 
                          {item.nombre}
                        </span>
                    </div>
                    
                    {/* 🔴 ETIQUETAS: LO QUE SE QUITA */}
                    {item.quitar && item.quitar.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.quitar.map((q) => (
                          <span key={q} className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            SIN {q}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 🟢 ETIQUETAS: EXTRAS */}
                    {item.extras && item.extras.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.extras.map((e) => (
                          <span key={e.id} className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                            + {e.nombre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                {pedido.estado === 'pendiente' ? (
                  <button 
                    onClick={() => despacharPedido(pedido)} // <--- Aquí cambiamos la función
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <PackageCheck size={20} /> 
                    <span className="uppercase tracking-tight">Despachar y Notificar</span>
                  </button>
                ) : (
                  <div className="w-full text-center py-4 text-green-500 font-black flex items-center justify-center gap-2 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <Check size={20} strokeWidth={3} /> 
                    <span className="uppercase tracking-tight text-xs">Entregado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>


    </div>
  );
}