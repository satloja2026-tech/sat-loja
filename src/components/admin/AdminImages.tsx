import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Check, Trash2, Star, Sparkles, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { db } from '../../services/db';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminImagesProps {
  products: Product[];
  onRefresh: () => void;
}

export const AdminImages: React.FC<AdminImagesProps> = ({ products, onRefresh }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || !selectedProduct) return;

    setIsProcessing(true);
    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file, 800, 800, 0.82);
        newImages.push(compressed);
      }

      if (newImages.length > 0) {
        const updatedGallery = [...(selectedProduct.gallery || [selectedProduct.mainImage]), ...newImages];
        db.updateProduct(selectedProduct.id, {
          gallery: updatedGallery,
          mainImage: selectedProduct.mainImage || updatedGallery[0],
        });
        setStatusMessage(`${newImages.length} foto(s) otimizada(s) e adicionada(s) ao produto!`);
        setTimeout(() => setStatusMessage(''), 4000);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Erro ao processar fotos.');
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetCover = (imgUrl: string) => {
    if (!selectedProduct) return;
    db.updateProduct(selectedProduct.id, {
      mainImage: imgUrl,
    });
    setStatusMessage('Capa do produto alterada com sucesso!');
    setTimeout(() => setStatusMessage(''), 3000);
    onRefresh();
  };

  const handleDeleteImage = (imgUrl: string) => {
    if (!selectedProduct) return;
    const currentGallery = selectedProduct.gallery || [selectedProduct.mainImage];
    const newGallery = currentGallery.filter(img => img !== imgUrl);

    if (newGallery.length === 0) {
      setStatusMessage('Aviso: O produto precisa ter pelo menos uma imagem.');
      setTimeout(() => setStatusMessage(''), 3500);
      return;
    }

    db.updateProduct(selectedProduct.id, {
      gallery: newGallery,
      mainImage: selectedProduct.mainImage === imgUrl ? newGallery[0] : selectedProduct.mainImage,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Central de Imagens dos Produtos
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Faça upload em lote de novas fotos, defina fotos de capa e organize a galeria de cada produto.
        </p>
      </div>

      {/* Select product dropdown */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider shrink-0">
          Selecione o Produto:
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (SKU: {p.sku}) — {p.gallery?.length || 1} fotos
            </option>
          ))}
        </select>
      </div>

      {selectedProduct ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white">{selectedProduct.name}</h3>
              <p className="text-xs text-zinc-400">SKU: <span className="font-mono text-amber-400">{selectedProduct.sku}</span> | Categoria: {selectedProduct.category}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
              {(selectedProduct.gallery || [selectedProduct.mainImage]).length} imagens cadastradas
            </span>
          </div>

          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div>
            <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/60 group">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => handleUploadImages(e.target.files)}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-zinc-500 group-hover:text-amber-400 transition-colors mb-2" />
              <p className="text-sm font-bold text-zinc-200 group-hover:text-amber-400">
                Arraste ou clique para adicionar mais fotos a este produto
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Formatos suportados: PNG, JPG, JPEG, WEBP.
              </p>
            </label>
          </div>

          {/* Gallery View */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Galeria Atual
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {(selectedProduct.gallery || [selectedProduct.mainImage]).map((imgUrl, idx) => {
                const isMain = selectedProduct.mainImage === imgUrl;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl overflow-hidden bg-zinc-950 border p-2 aspect-square flex flex-col items-center justify-center group ${
                      isMain ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-zinc-800'
                    }`}
                  >
                    <img src={imgUrl} alt={`Foto ${idx}`} className="w-full h-full object-contain" />

                    {isMain && (
                      <div className="absolute top-2 left-2 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 fill-black" />
                        <span>Capa</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(imgUrl)}
                          className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-3 py-1 rounded-lg transition-colors w-full"
                        >
                          Definir Capa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(imgUrl)}
                        className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-lg transition-colors w-full"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-3xl text-xs">
          Nenhum produto cadastrado para gerenciar imagens.
        </div>
      )}
    </div>
  );
};
