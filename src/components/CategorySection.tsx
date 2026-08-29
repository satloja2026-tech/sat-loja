import React from 'react';
import { Category } from '../types';
import {
  Smartphone,
  Headphones,
  Watch,
  Zap,
  Grid,
  Gamepad2,
  Tv,
  Camera,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const activeCategories = categories
    .filter(c => c.isActive)
    .sort((a, b) => a.order - b.order);

  const getIconComponent = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'headphones':
        return <Headphones className="w-5 h-5" />;
      case 'watch':
        return <Watch className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      case 'gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      case 'tv':
        return <Tv className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      default:
        return <Grid className="w-5 h-5" />;
    }
  };

  return (
    <section id="categorias" className="py-16 bg-[#0b0c10] border-b border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Layers className="w-4 h-4" />
              <span>Navegue por Departamentos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
              CATEGORIAS EM DESTAQUE
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              Selecione uma categoria para explorar os eletrônicos e acessórios disponíveis.
            </p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>Ver todas as categorias</span>
              <span className="bg-amber-400 text-black text-[10px] px-1.5 py-0.2 rounded font-black">✕</span>
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {activeCategories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/30 scale-102 shadow-xl shadow-amber-500/10 bg-zinc-800'
                    : 'border-zinc-800/90 hover:border-amber-500/50 bg-zinc-900/80 hover:bg-zinc-800/90'
                }`}
              >
                {/* Image Cover */}
                <div className="h-28 sm:h-32 w-full overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                  
                  {/* Floating Icon */}
                  <div
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-black/60 text-amber-400 border border-zinc-700/60 group-hover:bg-amber-400 group-hover:text-black'
                    }`}
                  >
                    {getIconComponent(cat.icon)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                        isSelected ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <ArrowUpRight
                      className={`w-3.5 h-3.5 transition-transform duration-300 shrink-0 ${
                        isSelected
                          ? 'text-amber-400 translate-x-0.5 -translate-y-0.5'
                          : 'text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                      }`}
                    />
                  </div>
                  {isSelected && (
                    <span className="mt-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      • Selecionado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
