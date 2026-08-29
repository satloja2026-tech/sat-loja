import React from 'react';
import { Flame, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';

interface OffersSectionProps {
  products: Product[];
  settings: StoreSettings;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectWhatsApp: (product: Product) => void;
  onNavigateToCatalog: () => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  products,
  settings,
  onViewProduct,
  onAddToCart,
  onDirectWhatsApp,
  onNavigateToCatalog,
}) => {
  const offerProducts = products.filter(p => p.isActive && p.isOffer).slice(0, 4);

  if (offerProducts.length === 0) return null;

  return (
    <section id="ofertas" className="py-16 bg-gradient-to-b from-[#0b0c10] via-zinc-950 to-[#0b0c10] border-b border-zinc-800/80 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>OFERTAS RELÂMPAGO SAT LOJA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
              DESCONTOS EXCLUSIVOS POR TEMPO LIMITADO
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Aproveite os melhores preços em tecnologia com garantia oficial.
            </p>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group cursor-pointer self-start sm:self-auto"
          >
            <span>Ver todas as ofertas</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {offerProducts.map((product) => (
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
      </div>
    </section>
  );
};
