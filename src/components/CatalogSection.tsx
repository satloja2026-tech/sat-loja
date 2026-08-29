import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Flame,
  Check,
  RotateCcw,
  Package,
} from 'lucide-react';
import { Product, Category, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectWhatsApp: (product: Product) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  categories,
  settings,
  selectedCategory,
  onSelectCategory,
  onViewProduct,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'name'>('recent');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filtered & Sorted Product List
  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        if (!p || !p.isActive) return false;

        // Search term (name, sku, category, tags)
        if (searchTerm.trim().length > 0) {
          const term = searchTerm.toLowerCase();
          const matchesName = (p.name || '').toLowerCase().includes(term);
          const matchesSku = (p.sku || '').toLowerCase().includes(term);
          const matchesCat = (p.category || '').toLowerCase().includes(term);
          const matchesTags = Array.isArray(p.tags)
            ? p.tags.some(t => t && t.toLowerCase().includes(term))
            : false;
          if (!matchesName && !matchesSku && !matchesCat && !matchesTags) return false;
        }

        // Category filter
        if (selectedCategory && (p.category || '').toLowerCase().trim() !== selectedCategory.toLowerCase().trim()) {
          return false;
        }

        // Offers filter
        if (onlyOffers && !p.isOffer) {
          return false;
        }

        // Featured filter
        if (onlyFeatured && !p.isFeatured) {
          return false;
        }

        // In Stock filter
        if (onlyInStock && (typeof p.stock !== 'number' || p.stock <= 0)) {
          return false;
        }

        // Price range filter
        const price = typeof p.promotionalPrice === 'number' ? p.promotionalPrice : (typeof p.price === 'number' ? p.price : 0);
        if (minPrice && price < parseFloat(minPrice)) {
          return false;
        }
        if (maxPrice && price > parseFloat(maxPrice)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = typeof a.promotionalPrice === 'number' ? a.promotionalPrice : (typeof a.price === 'number' ? a.price : 0);
        const priceB = typeof b.promotionalPrice === 'number' ? b.promotionalPrice : (typeof b.price === 'number' ? b.price : 0);

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        // Default 'recent'
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [products, searchTerm, selectedCategory, onlyOffers, onlyFeatured, onlyInStock, minPrice, maxPrice, sortBy]);

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory || onlyOffers || onlyFeatured || onlyInStock || minPrice || maxPrice
  );

  const resetAllFilters = () => {
    setSearchTerm('');
    onSelectCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setOnlyOffers(false);
    setOnlyFeatured(false);
    setOnlyInStock(false);
    setSortBy('recent');
  };

  return (
    <section id="catalogo" className="py-16 bg-[#0b0c10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Package className="w-4 h-4" />
              <span>Catálogo Completo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
              TODOS OS PRODUTOS
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              {selectedCategory && <span> na categoria <strong className="text-amber-400">{selectedCategory}</strong></span>}
            </p>
          </div>

          {/* Search bar & Mobile filter button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por nome, SKU, tag..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters (Desktop) + Product List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <div
            className={`lg:block ${
              showFiltersMobile ? 'block' : 'hidden'
            } bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-6 backdrop-blur-sm sticky top-28`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Filtros de Busca</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {/* Ordering / Sort */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Ordenar Por</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="recent">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="name">Nome (A - Z)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Categorias
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => onSelectCategory(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === null
                      ? 'bg-amber-400/15 text-amber-400 font-bold border border-amber-400/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <span>Todas as categorias</span>
                  <span className="text-[10px] text-zinc-500">{products.length}</span>
                </button>
                {categories.filter(c => c.isActive).map((cat) => {
                  const count = products.filter(p => p.isActive && p.category === cat.name).length;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-400/15 text-amber-400 font-bold border border-amber-400/30'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-zinc-500">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Destaques & Ofertas
              </label>

              <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Somente em Promoção
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Produtos em Destaque
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Apenas com Estoque
                </span>
              </label>
            </div>

            {/* Price Range Filter */}
            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Faixa de Preço (R$)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Nenhum produto encontrado</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    Tente ajustar seus termos de pesquisa ou remover alguns dos filtros aplicados.
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all"
                  >
                    Limpar Todos os Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    settings={settings}
                    onViewDetails={onViewProduct}
                    onAddToCart={onAddToCart}
                    onDirectWhatsApp={onDirectWhatsApp}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
