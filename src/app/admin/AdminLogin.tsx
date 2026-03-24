"use client";
import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLogin({ onAccess }: { onAccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En un proyecto real, esto se validaría contra una API segura.
    // Para este MVP, comparamos con la variable de entorno o una constante.
    if (password === "clay2026") { 
      localStorage.setItem("admin_auth", "true");
      onAccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="max-w-sm w-full bg-slate-900 p-8 rounded-4xl border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
          <Lock size={32} />
        </div>
        
        <h2 className="text-2xl font-black text-center uppercase italic mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 text-center text-sm mb-8">Solo personal autorizado de Clay Burger.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Clave de acceso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full h-14 bg-slate-800 rounded-2xl px-6 font-bold outline-none border-2 transition-all ${
              error ? 'border-red-500 shake' : 'border-transparent focus:border-orange-500'
            }`}
          />
          <button className="w-full bg-orange-500 h-14 rounded-2xl font-black text-lg hover:bg-orange-600 active:scale-95 transition-all">
            ENTRAR AL PANEL
          </button>
        </form>
      </div>
    </div>
  );
}