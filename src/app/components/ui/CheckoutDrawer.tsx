"use client";

import {supabase} from "../../lib/supabase";

import { Drawer } from "vaul";
import { useCartStore } from "../../store/useCartStore";
import { useState } from "react";
import { Smartphone, User, CreditCard, Send } from "lucide-react";

export function CheckoutDrawer({ children }: { children: React.ReactNode }) {
  const { cart, clearCart } = useCartStore();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState<"efectivo" | "transferencia">("efectivo");

  const handleFinalizarPedido = async () => {
  if (!nombre || !telefono) return;

  const total = cart.reduce((acc, item) => acc + item.totalItem, 0);

    console.log("Enviando pedido...", { nombre, telefono, metodoPago, total, cart });
  // 1. Guardar en Supabase primero
  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        cliente_nombre: nombre,
        cliente_telefono: telefono,
        metodo_pago: metodoPago,
        total: total,
        estado: 'pendiente',
        detalles: cart // Guardamos el JSON completo del carrito
      }
    ])
    .select();

    if (error) {
        console.error("Error al guardar pedido:", error.message);
        alert("Hubo un error al procesar tu pedido. Intenta de nuevo." + error.message);
    return;
  }

  // 2. Si se guardó bien, procedemos con WhatsApp
  const nroOrden = data[0].numero_orden; // Usamos el ID real de la base de datos
  
  const productosMsg = cart.map(item => `- ${item.cantidad}x ${item.nombre}`).join("%0A");
  
  const texto = `*ORDEN NRO: #${nroOrden}*%0A%0A` +
                `*Cliente:* ${nombre}%0A` +
                `*Pedido:*%0A${productosMsg}%0A%0A` +
                `*TOTAL: $${total}*%0A%0A` +
                `_Pedido registrado en sistema._`;

  const url = `https://wa.me/1159320255?text=${texto}`;
  
  window.open(url, "_blank");
  clearCart();
};

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-4xl h-[92%] fixed bottom-0 left-0 right-0 z-60 outline-none">
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-slate-200 my-4" />
          
          <div className="p-6 overflow-y-auto flex-1 max-w-md mx-auto w-full">
            <Drawer.Title className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Finalizar Pedido
            </Drawer.Title>
            <p className="text-slate-500 mb-8">Completa tus datos para que preparemos tu burger.</p>

            <div className="space-y-6">
              {/* CAMPO NOMBRE */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                  <User size={14} /> Nombre y Apellido
                </label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-slate-50 text-gray-600 border-none h-14 rounded-2xl px-5 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              {/* CAMPO TELEFONO */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                  <Smartphone size={14} /> WhatsApp
                </label>
                <input 
                  type="tel" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="11 1234 5678"
                  className="w-full bg-slate-50 text-gray-600 border-none h-14 rounded-2xl px-5 font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                  <CreditCard size={14} /> Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMetodoPago("efectivo")}
                    className={`h-14 rounded-2xl font-bold border-2 transition-all ${metodoPago === 'efectivo' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    Efectivo
                  </button>
                  <button 
                    onClick={() => setMetodoPago("transferencia")}
                    className={`h-14 rounded-2xl font-bold border-2 transition-all ${metodoPago === 'transferencia' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    Transferencia
                  </button>
                </div>
              </div>

              {/* INFO TRANSFERENCIA (Condicional) */}
              {metodoPago === "transferencia" && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Datos de Cuenta</p>
                  <p className="text-sm font-bold text-blue-900">Alias: clay.burger.mp</p>
                  <p className="text-sm font-bold text-blue-900">CBU: 00000031000... (Banco X)</p>
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN FINAL DE ENVÍO */}
          <div className="p-6 border-t border-slate-100 bg-white pb-10">
            <button 
              disabled={!nombre || !telefono}
              onClick={handleFinalizarPedido}
              className="w-full max-w-md mx-auto bg-green-600 disabled:bg-slate-300 text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
            >
              ENVIAR POR WHATSAPP
              <Send size={20} />
            </button>
          </div>

        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}