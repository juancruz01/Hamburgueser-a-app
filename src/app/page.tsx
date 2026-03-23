import Navbar from "./components/ui/Navbar";
import Hero from "./components/sections/Hero";
import Menu from "./components/sections/Menu";
import { getProductos } from "./lib/supabase";
import CartButton from "./components/ui/CartButton";

export default async function Page() {
  const productos = await getProductos();

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Menu productos={productos || []}/>
      <CartButton />
      {/* El resto de tus secciones... */}
    </main>
  );
}