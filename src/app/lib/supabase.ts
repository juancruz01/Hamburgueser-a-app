import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categorias (nombre)
    `)
    .eq('disponible', true)
    .order('nombre');

  if (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
  return data;
}