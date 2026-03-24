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

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', id);
    
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
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

            <div className="space-y-2 mb-8 h-40 overflow-y-auto pr-2">
              {pedido.detalles?.map((item: CartItemPedido, idx: number) => (
                <div key={idx} className="flex justify-between bg-slate-800/50 border border-slate-700/50 p-3 rounded-2xl text-sm">
                  <span className="font-medium">
                    <span className="font-black text-orange-500 mr-2">{item.cantidad}x</span> 
                    {item.nombre}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {pedido.estado === 'pendiente' ? (
                <button 
                  onClick={() => actualizarEstado(pedido.id, 'completado')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <PackageCheck size={20} /> 
                  <span className="uppercase tracking-tight">Despachar</span>
                </button>
              ) : (
                <div className="w-full text-center py-4 text-green-500 font-black flex items-center justify-center gap-2 bg-green-500/10 rounded-2xl">
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