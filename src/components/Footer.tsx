import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowUp,
  Award,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { StoreSettings, Category } from '../types';

interface FooterProps {
  settings: StoreSettings;
  categories: Category[];
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (categoryName: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  onNavigate,
  onSelectCategory,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch {
        // ignore
      }
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 text-xs border-t border-zinc-800/80 relative">
      {/* Upper Footer: Newsletter / Commitment Bar */}
      <div className="border-b border-zinc-800/60 py-8 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Excelência SAT LOJA
              </h4>
              <p className="text-zinc-400 text-xs">
                Garantia de procedência, pós-venda dedicado e suporte humanizado via WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 shrink-0 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Voltar ao topo</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo logoUrl={settings.logoUrl} storeName={settings.storeName} size="md" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              {settings.metaDescription || 'Sua loja de tecnologia, smartphones e acessórios premium com garantia oficial, envio rápido e atendimento personalizado.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 text-zinc-400 hover:text-amber-400 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 text-zinc-400 hover:text-amber-400 flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-400 text-zinc-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp Oficial"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Catálogo de Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categorias')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Departamentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ofertas')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Ofertas Especiais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contato')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
              Categorias
            </h4>
            <ul className="space-y-2">
              {categories.filter(c => c.isActive).slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.name);
                      onNavigate('catalogo');
                    }}
                    className="hover:text-amber-400 transition-colors cursor-pointer truncate max-w-[160px] text-left block"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Security & Payments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
              Segurança & Pagamentos
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-zinc-300">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Pix Instantâneo</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Cartões em até 12x</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Ambiente Seguro SSL</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Compra Protegida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            © {new Date().getFullYear()} <strong className="text-zinc-300 font-semibold">{settings.storeName}</strong> — Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <span>Privacidade & Termos</span>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Acesso Administrativo</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
