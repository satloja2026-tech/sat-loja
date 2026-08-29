import React, { useState } from 'react';
import { Upload, RotateCcw, Check, Sparkles, Image, Eye } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { StoreSettings } from '../../types';
import { db } from '../../services/db';

interface AdminLogoProps {
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminLogo: React.FC<AdminLogoProps> = ({ settings, onRefresh }) => {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [storeName, setStoreName] = useState(settings.storeName || 'SAT LOJA');
  const [saved, setSaved] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setLogoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = () => {
    setLogoUrl('');
    setStoreName('SAT LOJA');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings({
      logoUrl: logoUrl.trim() || undefined,
      storeName: storeName.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Personalização de Logo e Marca
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Faça upload de uma imagem personalizada para o logo ou use o emblema metálico padrão da SAT LOJA.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Configurações da Marca</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome da Loja</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Upload da Imagem do Logo (PNG transparente, SVG, JPG, WEBP)</label>
              <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/60 group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors mb-2" />
                <p className="text-xs font-bold text-zinc-200 group-hover:text-amber-400">
                  Clique ou solte o arquivo do seu logo aqui
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Recomendado: formato horizontal ou ícone 512x512 PNG com fundo transparente
                </p>
              </label>
            </div>

            {/* Or URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Ou cole uma URL direta da imagem</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://suaempresa.com/logo.png"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Logo Padrão SAT LOJA</span>
              </button>
            </div>
          </div>

          {/* Live Preview Area */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Pré-visualização em Tempo Real</span>
              </h3>

              {/* Dark mode header preview */}
              <div className="space-y-2">
                <span className="text-[11px] text-zinc-400 font-semibold block">Em Fundo Escuro (Navbar / Tema Atual):</span>
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <BrandLogo logoUrl={logoUrl} storeName={storeName} size="lg" />
                </div>
              </div>

              {/* Light mode preview */}
              <div className="space-y-2 mt-4">
                <span className="text-[11px] text-zinc-400 font-semibold block">Em Fundo Claro / Impressão:</span>
                <div className="p-6 rounded-2xl bg-zinc-100 border border-zinc-300 flex items-center justify-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-10 max-w-[200px] object-contain" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-amber-400 font-black flex items-center justify-center font-mono">
                        SAT
                      </div>
                      <span className="text-xl font-black text-zinc-900 font-['Outfit']">{storeName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {saved && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Identidade visual e logo atualizados com sucesso!</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Alterações do Logo</span>
          </button>
        </div>
      </form>
    </div>
  );
};
