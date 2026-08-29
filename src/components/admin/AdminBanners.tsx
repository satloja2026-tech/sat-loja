import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Layers,
  Search,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { Banner, Product, Category } from '../../types';
import { db } from '../../services/db';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminBannersProps {
  banners: Banner[];
  products?: Product[];
  categories?: Category[];
  onRefresh: () => void;
}

// Curated high-resolution banner image presets
const BANNER_PRESETS = [
  {
    id: 'preset-phone-1',
    title: 'Smartphones 5G & Titânio',
    category: 'Smartphones',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
    tag: 'LANÇAMENTO 2026',
  },
  {
    id: 'preset-phone-2',
    title: 'Display OLED & Câmeras Pro',
    category: 'Smartphones',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop',
    tag: 'TOPO DE LINHA',
  },
  {
    id: 'preset-audio-1',
    title: 'Fones ANC Hi-Res & Studio',
    category: 'Áudio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop',
    tag: 'ÁUDIO IMERSIVO',
  },
  {
    id: 'preset-audio-2',
    title: 'Caixas Bluetooth Potência Máxima',
    category: 'Áudio',
    url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop',
    tag: 'GRAVES POTENTES',
  },
  {
    id: 'preset-watch-1',
    title: 'Smartwatches & Saúde 24h',
    category: 'Wearables',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    tag: 'VIDA SAUDÁVEL',
  },
  {
    id: 'preset-gamer-1',
    title: 'Setup Gamer & Periféricos RGB',
    category: 'Gamer',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    tag: 'ULTRA SPEED',
  },
  {
    id: 'preset-tech-dark',
    title: 'Tecnologia Futurista Neon',
    category: 'Lançamentos',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1600&auto=format&fit=crop',
    tag: 'TECNOLOGIA PURA',
  },
  {
    id: 'preset-cables-charger',
    title: 'Carregadores GaN & Cabos Blindados',
    category: 'Acessórios',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1600&auto=format&fit=crop',
    tag: 'TURBO 65W',
  },
  {
    id: 'preset-promo-gold',
    title: 'Queima de Estoque & Ofertas Black',
    category: 'Ofertas',
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop',
    tag: 'ATÉ 50% OFF',
  },
];

export const AdminBanners: React.FC<AdminBannersProps> = ({
  banners,
  products = [],
  categories = [],
  onRefresh,
}) => {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Gallery Picker Tab in Modal: 'upload' | 'products' | 'presets' | 'url'
  const [imageSourceTab, setImageSourceTab] = useState<'upload' | 'products' | 'presets' | 'url'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [presetCategoryFilter, setPresetCategoryFilter] = useState('Todos');
  const [isCompressing, setIsCompressing] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');

  // Quick Image Selector Modal (from Card)
  const [quickImageBanner, setQuickImageBanner] = useState<Banner | null>(null);

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tag: '',
    buttonText: 'Explorar Ofertas',
    buttonLink: '#catalogo',
    image: '',
    order: 1,
    isActive: true,
  });

  // Extract all unique images from product catalog
  const catalogProductImages = useMemo(() => {
    const list: { url: string; productName: string; sku: string }[] = [];
    const seen = new Set<string>();

    products.forEach((p) => {
      if (p.mainImage && !seen.has(p.mainImage)) {
        seen.add(p.mainImage);
        list.push({ url: p.mainImage, productName: p.name, sku: p.sku });
      }
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((g) => {
          if (g && !seen.has(g)) {
            seen.add(g);
            list.push({ url: g, productName: p.name, sku: p.sku });
          }
        });
      }
    });
    return list;
  }, [products]);

  const filteredCatalogImages = useMemo(() => {
    if (!productSearch.trim()) return catalogProductImages;
    const q = productSearch.toLowerCase().trim();
    return catalogProductImages.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
    );
  }, [catalogProductImages, productSearch]);

  const presetCategories = useMemo(() => {
    return ['Todos', ...Array.from(new Set(BANNER_PRESETS.map((p) => p.category)))];
  }, []);

  const filteredPresets = useMemo(() => {
    if (presetCategoryFilter === 'Todos') return BANNER_PRESETS;
    return BANNER_PRESETS.filter((p) => p.category === presetCategoryFilter);
  }, [presetCategoryFilter]);

  const openCreate = () => {
    const defaultImage =
      catalogProductImages[0]?.url ||
      BANNER_PRESETS[0].url;

    setFormData({
      title: 'LANÇAMENTOS EXCLUSIVOS 2026',
      subtitle: 'Smartphones e dispositivos de alta performance com garantia e entrega rápida.',
      tag: 'NOVIDADES SAT LOJA',
      buttonText: 'Explorar Catálogo',
      buttonLink: '#catalogo',
      image: defaultImage,
      order: banners.length + 1,
      isActive: true,
    });
    setManualUrlInput('');
    setImageSourceTab('products');
    setEditingBanner(null);
    setIsCreating(true);
  };

  const openEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      tag: banner.tag || '',
      buttonText: banner.buttonText || 'Ver Ofertas',
      buttonLink: banner.buttonLink || '#catalogo',
      image: banner.image,
      order: banner.order,
      isActive: banner.isActive,
    });
    setManualUrlInput(banner.image);
    setImageSourceTab('products');
    setEditingBanner(banner);
    setIsCreating(false);
  };

  const handleConfirmDelete = () => {
    if (!bannerToDelete) return;
    try {
      db.deleteBanner(bannerToDelete.id);
      showToast('Banner excluído com sucesso!');
      setBannerToDelete(null);
      onRefresh();
    } catch (err) {
      showToast('Erro ao excluir banner', 'error');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Informe o título do banner', 'error');
      return;
    }
    if (!formData.image.trim()) {
      showToast('Selecione ou envie uma imagem para o banner', 'error');
      return;
    }

    try {
      if (editingBanner) {
        db.updateBanner(editingBanner.id, formData);
        showToast('Banner atualizado com sucesso!');
      } else {
        db.addBanner(formData);
        showToast('Novo banner criado com sucesso!');
      }
      setEditingBanner(null);
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      showToast('Erro ao salvar banner', 'error');
    }
  };

  // Image Upload handler with client compression
  const handleUploadImageFile = async (files: FileList | null, targetBannerId?: string) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecione um arquivo de imagem válido', 'error');
      return;
    }

    setIsCompressing(true);
    try {
      // Compress with 1600x750 max bounds for sharp wide banner display
      const compressedDataUrl = await compressImageFile(file, 1600, 750, 0.85);

      if (targetBannerId) {
        // Quick update directly
        db.updateBanner(targetBannerId, { image: compressedDataUrl });
        showToast('Imagem do banner atualizada com sucesso!');
        setQuickImageBanner(null);
        onRefresh();
      } else {
        // Update form state
        setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
        showToast('Imagem enviada e selecionada!');
      }
    } catch (error) {
      console.error(error);
      showToast('Erro ao processar imagem.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const selectImageForForm = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
    showToast('Imagem selecionada para o banner!');
  };

  const selectImageForQuickBanner = (url: string) => {
    if (!quickImageBanner) return;
    try {
      db.updateBanner(quickImageBanner.id, { image: url });
      showToast('Imagem do banner atualizada!');
      setQuickImageBanner(null);
      onRefresh();
    } catch (err) {
      showToast('Erro ao trocar imagem', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all text-xs font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/95 border-rose-500/50 text-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>Banners Principais da Loja</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personalize os destaques rotativos na tela inicial com fotos de produtos da galeria, upload próprio ou presets.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Banner</span>
        </button>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500">
            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">Nenhum banner cadastrado</p>
            <p className="text-xs mt-1">Clique em "Novo Banner" para adicionar o primeiro destaque visual da loja.</p>
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-all"
            >
              {/* Banner Live Mockup Preview */}
              <div className="relative aspect-[21/9] bg-zinc-950 overflow-hidden">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Visual Overlay like on Homepage */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-4 sm:p-5 flex flex-col justify-end">
                  {b.tag && (
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-400 uppercase tracking-widest bg-black/70 backdrop-blur-sm border border-amber-400/30 px-2 py-0.5 rounded-md w-fit mb-1.5 shadow">
                      {b.tag}
                    </span>
                  )}
                  <h4 className="text-sm sm:text-base font-black text-white line-clamp-1 font-['Outfit'] drop-shadow-md">
                    {b.title}
                  </h4>
                  {b.subtitle && (
                    <p className="text-[10px] sm:text-xs text-zinc-300 line-clamp-1 mt-0.5 drop-shadow">
                      {b.subtitle}
                    </p>
                  )}
                  {b.buttonText && (
                    <div className="mt-2">
                      <span className="inline-block text-[9px] font-bold px-2 py-1 bg-amber-400 text-black rounded-md font-mono">
                        {b.buttonText} →
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Change Image Floating Badge */}
                <button
                  type="button"
                  onClick={() => setQuickImageBanner(b)}
                  className="absolute top-3 right-3 bg-black/75 hover:bg-amber-400 hover:text-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                  title="Trocar imagem do banner"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Trocar Foto</span>
                </button>
              </div>

              {/* Card Controls */}
              <div className="p-4 flex items-center justify-between border-t border-zinc-800 text-xs bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-mono text-[11px]">Ordem: <strong className="text-white">{b.order}</strong></span>
                  {b.isActive ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Ativo
                    </span>
                  ) : (
                    <span className="text-zinc-500 flex items-center gap-1 text-[11px] bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                      <XCircle className="w-3 h-3" /> Inativo
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Editar Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setBannerToDelete(b)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Excluir Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Excluir Banner?
              </h3>
              <p className="text-xs text-zinc-400">
                Tem certeza que deseja remover o banner <strong className="text-white">"{bannerToDelete.title}"</strong> do carrossel principal?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Image Picker Modal (Direct from card) */}
      {quickImageBanner && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-black text-white font-['Outfit']">
                  Trocar Imagem do Banner
                </h3>
                <p className="text-xs text-zinc-400">
                  Banner: <strong className="text-amber-400">{quickImageBanner.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setQuickImageBanner(null)}
                className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Upload direct */}
              <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer bg-zinc-950 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImageFile(e.target.files, quickImageBanner.id)}
                  className="hidden"
                />
                {isCompressing ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                ) : (
                  <Upload className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-xs font-bold text-white">
                  {isCompressing ? 'Otimizando foto...' : 'Fazer Upload de Foto do Computador / Celular'}
                </span>
              </label>

              {/* Product gallery images */}
              {catalogProductImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fotos dos Produtos da Loja ({catalogProductImages.length})</span>
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {catalogProductImages.slice(0, 16).map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectImageForQuickBanner(img.url)}
                        className={`group relative aspect-[16/9] rounded-xl overflow-hidden border bg-zinc-950 p-1 hover:border-amber-400 transition-all cursor-pointer ${
                          quickImageBanner.image === img.url ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-zinc-800'
                        }`}
                      >
                        <img src={img.url} alt={img.productName} className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[10px] font-bold text-amber-400 bg-zinc-900 px-2 py-0.5 rounded">Escolher</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Gallery */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Presets de Banners em Alta Definição</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BANNER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => selectImageForQuickBanner(preset.url)}
                      className={`group relative aspect-[21/9] rounded-xl overflow-hidden border bg-zinc-950 p-0.5 hover:border-amber-400 transition-all cursor-pointer ${
                        quickImageBanner.image === preset.url ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-zinc-800'
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-bold text-zinc-200">
                        {preset.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Create / Edit Banner Modal */}
      {(isCreating || editingBanner) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  {editingBanner ? 'Editar Banner Principal' : 'Criar Novo Banner Principal'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure textos, links e escolha a imagem de fundo através da galeria de produtos ou upload.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingBanner(null);
                  setIsCreating(false);
                }}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              {/* Live Preview on Top */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pré-visualização do Banner em Tempo Real</span>
                </label>
                <div className="relative aspect-[21/9] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                      Nenhuma imagem selecionada
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-5 flex flex-col justify-end">
                    {formData.tag && (
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-black/75 backdrop-blur-sm border border-amber-400/30 px-2.5 py-0.5 rounded-md w-fit mb-1.5">
                        {formData.tag}
                      </span>
                    )}
                    <h3 className="text-base sm:text-xl font-black text-white font-['Outfit'] line-clamp-1">
                      {formData.title || 'Título do Banner'}
                    </h3>
                    {formData.subtitle && (
                      <p className="text-xs sm:text-sm text-zinc-300 line-clamp-1 mt-0.5">
                        {formData.subtitle}
                      </p>
                    )}
                    {formData.buttonText && (
                      <div className="mt-2">
                        <span className="inline-block text-[10px] font-extrabold px-3 py-1.5 bg-amber-400 text-black rounded-lg uppercase tracking-wider font-mono">
                          {formData.buttonText} →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Selection Section with Tabs */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Escolher Imagem do Banner
                    </span>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setImageSourceTab('products')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageSourceTab === 'products'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Galeria de Produtos ({catalogProductImages.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageSourceTab('upload')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageSourceTab === 'upload'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload de Foto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageSourceTab('presets')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageSourceTab === 'presets'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Presets HD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageSourceTab('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageSourceTab === 'url'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Link URL</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: Products Gallery */}
                {imageSourceTab === 'products' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Buscar por produto ou SKU..."
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <span className="text-[11px] text-zinc-500 shrink-0">
                        {filteredCatalogImages.length} foto(s) encontradas
                      </span>
                    </div>

                    {filteredCatalogImages.length === 0 ? (
                      <div className="py-6 text-center text-zinc-500 text-xs">
                        Nenhuma imagem de produto encontrada. Cadastre fotos nos produtos ou use o botão de Upload.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                        {filteredCatalogImages.map((item, idx) => {
                          const isSelected = formData.image === item.url;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectImageForForm(item.url)}
                              className={`group relative aspect-[16/9] rounded-xl overflow-hidden border bg-zinc-900 p-1 text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-400/5'
                                  : 'border-zinc-800 hover:border-zinc-600'
                              }`}
                            >
                              <img
                                src={item.url}
                                alt={item.productName}
                                className="w-full h-full object-cover rounded-lg"
                              />

                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 bg-amber-400 text-black p-1 rounded-full shadow">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}

                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] font-bold text-white truncate">{item.productName}</p>
                                <p className="text-[8px] font-mono text-zinc-400">{item.sku}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Upload File */}
                {imageSourceTab === 'upload' && (
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/50 group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImageFile(e.target.files)}
                        className="hidden"
                      />
                      {isCompressing ? (
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Comprimindo e otimizando imagem em alta resolução...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors mb-2" />
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 text-center">
                            Clique ou arraste a imagem do banner aqui
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1">
                            Recomendado proporção panorâmica (16:9 ou 21:9) em alta resolução. Compressão automática inteligente.
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {/* TAB 3: Presets HD */}
                {imageSourceTab === 'presets' && (
                  <div className="space-y-3">
                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {presetCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setPresetCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            presetCategoryFilter === cat
                              ? 'bg-amber-400 text-black'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {filteredPresets.map((preset) => {
                        const isSelected = formData.image === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => selectImageForForm(preset.url)}
                            className={`group relative aspect-[21/9] rounded-xl overflow-hidden border bg-zinc-900 p-0.5 text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-400/5'
                                : 'border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-full h-full object-cover rounded-lg"
                            />

                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-amber-400 text-black p-1 rounded-full shadow">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
                              <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block">
                                {preset.tag}
                              </span>
                              <p className="text-[10px] font-bold text-white truncate">{preset.title}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 4: Direct URL */}
                {imageSourceTab === 'url' && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={manualUrlInput}
                        onChange={(e) => setManualUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!manualUrlInput.trim()) return;
                        selectImageForForm(manualUrlInput.trim());
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Aplicar URL
                    </button>
                  </div>
                )}
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tag / Selo Superior (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="Ex: OFERTA EXCLUSIVA ou LANÇAMENTO"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Título Principal do Banner *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: NOVA LINHA SAT TITAN 5G"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Subtítulo / Descrição Curta
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Alta performance, acabamento premium e entrega expressa."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Texto do Botão de Ação
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Ex: Ver Ofertas"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Link do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="Ex: #catalogo ou #ofertas"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status and Order */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Exibir no Carrossel Principal da Loja</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-semibold">Ordem de exibição:</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white text-center font-bold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
                >
                  {editingBanner ? 'Salvar Alterações' : 'Criar Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
