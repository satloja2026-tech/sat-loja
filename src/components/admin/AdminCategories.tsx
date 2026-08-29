import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  CheckCircle2,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Link as LinkIcon,
  Check,
  Smartphone,
  Headphones,
  Watch,
  Zap,
  Gamepad2,
  Grid,
  Laptop,
  Tv,
  Speaker,
  Shield,
  Tag,
  Cpu,
  ShoppingBag,
  Search,
  AlertTriangle,
  PackageX,
  ArrowRight,
  ExternalLink,
  MoveRight,
} from 'lucide-react';
import { Category, Product } from '../../types';
import { db } from '../../services/db';

interface AdminCategoriesProps {
  categories: Category[];
  products?: Product[];
  onRefresh: () => void;
}

// Curated high quality presets for tech & gadget categories
const TECH_CATEGORY_PRESETS: { name: string; tag: string; url: string }[] = [
  {
    name: 'Smartphones Premium',
    tag: 'Celulares',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'iPhone Pro & Flagships',
    tag: 'Celulares',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Fones TWS & AirPods',
    tag: 'Áudio',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Headphones Over-Ear',
    tag: 'Áudio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Smartwatches & Ultra',
    tag: 'Wearables',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Pulseiras & Smartbands',
    tag: 'Wearables',
    url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Carregadores & Powerbanks',
    tag: 'Energia',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Cabos Turbo & Magsafe',
    tag: 'Energia',
    url: 'https://images.unsplash.com/photo-1618410320928-25228d811631?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Controles Gamer & PS5',
    tag: 'Gamer',
    url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Setup Gamer & RGB',
    tag: 'Gamer',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'MacBooks & Notebooks',
    tag: 'Computadores',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Tablets & iPads',
    tag: 'Computadores',
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Caixas de Som Bluetooth',
    tag: 'Som',
    url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Drones & Câmeras 4K',
    tag: 'Fotografia',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Capinhas & Proteção',
    tag: 'Acessórios',
    url: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Smart Home & Automação',
    tag: 'Casa Inteligente',
    url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=800&auto=format&fit=crop',
  },
];

const AVAILABLE_ICONS = [
  { id: 'Smartphone', label: 'Smartphone / Celular', icon: Smartphone },
  { id: 'Headphones', label: 'Fones / Áudio TWS', icon: Headphones },
  { id: 'Watch', label: 'Smartwatch / Relógio', icon: Watch },
  { id: 'Zap', label: 'Carregadores / Energia', icon: Zap },
  { id: 'Gamepad2', label: 'Gamer / Consoles', icon: Gamepad2 },
  { id: 'Laptop', label: 'Notebooks / PCs', icon: Laptop },
  { id: 'Speaker', label: 'Caixas de Som / Áudio', icon: Speaker },
  { id: 'Tv', label: 'Telas / Smart TVs', icon: Tv },
  { id: 'Camera', label: 'Câmeras / Drones', icon: Camera },
  { id: 'Cpu', label: 'Componentes / Hardware', icon: Cpu },
  { id: 'Shield', label: 'Capinhas / Películas', icon: Shield },
  { id: 'Tag', label: 'Promoções / Ofertas', icon: Tag },
  { id: 'Grid', label: 'Geral / Outros', icon: Grid },
];

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  products = [],
  onRefresh,
}) => {
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [imageModalCat, setImageModalCat] = useState<Category | null>(null);
  const [productsModalCat, setProductsModalCat] = useState<Category | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [activeImageTab, setActiveImageTab] = useState<'upload' | 'preset' | 'products' | 'url'>('upload');
  const [presetTagFilter, setPresetTagFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);
  const [quickUploadCatId, setQuickUploadCatId] = useState<string | null>(null);

  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);
  const [confirmAllCategoryDelete, setConfirmAllCategoryDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    icon: 'Smartphone',
    description: '',
    isActive: true,
    order: 1,
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      image: TECH_CATEGORY_PRESETS[0].url,
      icon: 'Smartphone',
      description: '',
      isActive: true,
      order: categories.length + 1,
    });
    setEditingCat(null);
    setIsCreating(true);
    setActiveImageTab('upload');
  };

  const openEditModal = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      icon: cat.icon || 'Smartphone',
      description: cat.description,
      isActive: cat.isActive,
      order: cat.order,
    });
    setEditingCat(cat);
    setIsCreating(false);
    setActiveImageTab('upload');
  };

  const openProductsModal = (cat: Category) => {
    setProductsModalCat(cat);
    setSelectedProductIds([]);
    setProductSearchTerm('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (editingCat) {
      db.updateCategory(editingCat.id, {
        ...formData,
        slug,
      });
      showNotification(`Categoria "${formData.name}" atualizada com sucesso!`);
    } else {
      db.addCategory({
        ...formData,
        slug,
      });
      showNotification(`Nova categoria "${formData.name}" cadastrada com sucesso!`);
    }

    setEditingCat(null);
    setIsCreating(false);
    onRefresh();
  };

  // Upload handler for form
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      showNotification('Aviso: Selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, image: result }));
        showNotification('Foto da galeria carregada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick direct upload for a specific category card
  const handleQuickUpload = (catId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      showNotification('Aviso: Selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        db.updateCategory(catId, { image: result });
        onRefresh();
        showNotification('Imagem da categoria atualizada diretamente da galeria!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply selected image to Quick Image Modal
  const handleApplyImageToCategory = (imageUrl: string) => {
    if (!imageModalCat) return;
    db.updateCategory(imageModalCat.id, { image: imageUrl });
    setImageModalCat(null);
    onRefresh();
    showNotification(`Imagem de "${imageModalCat.name}" atualizada com sucesso!`);
  };

  // Get products of a category
  const getCategoryProducts = (catName: string) => {
    const target = catName.toLowerCase().trim();
    return products.filter((p) => p.category.toLowerCase().trim() === target);
  };

  // Delete single product
  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const pName = productToDelete.name;
    db.deleteProduct(productToDelete.id);
    setProductToDelete(null);
    setSelectedProductIds((prev) => prev.filter((id) => id !== productToDelete.id));
    onRefresh();
    showNotification(`Produto "${pName}" excluído com sucesso!`);
  };

  // Delete multiple selected products
  const handleConfirmBatchDelete = () => {
    if (selectedProductIds.length === 0) return;
    const count = db.deleteMultipleProducts(selectedProductIds);
    setSelectedProductIds([]);
    setConfirmBatchDelete(false);
    onRefresh();
    showNotification(`${count} produto(s) excluído(s) com sucesso!`);
  };

  // Delete ALL products of a category
  const handleConfirmDeleteAllCategoryProducts = () => {
    if (!confirmAllCategoryDelete) return;
    const catName = confirmAllCategoryDelete;
    const deleted = db.deleteProductsByCategory(catName);
    setSelectedProductIds([]);
    setConfirmAllCategoryDelete(null);
    onRefresh();
    showNotification(`Todos os ${deleted} produtos da categoria "${catName}" foram excluídos!`);
  };

  // Delete multiple selected products trigger
  const handleDeleteSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    setConfirmBatchDelete(true);
  };

  // Delete ALL products of a category trigger
  const handleDeleteAllCategoryProducts = (catName: string) => {
    const count = getCategoryProducts(catName).length;
    if (count === 0) return;
    setConfirmAllCategoryDelete(catName);
  };

  // Category deletion handling
  const handleConfirmDeleteCategory = (deleteWithProducts: boolean) => {
    if (!categoryToDelete) return;
    const catName = categoryToDelete.name;
    const catId = categoryToDelete.id;

    if (deleteWithProducts) {
      const deletedProds = db.deleteProductsByCategory(catName);
      db.deleteCategory(catId);
      showNotification(
        `Categoria "${catName}" e ${deletedProds} produto(s) vinculados foram excluídos com sucesso!`
      );
    } else {
      db.deleteCategory(catId);
      showNotification(`Categoria "${catName}" excluída com sucesso.`);
    }

    setCategoryToDelete(null);
    if (productsModalCat?.id === catId) setProductsModalCat(null);
    onRefresh();
  };

  // Preset unique tags
  const presetTags = ['all', ...Array.from(new Set(TECH_CATEGORY_PRESETS.map((p) => p.tag)))];

  const filteredPresets =
    presetTagFilter === 'all'
      ? TECH_CATEGORY_PRESETS
      : TECH_CATEGORY_PRESETS.filter((p) => p.tag === presetTagFilter);

  // Collect all unique product images
  const allProductImages = Array.from(
    new Set(products.flatMap((p) => [p.mainImage, ...(p.gallery || [])]).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Hidden file input for quick upload from card */}
      <input
        type="file"
        ref={quickFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (quickUploadCatId) {
            handleQuickUpload(quickUploadCatId, e.target.files);
            setQuickUploadCatId(null);
          }
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Gerenciamento de Categorias</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie categorias, adicione imagens da galeria e visualize ou <strong className="text-amber-400">exclua produtos vinculados</strong>.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const catProducts = getCategoryProducts(cat.name);
          const prodCount = catProducts.length;
          const iconObj = AVAILABLE_ICONS.find((i) => i.id === cat.icon) || AVAILABLE_ICONS[0];
          const IconComp = iconObj.icon;

          return (
            <div
              key={cat.id}
              className="group rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-between gap-3 hover:border-amber-400/40 transition-all shadow-md hover:shadow-amber-400/5 relative overflow-hidden"
            >
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

              <div className="flex gap-3.5 items-start">
                {/* Category Image with Quick Upload Overlay */}
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 group/img">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  {/* Hover Quick Change Button */}
                  <button
                    onClick={() => setImageModalCat(cat)}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-1 text-amber-400 text-[10px] font-bold transition-opacity p-1 text-center"
                    title="Trocar imagem da categoria"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Trocar</span>
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="p-1 rounded-lg bg-zinc-800 text-amber-400 shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm font-bold text-white truncate font-['Outfit']">{cat.name}</h4>
                    {cat.isActive ? (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Ativa" />
                    ) : (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-zinc-600" title="Inativa" />
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2">
                    {cat.description || 'Sem descrição cadastrada.'}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    {/* Clickable Product Count Badge */}
                    <button
                      onClick={() => openProductsModal(cat)}
                      className="inline-flex items-center gap-1 bg-zinc-950 hover:bg-amber-400/10 hover:text-amber-400 px-2 py-0.5 rounded-md border border-zinc-800 hover:border-amber-400/30 text-zinc-300 transition-colors group/badge"
                      title="Ver e excluir produtos desta categoria"
                    >
                      <ShoppingBag className="w-3 h-3 text-amber-400" />
                      <span>{prodCount} {prodCount === 1 ? 'produto' : 'produtos'}</span>
                      <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                    </button>
                    <span>Ordem: {cat.order}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 mt-1 gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Button to open Gallery Picker */}
                  <button
                    onClick={() => setImageModalCat(cat)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1.5 rounded-xl border border-amber-400/20 transition-colors"
                    title="Galeria de fotos para a categoria"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Fotos</span>
                  </button>

                  {/* Button to view & delete products of this category */}
                  <button
                    onClick={() => openProductsModal(cat)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1.5 rounded-xl transition-colors"
                    title="Ver e excluir produtos desta categoria"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Produtos ({prodCount})</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors"
                    title="Editar Categoria"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Excluir Categoria"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CATEGORY PRODUCTS MANAGER & DELETION */}
      {productsModalCat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span>Produtos da Categoria:</span>
                    <span className="text-amber-400">{productsModalCat.name}</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Visualize detalhes, gerencie estoque e <strong className="text-rose-400">exclua produtos individualmente ou em lote</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setProductsModalCat(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filter & Batch Actions Bar */}
            <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              {/* Search in this category */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="Buscar produto por nome ou SKU..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Batch Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedProductIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedProducts}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/20 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Selecionados ({selectedProductIds.length})</span>
                  </button>
                )}

                {getCategoryProducts(productsModalCat.name).length > 0 && (
                  <button
                    onClick={() => handleDeleteAllCategoryProducts(productsModalCat.name)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20 transition-all text-xs"
                    title="Excluir todos os produtos desta categoria"
                  >
                    <PackageX className="w-3.5 h-3.5" />
                    <span>Excluir Todos ({getCategoryProducts(productsModalCat.name).length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Products List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const catProducts = getCategoryProducts(productsModalCat.name).filter(
                  (p) =>
                    p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                    p.sku.toLowerCase().includes(productSearchTerm.toLowerCase())
                );

                if (catProducts.length === 0) {
                  return (
                    <div className="py-16 text-center text-zinc-500 space-y-2">
                      <ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-400">
                        {productSearchTerm
                          ? 'Nenhum produto encontrado com este termo.'
                          : 'Nenhum produto vinculado a esta categoria no momento.'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Você pode cadastrar novos produtos na aba "Produtos" associando-os a esta categoria.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {/* Header with Select All */}
                    <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            catProducts.length > 0 &&
                            catProducts.every((p) => selectedProductIds.includes(p.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const allIds = catProducts.map((p) => p.id);
                              setSelectedProductIds(Array.from(new Set([...selectedProductIds, ...allIds])));
                            } else {
                              const removeIds = new Set(catProducts.map((p) => p.id));
                              setSelectedProductIds(selectedProductIds.filter((id) => !removeIds.has(id)));
                            }
                          }}
                          className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>Selecionar Todos ({catProducts.length})</span>
                      </label>

                      <span>Ações</span>
                    </div>

                    {/* Products Rows */}
                    {catProducts.map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      const price = product.promotionalPrice || product.price;

                      return (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-amber-400/5 border-amber-400/30'
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds([...selectedProductIds, product.id]);
                                } else {
                                  setSelectedProductIds(selectedProductIds.filter((id) => id !== product.id));
                                }
                              }}
                              className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer shrink-0"
                            />

                            {/* Image */}
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-zinc-800 p-1 shrink-0"
                            />

                            {/* Info */}
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-0.5">
                                <span>SKU: {product.sku}</span>
                                <span>•</span>
                                <span className={product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                  Estoque: {product.stock} un
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Delete Action */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right font-mono">
                              <span className="text-xs font-bold text-amber-400 block font-['Outfit']">
                                R$ {price.toFixed(2).replace('.', ',')}
                              </span>
                              {product.promotionalPrice && (
                                <span className="text-[10px] text-zinc-500 line-through">
                                  R$ {product.price.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                            </div>

                            {/* Individual Delete Button */}
                            <button
                              onClick={() => setProductToDelete(product)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
                              title="Excluir este produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Excluir</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
              <span className="text-zinc-400">
                Total de produtos nesta categoria:{' '}
                <strong className="text-white">
                  {getCategoryProducts(productsModalCat.name).length}
                </strong>
              </span>

              <button
                onClick={() => setProductsModalCat(null)}
                className="px-5 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE PRODUCT */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Excluir Produto da Loja?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você está prestes a excluir permanentemente o produto:
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3 text-left my-2">
                <img
                  src={productToDelete.mainImage}
                  alt={productToDelete.name}
                  className="w-10 h-10 rounded-lg object-contain bg-zinc-900 p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{productToDelete.name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    SKU: {productToDelete.sku} • Categoria: {productToDelete.category}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-rose-400/80 font-medium">
                Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: BATCH DELETE */}
      {confirmBatchDelete && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Excluir {selectedProductIds.length} Produtos Selecionados?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tem certeza que deseja excluir permanentemente os <strong className="text-rose-400">{selectedProductIds.length}</strong> produtos selecionados desta categoria?
              </p>
              <p className="text-[11px] text-rose-400/80 font-medium">
                Esta ação é irreversível.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmBatchDelete(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir {selectedProductIds.length} Itens</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE ALL PRODUCTS IN CATEGORY */}
      {confirmAllCategoryDelete && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <PackageX className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Excluir Todos os Produtos da Categoria?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você está prestes a excluir permanentemente todos os <strong className="text-rose-400">{getCategoryProducts(confirmAllCategoryDelete).length} produtos</strong> da categoria <strong className="text-amber-400">"{confirmAllCategoryDelete}"</strong>.
              </p>
              <p className="text-[11px] text-rose-400/80 font-medium">
                Esta ação removerá todos os itens do catálogo da loja.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAllCategoryDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAllCategoryProducts}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Limpar Todos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE CATEGORY (WITH OPTION TO DELETE PRODUCTS) */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Excluir Categoria "{categoryToDelete.name}"?
              </h3>
              {(() => {
                const count = getCategoryProducts(categoryToDelete.name).length;
                return count > 0 ? (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Esta categoria possui <strong className="text-amber-400">{count} produto(s)</strong> vinculados a ela. Escolha como deseja prosseguir:
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Esta categoria não possui produtos vinculados. Deseja removê-la?
                  </p>
                );
              })()}
            </div>

            {getCategoryProducts(categoryToDelete.name).length > 0 ? (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleConfirmDeleteCategory(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all text-xs group"
                >
                  <div>
                    <span className="font-bold text-white block">Excluir apenas a Categoria</span>
                    <span className="text-[10px] text-zinc-400">
                      Os {getCategoryProducts(categoryToDelete.name).length} produtos continuam na loja (sem categoria).
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmDeleteCategory(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-left transition-all text-xs group"
                >
                  <div>
                    <span className="font-bold text-rose-400 block">
                      Excluir Categoria E Todos os {getCategoryProducts(categoryToDelete.name).length} Produtos
                    </span>
                    <span className="text-[10px] text-rose-300/80">
                      Remove tanto a categoria quanto todos os produtos associados a ela.
                    </span>
                  </div>
                  <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-rose-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="w-full py-2.5 text-center text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDeleteCategory(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sim, Excluir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK IMAGE PICKER MODAL */}
      {imageModalCat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span>Galeria de Imagens para</span>
                    <span className="text-amber-400 font-bold">{imageModalCat.name}</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Faça upload da galeria do seu aparelho ou escolha uma foto profissional pronta.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setImageModalCat(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Current Image & Direct Upload Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 items-center">
                <div className="flex flex-col items-center text-center gap-1.5 sm:border-r sm:border-zinc-800 sm:pr-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Imagem Atual
                  </span>
                  <img
                    src={imageModalCat.image}
                    alt={imageModalCat.name}
                    className="w-20 h-20 rounded-xl object-cover border border-amber-400/40 shadow-md"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <span className="text-xs font-bold text-zinc-200 block">
                    Upload Rápido da Galeria do Dispositivo:
                  </span>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-700 hover:border-amber-400 p-4 rounded-xl cursor-pointer bg-zinc-900 hover:bg-zinc-800/80 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleQuickUpload(imageModalCat.id, e.target.files);
                        setImageModalCat(null);
                      }}
                    />
                    <Upload className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                    <span className="text-xs font-bold text-zinc-300 group-hover:text-white">
                      Clique para escolher foto da Galeria / Arquivos
                    </span>
                  </label>
                  <p className="text-[10px] text-zinc-500 text-center">
                    Suporta PNG, JPG, JPEG, WEBP de qualquer resolução.
                  </p>
                </div>
              </div>

              {/* Preset Gallery Selection */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ou selecione uma foto profissional da biblioteca</span>
                  </h4>

                  {/* Filter tags */}
                  <div className="flex flex-wrap gap-1">
                    {presetTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setPresetTagFilter(tag)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-colors ${
                          presetTagFilter === tag
                            ? 'bg-amber-400 text-black font-bold'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tag === 'all' ? 'Todos' : tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                  {filteredPresets.map((preset, idx) => {
                    const isSelected = imageModalCat.image === preset.url;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleApplyImageToCategory(preset.url)}
                        className={`relative rounded-xl overflow-hidden group border transition-all text-left ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/30'
                            : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                          <span className="text-[10px] font-bold text-white truncate drop-shadow">
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product images section if available */}
              {allProductImages.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fotos dos Produtos Cadastrados ({allProductImages.length})</span>
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
                    {allProductImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleApplyImageToCategory(imgUrl)}
                        className="relative rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-400 group h-18 bg-zinc-950 p-1 flex items-center justify-center transition-all"
                      >
                        <img
                          src={imgUrl}
                          alt="Produto"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
              <button
                onClick={() => setImageModalCat(null)}
                className="px-5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FULL CATEGORY MODAL */}
      {(isCreating || editingCat) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    {editingCat ? `Editar Categoria: ${editingCat.name}` : 'Criar Nova Categoria'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Defina o nome, foto de destaque da galeria, ícone e visibilidade.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingCat(null);
                  setIsCreating(false);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Category Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Nome da Categoria *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Smartwatches & Wearables"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Slug / URL Amigável</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="smartwatches-wearables"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-zinc-300 font-mono focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Descrição Curta</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Relógios inteligentes, pulseiras fitness e sensores de saúde."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* IMAGE SELECTION SUITE */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Imagem de Capa da Categoria *</span>
                  </label>
                </div>

                {/* Tabs to choose image method */}
                <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveImageTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      activeImageTab === 'upload'
                        ? 'bg-amber-400 text-black font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Galeria / Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageTab('preset')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      activeImageTab === 'preset'
                        ? 'bg-amber-400 text-black font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Banco Tech</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageTab('products')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      activeImageTab === 'products'
                        ? 'bg-amber-400 text-black font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Produtos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageTab('url')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      activeImageTab === 'url'
                        ? 'bg-amber-400 text-black font-bold shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Link URL</span>
                  </button>
                </div>

                {/* Tab 1: Upload from device / Gallery */}
                {activeImageTab === 'upload' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        handleFileUpload(e.dataTransfer.files);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragOver
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-zinc-700 hover:border-amber-400/70 bg-zinc-950/60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-zinc-200 text-center">
                        Arraste uma foto ou <span className="text-amber-400 underline">clique para escolher da galeria do aparelho</span>
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Formatos aceitos: JPG, PNG, WEBP, GIF
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Curated Tech Presets */}
                {activeImageTab === 'preset' && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 pb-1">
                      {presetTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setPresetTagFilter(tag)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-colors ${
                            presetTagFilter === tag
                              ? 'bg-amber-400 text-black font-bold'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {tag === 'all' ? 'Todos' : tag}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {filteredPresets.map((preset, idx) => {
                        const isSelected = formData.image === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            className={`relative rounded-xl overflow-hidden border transition-all text-left ${
                              isSelected
                                ? 'border-amber-400 ring-2 ring-amber-400/30'
                                : 'border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-20 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                              <span className="text-[9px] font-bold text-white truncate">
                                {preset.name}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: Store Product Images */}
                {activeImageTab === 'products' && (
                  <div className="space-y-2">
                    {allProductImages.length === 0 ? (
                      <div className="p-4 rounded-xl bg-zinc-950 text-center text-zinc-500">
                        Nenhum produto cadastrado na loja ainda.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                        {allProductImages.map((imgUrl, idx) => {
                          const isSelected = formData.image === imgUrl;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: imgUrl })}
                              className={`relative rounded-xl overflow-hidden border p-1 bg-zinc-950 h-16 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                                  : 'border-zinc-800 hover:border-zinc-600'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt="Produto"
                                className="w-full h-full object-contain"
                              />
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Direct URL */}
                {activeImageTab === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
                    />
                  </div>
                )}

                {/* Selected Image Preview */}
                {formData.image && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <img
                      src={formData.image}
                      alt="Pré-visualização da categoria"
                      className="w-14 h-14 rounded-xl object-cover border border-amber-400/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Foto Selecionada</span>
                      </span>
                      <p className="text-[10px] text-zinc-400 truncate font-mono mt-0.5">
                        {formData.image.startsWith('data:') ? 'Imagem carregada da galeria (Base64)' : formData.image}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Icon & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Ícone da Categoria</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer text-xs"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.id} value={ic.id}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Ordem de Exibição na Loja</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2.5 text-zinc-300 cursor-pointer py-1 select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-xs text-zinc-200">
                  Exibir esta categoria ativamente no site e nos filtros
                </span>
              </label>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCat(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all hover:scale-102 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Salvar Categoria</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
