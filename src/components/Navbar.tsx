import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
  ShieldCheck,
  Tag,
  Grid,
  Phone,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Product, StoreSettings, Category } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (sectionId: string) => void;
  currentSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  categories,
  products,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onSelectProduct,
  onSelectCategory,
  onNavigate,
  currentSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim().length >= 2
    ? (products || []).filter(p => {
        if (!p || !p.isActive) return false;
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        const matchesCat = (p.category || '').toLowerCase().includes(q);
        const matchesTags = Array.isArray(p.tags) ? p.tags.some(t => t && t.toLowerCase().includes(q)) : false;
        return matchesName || matchesSku || matchesCat || matchesTags;
      }).slice(0, 5)
    : [];

  const handleSearchSelect = (product: Product) => {
    setSearchQuery('');
    setSearchFocused(false);
    onSelectProduct(product);
  };

  const navLinks = [
    { name: 'Início', href: 'inicio', icon: null },
    { name: 'Produtos', href: 'catalogo', icon: null },
    { name: 'Categorias', href: 'categorias', icon: null },
    { name: 'Ofertas', href: 'ofertas', icon: <Flame className="w-4 h-4 text-amber-400 inline -mt-0.5 animate-pulse" /> },
    { name: 'Contato', href: 'contato', icon: null },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/80 border-b border-amber-500/20 text-xs py-1.5 px-4 text-zinc-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-semibold text-[11px] border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              OFICIAL SAT LOJA
            </span>
            <span className="hidden sm:inline text-zinc-400">
              {settings.tagline}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline font-medium">WhatsApp:</span> {settings.phone || settings.whatsappNumber}
            </a>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 font-medium transition-colors bg-zinc-800/80 hover:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/50"
              title="Acessar Painel Administrativo"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0b0c10]/95 backdrop-blur-md shadow-2xl shadow-black/80 border-b border-zinc-800/80 py-2.5'
            : 'bg-[#0b0c10]/80 backdrop-blur-sm border-b border-zinc-800/40 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <div onClick={() => onNavigate('inicio')} className="cursor-pointer shrink-0">
            <BrandLogo logoUrl={settings.logoUrl} storeName={settings.storeName} size="md" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => onNavigate(link.href)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  currentSection === link.href
                    ? 'text-amber-400 bg-amber-400/10 font-semibold shadow-inner shadow-amber-400/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </div>

          {/* Search Bar with Instant Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Pesquisar smartphones, fones, SKU, marcas..."
                className="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchFocused && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-zinc-800/60">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Resultados encontrados ({searchResults.length})
                    </div>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSearchSelect(item)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/80 cursor-pointer transition-colors group"
                      >
                        <img
                          src={item.mainImage}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-800 border border-zinc-700/50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-100 truncate group-hover:text-amber-400 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span>SKU: {item.sku}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">
                              R$ {(item.promotionalPrice || item.price).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-zinc-400">
                    Nenhum produto encontrado para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons: WhatsApp & Cart & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Direct WhatsApp Call */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold px-3.5 py-2 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">Carrinho</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center bg-black text-amber-400 text-[11px] font-black w-5 h-5 rounded-full border border-amber-400/60">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 lg:hidden"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input when screen is small */}
        <div className="px-4 pt-2.5 pb-1 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Autocomplete for mobile */}
          {searchQuery.trim().length >= 2 && (
            <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-xl divide-y divide-zinc-800 p-2 shadow-xl">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSearchSelect(item)}
                    className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer"
                  >
                    <img src={item.mainImage} alt={item.name} className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate font-medium">{item.name}</p>
                      <p className="text-[10px] text-amber-400 font-bold">R$ {(item.promotionalPrice || item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 text-center py-2">Nenhum resultado.</p>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[96px] bottom-0 bg-[#0b0c10]/95 backdrop-blur-xl border-b border-zinc-800 z-30 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  onNavigate(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl text-base font-semibold text-left transition-colors ${
                  currentSection === link.href
                    ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                    : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800/80">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Categorias Rápidas
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.filter(c => c.isActive).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 text-left truncate transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chamar no WhatsApp Oficial</span>
            </a>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs border border-zinc-700"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Acessar Painel de Controle</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
