import React, { useState } from 'react';
import { Settings, Save, Check, Globe, Phone, Mail, MapPin, Share2, FileCode } from 'lucide-react';
import { StoreSettings } from '../../types';
import { db } from '../../services/db';

interface AdminSettingsProps {
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Configurações Gerais da Loja & SEO
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Defina as informações cadastrais, canais de atendimento, redes sociais e otimização para buscas.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Configurações gerais atualizadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact & Registration info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Dados da Empresa & Atendimento</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Nome Comercial da Loja</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">E-mail Comercial</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Telefone Principal (Exibição)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Horário de Atendimento</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="Ex: Seg a Sex: 08h às 18h | Sáb: 08h às 13h"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Endereço Físico / Sede</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Ex: Av. Fernandes Lima, 1200 - Maceió/AL"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Redes Sociais Oficiais</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Link do Instagram</label>
              <input
                type="url"
                value={formData.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/satloja"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Link do Facebook</label>
              <input
                type="url"
                value={formData.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/satloja"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* SEO Metatags */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>SEO & Metatags de Compartilhamento</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Meta Título (Título da aba do navegador)</label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="SAT LOJA — Loja Virtual Oficial"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Meta Descrição (Google e Redes Sociais)</label>
              <textarea
                rows={2}
                value={formData.metaDescription || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="Compre smartphones, eletrônicos e acessórios com atendimento direto via WhatsApp."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Palavras-chave (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.metaKeywords || ''}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                placeholder="sat loja, smartphone, eletronicos, tecnologia, celulares"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
