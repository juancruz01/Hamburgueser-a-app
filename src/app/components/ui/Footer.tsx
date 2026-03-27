import { Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 px-6 mt-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          
          {/* COLUMNA 1: MARCA */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black flex flex-col uppercase italic tracking-tighter">
              CLAY <span className="text-orange-500">BURGER</span>
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0 font-medium leading-relaxed">
              Las mejores hamburguesas de Claypole, hechas con amor y el mejor blend de carne.
            </p>
          </div>

          {/* COLUMNA 2: CONTACTO */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contacto</h4>
            <div className="space-y-3">
              <a 
                href="tel:541159320255" 
                className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-orange-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                    <Phone size={16} className="text-orange-500" />
                </div>
                <span className="font-bold text-sm">+54 11 5932-0255</span>
              </a>
              <a 
                href="mailto:pedidos@clayburger.com" 
                className="flex items-center justify-center md:justify-start gap-3 text-slate-300 hover:text-orange-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                    <Mail size={16} className="text-orange-500" />
                </div>
                <span className="font-bold text-sm">pedidos@clayburger.com</span>
              </a>
            </div>
          </div>

          {/* COLUMNA 3: SOCIALES (LOGO REAL) */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Seguinos</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a 
                href="https://instagram.com/tu_usuario" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center hover:bg-linear-to-tr hover:from-orange-500 hover:to-pink-500 transition-all hover:-translate-y-1 shadow-lg group"
              >
                {/* SVG OFICIAL DE INSTAGRAM */}
                <svg 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white group-hover:scale-110 transition-transform"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* LÍNEA FINAL DE CRÉDITOS */}
        <div className="pt-8 border-t border-slate-900 text-center space-y-3">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            © {currentYear} CLAY BURGER - TODOS LOS DERECHOS RESERVADOS
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-700 font-medium uppercase tracking-wider">
            <span>Desarrollado con ❤️ por</span>
            <span className="bg-slate-900 px-2 py-1 rounded text-orange-500 font-black">Juan Cruz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}