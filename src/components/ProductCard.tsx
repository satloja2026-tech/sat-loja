import React from 'react';
import {
  ShoppingCart,
  MessageCircle,
  Eye,
  Flame,
  Check,
  Package,
} from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onDirectWhatsApp: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onViewDetails,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.promotionalPrice || product.price)) / product.price) * 100)
    : 0;

  const currentPrice = hasDiscount ? product.promotionalPrice! : product.price;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="group relative rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950 flex items-center justify-center p-4">
        {/* Main Image with Zoom on hover */}
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Dark subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isOffer && hasDiscount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[11px] font-black uppercase tracking-wider shadow-md">
              <Flame className="w-3 h-3 fill-black" />
              -{discountPercent}%
            </span>
          )}

          {product.isFeatured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-zinc-900/90 border border-amber-400/40 text-amber-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Destaque
            </span>
          )}
        </div>

        {/* Stock / Availability Badge on Top Right */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-600/40 text-rose-300 text-[10px] font-bold uppercase">
              Esgotado
            </span>
          ) : product.stock <= 3 ? (
            <span className="px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-semibold animate-pulse">
              Últimas {product.stock} un.
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg bg-zinc-900/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium flex items-center gap-1 backdrop-blur-md">
              <Check className="w-2.5 h-2.5" />
              Pronta Entrega
            </span>
          )}
        </div>

        {/* Quick View Button on Image hover */}
        <button
          onClick={() => onViewDetails(product)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-zinc-900/95 hover:bg-amber-400 hover:text-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-zinc-700 hover:border-amber-400 flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver Detalhes</span>
        </button>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 font-medium">
            <span className="truncate max-w-[140px] text-amber-400/90 font-semibold">{product.category}</span>
            <span className="font-mono text-zinc-500">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm font-bold text-zinc-100 hover:text-amber-400 transition-colors line-clamp-2 leading-snug cursor-pointer mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-zinc-800/80">
          {/* Price Container */}
          <div className="mb-3.5">
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through mr-2 font-medium">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-zinc-400">R$</span>
              <span className="text-xl font-black text-amber-400 tracking-tight font-['Outfit']">
                {currentPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">à vista</span>
            </div>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              ou até 12x no cartão
            </span>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Direct WhatsApp purchase button */}
            <button
              onClick={() => onDirectWhatsApp(product)}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1.5 bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 py-2 px-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Pedir direto pelo WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Add to Cart button */}
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black py-2 px-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/15 transition-all hover:scale-102 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Adicionar ao Carrinho"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
