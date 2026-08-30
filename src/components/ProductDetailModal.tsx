import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Share2,
  Package,
  Layers,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onWhatsAppOrder: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
  onWhatsAppOrder,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(
    product.mainImage || (product.gallery && product.gallery[0]) || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const allImages = [
    product.mainImage,
    ...(product.gallery || [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const hasDiscount = product.promotionalPrice && product.promotionalPrice < product.price;
  const currentPrice = hasDiscount ? product.promotionalPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.promotionalPrice || product.price)) / product.price) * 100)
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Confira ${product.name} na SAT LOJA por R$ ${currentPrice.toFixed(2)}`,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch {
        // Fallback for iframe restrictions
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleIncrease = () => {
    const maxStock = product.stock && product.stock > 0 ? product.stock : 99;
    if (quantity < maxStock) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close & Share Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <span className="text-amber-400">{product.category}</span>
            <span>•</span>
            <span className="font-mono text-zinc-500">SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors"
              title="Compartilhar Produto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-300 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Active Image with Zoom Frame */}
            <div className="relative aspect-square w-full rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center p-6 shadow-inner">
              <img
                src={selectedImage || product.mainImage}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300"
              />

              {hasDiscount && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-black uppercase tracking-wider shadow-lg">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    ECONOMIZE {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-16 h-16 rounded-xl bg-zinc-950 border overflow-hidden shrink-0 transition-all p-1 ${
                      selectedImage === imgUrl
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-zinc-800 text-center">
              <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <ShieldCheck className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-[10px] font-bold text-zinc-300">Garantia SAT</span>
                <span className="text-[9px] text-zinc-400">Até 12 Meses</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <Truck className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-[10px] font-bold text-zinc-300">Envio Seguro</span>
                <span className="text-[9px] text-zinc-400">Rastreamento Total</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <RotateCcw className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-[10px] font-bold text-zinc-300">Troca Fácil</span>
                <span className="text-[9px] text-zinc-400">7 Dias Devolução</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Purchase Controls */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-['Outfit'] mb-3">
                {product.name}
              </h2>

              {/* Price box */}
              {(() => {
                const paymentCfg = settings?.paymentSettings;
                const pixDiscount = paymentCfg?.enablePix && (paymentCfg?.pixDiscountPercent || 0) > 0 ? paymentCfg.pixDiscountPercent : 0;
                const pixPrice = pixDiscount > 0 ? currentPrice * (1 - pixDiscount / 100) : currentPrice;

                return (
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 mb-5">
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-zinc-400 line-through">
                          De: R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          Economize R$ {(product.price - product.promotionalPrice!).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-bold text-amber-400">R$</span>
                      <span className="text-3xl font-black text-amber-400 tracking-tight font-['Outfit']">
                        {pixDiscount > 0 ? pixPrice.toFixed(2).replace('.', ',') : currentPrice.toFixed(2).replace('.', ',')}
                      </span>
                      {pixDiscount > 0 ? (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          à vista no Pix ({pixDiscount}% OFF)
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400 font-medium">à vista</span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-300">
                  {product.stock > 0 ? (
                    <span className="text-emerald-400">
                      Disponível em estoque ({product.stock} unidades)
                    </span>
                  ) : (
                    <span className="text-rose-400">Produto temporariamente esgotado</span>
                  )}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Descrição do Produto
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {product.detailedDescription || product.description}
                </p>
              </div>

              {/* Tech Specs if available */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
                    Especificações Técnicas
                  </h4>
                  <div className="divide-y divide-zinc-800 rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3 text-xs">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="py-1.5 flex justify-between gap-4">
                        <span className="text-zinc-400 font-medium">{key}</span>
                        <span className="text-zinc-200 font-semibold text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and CTA actions */}
            <div className="pt-4 border-t border-zinc-800 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold text-zinc-300 uppercase">Quantidade:</span>
                <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={product.stock > 0 ? quantity >= product.stock : quantity >= 99}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {/* Buy Button with direct WhatsApp */}
                <button
                  type="button"
                  onClick={() => onWhatsAppOrder(product, quantity)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>FALAR NO WHATSAPP / COMPRAR AGORA</span>
                </button>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>ADICIONAR AO CARRINHO (R$ {(currentPrice * quantity).toFixed(2).replace('.', ',')})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
