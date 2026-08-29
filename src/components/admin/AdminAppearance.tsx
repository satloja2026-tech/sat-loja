import React, { useState } from 'react';
import {
  Palette,
  Eye,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { StoreSettings, SiteSectionsConfig } from '../../types';
import { db } from '../../services/db';

interface AdminAppearanceProps {
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminAppearance: React.FC<AdminAppearanceProps> = ({ settings, onRefresh }) => {
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#eab308');
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#0b0c10');
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#10b981');
  const [showTopBar, setShowTopBar] = useState(settings.showTopBar !== false);
  const [topBarText, setTopBarText] = useState(
    settings.topBarText || '⚡ OFERTAS EXCLUSIVAS DE LANÇAMENTO • FRETE GRÁTIS ACIMA DE R$ 299'
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    settings.freeShippingThreshold || 299
  );

  const [sections, setSections] = useState<SiteSectionsConfig>(
    settings.sectionsConfig || {
      showHeroBanner: true,
      showBenefitsBar: true,
      showCategories: true,
      showOffersSection: true,
      showCatalogSection: true,
      showContactSection: true,
    }
  );

  const [saved, setSaved] = useState(false);

  const handleSectionToggle = (key: keyof SiteSectionsConfig) => {
    setSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetColors = () => {
    setPrimaryColor('#eab308');
    setSecondaryColor('#0b0c10');
    setAccentColor('#10b981');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings({
      primaryColor,
      secondaryColor,
      accentColor,
      showTopBar,
      topBarText,
      freeShippingThreshold: Number(freeShippingThreshold),
      sectionsConfig: sections,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Editor Visual e Aparência do Site
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Controle a paleta de cores, barra de anúncios e a visibilidade de cada seção da SAT LOJA.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Aparência e seções do site atualizadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors & Branding */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Paleta de Cores do Tema</span>
              </h3>
              <button
                type="button"
                onClick={handleResetColors}
                className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Padrão Gold</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor Primária / Destaques Gold</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor de Fundo Principal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-32 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Cor de Ação / WhatsApp & Sucesso</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-32 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Threshold for free shipping */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Valor Mínimo para Frete Grátis (R$)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
              <LayoutGrid className="w-4 h-4 text-amber-400" />
              <span>Visibilidade das Seções do Site</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <span className="text-zinc-200 font-medium">Carrossel de Banners Principais</span>
                <input
                  type="checkbox"
                  checked={sections.showHeroBanner}
                  onChange={() => handleSectionToggle('showHeroBanner')}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <span className="text-zinc-200 font-medium">Barra de Benefícios & Diferenciais</span>
                <input
                  type="checkbox"
                  checked={sections.showBenefitsBar}
                  onChange={() => handleSectionToggle('showBenefitsBar')}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <span className="text-zinc-200 font-medium">Carrossel de Departamentos / Categorias</span>
                <input
                  type="checkbox"
                  checked={sections.showCategories}
                  onChange={() => handleSectionToggle('showCategories')}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <span className="text-zinc-200 font-medium">Seção de Ofertas Relâmpago</span>
                <input
                  type="checkbox"
                  checked={sections.showOffersSection}
                  onChange={() => handleSectionToggle('showOffersSection')}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <span className="text-zinc-200 font-medium">Catálogo Geral com Filtros e Busca</span>
                <input
                  type="checkbox"
                  checked={sections.showCatalogSection}
                  onChange={() => handleSectionToggle('showCatalogSection')}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <span className="text-zinc-200 font-medium">Formulário de Contato & Localização</span>
                <input
                  type="checkbox"
                  checked={sections.showContactSection}
                  onChange={() => handleSectionToggle('showContactSection')}
                  className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Top Announcement Bar Configuration */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Barra Superior de Avisos / Ofertas</span>
            </h3>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showTopBar}
                onChange={(e) => setShowTopBar(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4"
              />
              <span>Ativar barra de aviso superior</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Texto da Mensagem</label>
            <input
              type="text"
              value={topBarText}
              onChange={(e) => setTopBarText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Aparência e Layout</span>
          </button>
        </div>
      </form>
    </div>
  );
};
