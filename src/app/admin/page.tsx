"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Check, PackageCheck } from "lucide-react"; // Quitamos Clock

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

export default function AdminPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });
      setPedidos(data || []);
    };

    fetchPedidos();

    // SUSCRIPCIÓN CON TIPADO CORRECTO
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
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', id);
    
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Kitchen <span className="text-orange-500">Display</span>
        </h1>
        <div className="bg-orange-500/20 text-orange-500 px-4 py-1 rounded-full text-xs font-bold">
          {pedidos.filter(p => p.estado === 'pendiente').length} PENDIENTES
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className={`p-5 rounded-3xl border-2 transition-all ${
            pedido.estado === 'pendiente' ? 'border-orange-500 bg-slate-800' : 'border-slate-800 bg-slate-900 opacity-60'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500">Orden #{pedido.numero_orden}</span>
                <h3 className="text-xl font-bold">{pedido.cliente_nombre}</h3>
              </div>
              <div className="text-right">
                <span className="block text-xs text-slate-400">Total</span>
                <span className="font-black text-orange-500">${pedido.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              {pedido.detalles?.map((item: CartItemPedido, idx: number) => (
                <div key={idx} className="flex justify-between bg-slate-700/30 p-2 rounded-lg">
                  <span><span className="font-bold text-orange-400">{item.cantidad}x</span> {item.nombre}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {pedido.estado === 'pendiente' ? (
                <button 
                  onClick={() => actualizarEstado(pedido.id, 'completado')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <PackageCheck size={18} /> DESPACHAR
                </button>
              ) : (
                <div className="w-full text-center py-3 text-green-500 font-bold flex items-center justify-center gap-2">
                  <Check size={18} /> COMPLETADO
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}