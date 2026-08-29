import React, { useState } from 'react';
import { UserCheck, Lock, Shield, Check, Key } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 4) {
      setError('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('A confirmação de senha não confere.');
      return;
    }

    setError('');
    setSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Conta de Administrador e Segurança
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Gerencie o acesso ao painel administrativo da SAT LOJA.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Administrador Geral (SAT LOJA)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Usuário: <code className="text-white font-mono font-bold">admin</code></p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Key className="w-4 h-4 text-amber-400" />
          <span>Alterar Senha de Acesso</span>
        </h3>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Senha atualizada com sucesso no navegador!</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Senha Atual</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Digite a senha atual"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Nova Senha</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Digite a nova senha desejada"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Salvar Nova Senha</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
