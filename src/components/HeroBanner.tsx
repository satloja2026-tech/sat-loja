import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import { Banner } from '../types';

interface HeroBannerProps {
  banners: Banner[];
  onNavigateToProducts: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners, onNavigateToProducts }) => {
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  if (activeBanners.length === 0) return null;

  const safeIndex = currentIndex >= activeBanners.length ? 0 : currentIndex;
  const current = activeBanners[safeIndex];

  if (!current) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div
      className="relative overflow-hidden bg-zinc-950 pt-28 pb-12 lg:pt-36 lg:pb-20 border-b border-zinc-800/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-yellow-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-zinc-900/60 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] min-h-[420px] md:min-h-[480px] flex items-center">
          {/* Background Image with Dynamic Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Multi-layered dark gradient to ensure high readability */}
            <div className={`absolute inset-0 bg-gradient-to-r ${current.bgGradient || 'from-black/95 via-black/80 to-transparent'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-80" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl px-6 py-12 sm:px-12 sm:py-16 flex flex-col items-start">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SAT LOJA • TECNOLOGIA PREMIUM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] font-['Outfit'] drop-shadow-md uppercase">
              {current.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
              {current.subtitle}
            </p>

            {/* Action CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToProducts}
                className="group flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black px-7 py-3.5 rounded-xl text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{current.buttonText || 'VER PRODUTOS'}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-zinc-700/50">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Garantia & Entrega Rápida</span>
              </div>
            </div>
          </div>

          {/* Carousel Arrows */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-400 hover:text-black text-white border border-zinc-700/60 backdrop-blur-md flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg"
                aria-label="Banner anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-400 hover:text-black text-white border border-zinc-700/60 backdrop-blur-md flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg"
                aria-label="Próximo banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700/50">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-6 h-2 bg-amber-400 shadow-sm shadow-amber-400'
                      : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Value Propositions / Store Highlights Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3.5 bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produtos 100% Originais</h4>
              <p className="text-[11px] text-zinc-400">Garantia oficial e procedência</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Envio Rápido & Seguro</h4>
              <p className="text-[11px] text-zinc-400">Despacho com rastreamento</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atendimento WhatsApp</h4>
              <p className="text-[11px] text-zinc-400">Tire dúvidas em tempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Melhor Custo-Benefício</h4>
              <p className="text-[11px] text-zinc-400">Preços promocionais e Pix</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
