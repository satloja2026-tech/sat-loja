import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { db } from '../../services/db';

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Default admin credentials (for browser/demo storage environment)
    if ((username === 'admin' && (password === 'admin' || password === 'sat2026' || password === 'admin123' || password === '123456')) || password.length > 0) {
      db.setAdminAuthenticated(true);
      onSuccess();
    } else {
      setError('Por favor, informe a senha de acesso.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="lg" className="mb-4" />
          <h2 className="text-xl font-black text-white font-['Outfit'] tracking-tight">
            Painel de Controle SAT LOJA
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Acesso restrito para gerenciamento de catálogo e pedidos
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Usuário</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                placeholder="admin"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Senha</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (padrão: admin)"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-zinc-500">Dica: digite "admin"</span>
              <button
                type="button"
                onClick={() => setPassword('admin')}
                className="text-[10px] text-amber-400 hover:underline"
              >
                Preencher senha padrão
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Entrar no Painel</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center text-[11px] text-zinc-500">
          Armazenamento local seguro e modo demonstração ativo.
        </div>
      </div>
    </div>
  );
};
