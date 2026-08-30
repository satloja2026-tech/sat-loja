import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  XCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Flame,
  X,
  PlusCircle,
  Tag,
  Layers,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { db } from '../../services/db';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
  onViewProductOnSite: (product: Product) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onRefresh,
  onViewProductOnSite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    category: string;
    customCategory: string;
    price: string;
    promotionalPrice: string;
    isOffer: boolean;
    stock: string;
    description: string;
    detailedDescription: string;
    isActive: boolean;
    isFeatured: boolean;
    tags: string;
    mainImage: string;
    gallery: string[];
    specs: { [key: string]: string };
  }>({
    name: '',
    sku: '',
    category: categories[0]?.name || 'Eletrônicos',
    customCategory: '',
    price: '199,90',
    promotionalPrice: '',
    isOffer: false,
    stock: '10',
    description: '',
    detailedDescription: '',
    isActive: true,
    isFeatured: false,
    tags: '',
    mainImage: '',
    gallery: [],
    specs: {},
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isCompressingImages, setIsCompressingImages] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const s = searchTerm.trim().toLowerCase();
    const matchesSearch =
      s === '' ||
      (p.name || '').toLowerCase().includes(s) ||
      (p.sku || '').toLowerCase().includes(s) ||
      (p.category || '').toLowerCase().includes(s) ||
      (Array.isArray(p.tags) && p.tags.some((t) => t && t.toLowerCase().includes(s)));
    const matchesCat = selectedCatFilter === '' || (p.category || '').toLowerCase().trim() === selectedCatFilter.toLowerCase().trim();
    return matchesSearch && matchesCat;
  });

  const generateRandomSku = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `SAT-${randomNum}`;
  };

  const openCreateModal = () => {
    setFormError(null);
    setImageUrlInput('');
    const defaultImg = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop';
    setFormData({
      name: '',
      sku: generateRandomSku(),
      category: categories[0]?.name || 'Eletrônicos',
      customCategory: '',
      price: '199.90',
      promotionalPrice: '',
      isOffer: false,
      stock: '15',
      description: '',
      detailedDescription: '',
      isActive: true,
      isFeatured: false,
      tags: 'eletronicos, lancamento, sat loja',
      mainImage: defaultImg,
      gallery: [defaultImg],
      specs: {},
    });
    setEditingProduct(null);
    setIsCreatingNew(true);
  };

  const openEditModal = (product: Product) => {
    setFormError(null);
    setImageUrlInput('');
    setFormData({
      name: product.name || '',
      sku: product.sku || generateRandomSku(),
      category: product.category || (categories[0]?.name || 'Eletrônicos'),
      customCategory: '',
      price: product.price !== undefined ? String(product.price).replace('.', ',') : '0,00',
      promotionalPrice: product.promotionalPrice !== undefined && product.promotionalPrice > 0
        ? String(product.promotionalPrice).replace('.', ',')
        : '',
      isOffer: Boolean(product.isOffer),
      stock: String(product.stock ?? 10),
      description: product.description || '',
      detailedDescription: product.detailedDescription || '',
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags ? String(product.tags) : ''),
      mainImage: product.mainImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop',
      gallery: Array.isArray(product.gallery) && product.gallery.length > 0
        ? product.gallery
        : [product.mainImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'],
      specs: product.specs && typeof product.specs === 'object' ? product.specs : {},
    });
    setEditingProduct(product);
    setIsCreatingNew(false);
  };

  const handleDuplicate = (product: Product) => {
    try {
      db.addProduct({
        ...product,
        name: `${product.name} (Cópia)`,
        sku: `${product.sku}-COP`,
      });
      showToast(`Produto "${product.name}" duplicado com sucesso!`);
      onRefresh();
    } catch (err) {
      showToast('Erro ao duplicar produto', 'error');
    }
  };

  const handleDelete = (id: string) => {
    try {
      db.deleteProduct(id);
      setDeleteConfirmId(null);
      showToast('Produto excluído com sucesso!');
      onRefresh();
    } catch (err) {
      showToast('Erro ao excluir produto', 'error');
    }
  };

  const handleToggleStatus = (product: Product) => {
    try {
      const nextStatus = !product.isActive;
      db.updateProduct(product.id, { isActive: nextStatus });
      showToast(`Produto marcado como ${nextStatus ? 'Ativo' : 'Inativo'}`);
      onRefresh();
    } catch (err) {
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const handleToggleFeatured = (product: Product) => {
    try {
      const nextFeatured = !product.isFeatured;
      db.updateProduct(product.id, { isFeatured: nextFeatured });
      showToast(`Produto ${nextFeatured ? 'destacado' : 'removido dos destaques'}`);
      onRefresh();
    } catch (err) {
      showToast('Erro ao atualizar destaque', 'error');
    }
  };

  // Image Upload handler with client-side compression
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsCompressingImages(true);
    try {
      const compressedUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file, 800, 800, 0.82);
        compressedUrls.push(compressed);
      }

      if (compressedUrls.length > 0) {
        setFormData((prev) => {
          const newGallery = [...prev.gallery, ...compressedUrls];
          return {
            ...prev,
            gallery: newGallery,
            mainImage: prev.mainImage && prev.gallery.includes(prev.mainImage) ? prev.mainImage : compressedUrls[0],
          };
        });
        showToast(`${compressedUrls.length} foto(s) otimizada(s) e adicionada(s)!`);
      }
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      showToast('Falha ao processar arquivo de imagem.', 'error');
    } finally {
      setIsCompressingImages(false);
    }
  };

  // Direct Image URL add handler
  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      showToast('Insira uma URL de imagem válida (http:// ou https://)', 'error');
      return;
    }

    setFormData((prev) => {
      const newGallery = [...prev.gallery, trimmed];
      return {
        ...prev,
        gallery: newGallery,
        mainImage: prev.mainImage ? prev.mainImage : trimmed,
      };
    });
    setImageUrlInput('');
    showToast('Imagem adicionada com sucesso!');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const newGallery = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      const newMain = newGallery.includes(prev.mainImage)
        ? prev.mainImage
        : (newGallery[0] || '');
      return {
        ...prev,
        gallery: newGallery,
        mainImage: newMain,
      };
    });
  };

  const handleSetMainImage = (imgUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: imgUrl,
    }));
    showToast('Foto definida como capa principal');
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [specKey.trim()]: specValue.trim() },
    }));
    setSpecKey('');
    setSpecValue('');
  };

  const handleRemoveSpec = (key: string) => {
    setFormData((prev) => {
      const updated = { ...prev.specs };
      delete updated[key];
      return { ...prev, specs: updated };
    });
  };

  const parseNumberValue = (value: string | number | undefined): number => {
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (!value || typeof value !== 'string') return 0;
    const cleaned = value.trim().replace(/\s/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      setFormError('Por favor, informe o nome do produto.');
      return;
    }

    const skuTrimmed = formData.sku.trim() || generateRandomSku();
    const finalCategory = formData.category === '__custom__'
      ? (formData.customCategory.trim() || 'Eletrônicos')
      : (formData.category.trim() || 'Eletrônicos');

    const parsedPrice = parseNumberValue(formData.price);
    if (parsedPrice <= 0) {
      setFormError('Informe um preço normal válido maior que zero (ex: 199.90).');
      return;
    }

    const parsedPromoPrice = formData.promotionalPrice.trim()
      ? parseNumberValue(formData.promotionalPrice)
      : undefined;

    if (parsedPromoPrice !== undefined && parsedPromoPrice >= parsedPrice) {
      setFormError('O preço promocional deve ser menor do que o preço normal.');
      return;
    }

    const parsedStock = parseInt(formData.stock.toString().replace(/\D/g, ''), 10);
    const finalStock = isNaN(parsedStock) || !formData.stock.toString().trim() ? 15 : parsedStock;

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const defaultImg = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop';
    const mainImg = formData.mainImage || formData.gallery[0] || defaultImg;
    const galleryImgs = formData.gallery.length > 0 ? formData.gallery : [mainImg];

    const isOfferActive = Boolean(formData.isOffer || (parsedPromoPrice !== undefined && parsedPromoPrice > 0));

    try {
      if (editingProduct) {
        db.updateProduct(editingProduct.id, {
          name: nameTrimmed,
          sku: skuTrimmed,
          category: finalCategory,
          price: parsedPrice,
          promotionalPrice: parsedPromoPrice,
          isOffer: isOfferActive,
          stock: finalStock,
          description: formData.description.trim(),
          detailedDescription: formData.detailedDescription.trim() || formData.description.trim(),
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          tags: tagsArray.length > 0 ? tagsArray : ['satloja'],
          mainImage: mainImg,
          gallery: galleryImgs,
          specs: formData.specs,
        });
        showToast('Produto atualizado com sucesso!');
      } else {
        db.addProduct({
          name: nameTrimmed,
          sku: skuTrimmed,
          category: finalCategory,
          price: parsedPrice,
          promotionalPrice: parsedPromoPrice,
          isOffer: isOfferActive,
          stock: finalStock,
          description: formData.description.trim(),
          detailedDescription: formData.detailedDescription.trim() || formData.description.trim(),
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          tags: tagsArray.length > 0 ? tagsArray : ['satloja'],
          mainImage: mainImg,
          gallery: galleryImgs,
          specs: formData.specs,
        });
        showToast('Produto cadastrado com sucesso!');
      }

      setEditingProduct(null);
      setIsCreatingNew(false);
      onRefresh();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setFormError('Ocorreu um erro ao salvar o produto no armazenamento. Tente novamente.');
    }
  };

  // Calculate discount percentage helper for preview
  const numPrice = parseNumberValue(formData.price);
  const numPromo = parseNumberValue(formData.promotionalPrice);
  const discountPercent = numPrice > 0 && numPromo > 0 && numPromo < numPrice
    ? Math.round(((numPrice - numPromo) / numPrice) * 100)
    : null;

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
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
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Gerenciamento de Produtos
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cadastre, edite fotos, gerencie preços e controle o estoque dos itens da SAT LOJA.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Produto</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, SKU, categoria..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-xs text-zinc-500 shrink-0">
            Total: <strong className="text-white">{filteredProducts.length}</strong>
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Imagem</th>
                <th className="py-3 px-4">Produto & SKU</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço</th>
                <th className="py-3 px-4">Estoque</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Destaque</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <p className="text-sm font-semibold">Nenhum produto encontrado</p>
                    <p className="text-xs mt-1">Clique no botão "Cadastrar Produto" acima para adicionar o primeiro item.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const regularPrice = typeof p.price === 'number' ? p.price : 0;
                  const promoPrice = typeof p.promotionalPrice === 'number' ? p.promotionalPrice : null;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <img
                          src={p.mainImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-contain bg-zinc-950 border border-zinc-800 p-1"
                        />
                      </td>

                      {/* Name & SKU */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white line-clamp-1">{p.name}</div>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <span>SKU: {p.sku}</span>
                          {p.isOffer && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 text-[9px] font-bold">
                              OFERTA
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-medium">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        {promoPrice ? (
                          <div>
                            <span className="font-bold text-amber-400 block font-['Outfit'] text-sm">
                              R$ {promoPrice.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-[10px] text-zinc-400 line-through">
                              R$ {regularPrice.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-white font-['Outfit'] text-sm">
                            R$ {regularPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock <= 0
                              ? 'text-rose-400'
                              : p.stock <= 3
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {p.stock} un.
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            p.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}
                        >
                          {p.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Ativo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Inativo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            p.isFeatured
                              ? 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                              : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-zinc-400'
                          }`}
                          title={p.isFeatured ? 'Produto em Destaque' : 'Marcar como Destaque'}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewProductOnSite(p)}
                            className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors"
                            title="Ver produto na loja"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-amber-400 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            title="Duplicar produto"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-amber-400 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            title="Editar produto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg bg-zinc-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Excluir este Produto?</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Esta ação removerá o produto permanentemente da sua loja SAT LOJA.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isCreatingNew || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  {editingProduct ? 'Editar Produto SAT LOJA' : 'Cadastrar Novo Produto'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Preencha as informações detalhadas e adicione fotos para exibir na loja.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingNew(false);
                }}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Smartphone SAT Titan Ultra 5G (256GB)"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-300">Código / SKU *</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sku: generateRandomSku() })}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Gerar SKU
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Ex: SAT-TITAN-01"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__custom__">+ Outra Categoria (Personalizada)</option>
                  </select>

                  {formData.category === '__custom__' && (
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      placeholder="Digite o nome da nova categoria"
                      className="w-full mt-2 bg-zinc-950 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Preço Normal (R$) *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 199.90 ou 199,90"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Preço Promocional (R$) <span className="text-zinc-500 font-normal">(Opcional)</span>
                    </label>
                    {discountPercent !== null && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.promotionalPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      const hasPromo = val.trim().length > 0;
                      setFormData({
                        ...formData,
                        promotionalPrice: val,
                        isOffer: hasPromo,
                      });
                    }}
                    placeholder="Deixe em branco se não houver desconto"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Quantidade em Estoque *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="smartphone, 5g, titan, lancamento"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Produto Ativo na Loja</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isOffer}
                    onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Destacar em Ofertas
                  </span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Produto em Destaque
                  </span>
                </label>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição Curta (para os cards) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Resumo em 1-2 frases dos principais diferenciais."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição Detalhada (Página do Produto)</label>
                <textarea
                  rows={4}
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  placeholder="Texto explicativo completo, diferenciais, itens inclusos na caixa, etc."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Image Gallery Upload Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Galeria de Imagens do Produto</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">{formData.gallery.length} foto(s)</span>
                </div>

                {/* Option 1: URL Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="Cole um link de imagem (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-xl text-xs font-bold border border-zinc-700 cursor-pointer"
                  >
                    Adicionar URL
                  </button>
                </div>

                {/* Option 2: Drag & Drop Box with Auto-Compression */}
                <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/60 group">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                    onChange={(e) => handleImageFiles(e.target.files)}
                    className="hidden"
                  />
                  {isCompressingImages ? (
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold py-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Otimizando imagens para alta performance...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-zinc-500 group-hover:text-amber-400 transition-colors mb-1.5" />
                      <p className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 text-center">
                        Clique ou arraste e solte fotos do seu computador/celular aqui
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Otimização automática com suporte a múltiplos arquivos simultâneos
                      </p>
                    </>
                  )}
                </label>

                {/* Gallery List Preview */}
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                    {formData.gallery.map((imgUrl, idx) => {
                      const isMain = formData.mainImage === imgUrl;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden bg-zinc-950 border p-1 group aspect-square flex items-center justify-center ${
                            isMain ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-zinc-800'
                          }`}
                        >
                          <img src={imgUrl} alt={`Foto ${idx}`} className="w-full h-full object-contain" />

                          {isMain && (
                            <span className="absolute top-1 left-1 bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                              Capa
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(imgUrl)}
                                className="text-[10px] font-bold text-amber-400 hover:underline bg-zinc-900 px-2 py-0.5 rounded cursor-pointer"
                              >
                                Definir Capa
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-[10px] font-bold text-rose-400 hover:underline bg-zinc-900 px-2 py-0.5 rounded cursor-pointer"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider block">
                  Ficha Técnica / Especificações
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Especificação (ex: Bateria)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    placeholder="Valor (ex: 5000 mAh)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-zinc-700 cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>

                {Object.keys(formData.specs).length > 0 && (
                  <div className="divide-y divide-zinc-800 rounded-xl bg-zinc-950 p-2 text-xs">
                    {Object.entries(formData.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-1.5 px-2">
                        <span className="text-zinc-400 font-medium">{k}:</span>
                        <span className="text-zinc-200 font-semibold">{v}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(k)}
                          className="text-rose-400 hover:text-rose-300 ml-2 cursor-pointer font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
