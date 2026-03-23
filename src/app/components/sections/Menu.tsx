import { BurgerCard } from "../ui/BurgerCard";
import { OrderDrawer } from "../ui/OrderDrawer";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  categorias: { nombre: string };
}

export default function Menu({ productos }: { productos: Producto[] }) {
  // Separamos por categorías para el diseño
  const hamburguesas = productos.filter(p => p.categorias.nombre === 'Hamburguesas');
  const bebidas = productos.filter(p => p.categorias.nombre === 'Bebidas');

  return (
    <section id="menu" className="py-8 px-4 max-w-md mx-auto bg-white">
      {/* SECCIÓN HAMBURGUESAS */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-orange-500 rounded-full italic" />
          NUESTRAS BURGERS
        </h2>
        
        {/* GRID DE 2 COLUMNAS */}
        <div className="grid grid-cols-2 gap-4">
          {hamburguesas.map((item) => (
            <OrderDrawer key={item.id} producto={item}>
              <div className="cursor-pointer">
                <BurgerCard producto={item} />
              </div>
            </OrderDrawer>
          ))}
        </div>
      </div>

      {/* SECCIÓN BEBIDAS */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase italic">
          <span className="w-2 h-8 bg-blue-500 rounded-full" />
          Bebidas
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {bebidas.map((item) => (
            <OrderDrawer key={item.id} producto={item}>
              <div className="cursor-pointer">
                <BurgerCard producto={item} />
              </div>
            </OrderDrawer>
          ))}
        </div>
      </div>
    </section>
  );
}