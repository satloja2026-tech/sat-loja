import React, { useState } from 'react';
import {
  FileArchive,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ZipService, ZipImportResult } from '../../services/zipService';
import { db } from '../../services/db';
import { Product } from '../../types';

interface AdminZipImporterProps {
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminZipImporter: React.FC<AdminZipImporterProps> = ({ onRefresh, onNavigateTab }) => {
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<ZipImportResult | null>(null);
  const [mode, setMode] = useState<'append' | 'overwrite'>('append');
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleZipFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith('.zip')) {
      setErrorMessage('Por favor, selecione um arquivo válido no formato .ZIP');
      return;
    }

    setLoading(true);
    setImportResult(null);
    setSuccessCount(null);
    setErrorMessage(null);

    try {
      const result = await ZipService.parseProductZip(file);
      setImportResult(result);
    } catch (err: any) {
      setErrorMessage(`Erro ao ler arquivo ZIP: ${err?.message || 'Arquivo corrompido ou inválido.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!importResult || importResult.products.length === 0) return;

    if (mode === 'overwrite') {
      // Clear existing and replace
      const currentProducts = db.getProducts();
      currentProducts.forEach((p) => db.deleteProduct(p.id));
    }

    // Add imported products
    let count = 0;
    importResult.products.forEach((p) => {
      // Ensure category exists
      const categories = db.getCategories();
      if (!categories.some((c) => c.name.toLowerCase() === p.category.toLowerCase())) {
        db.addCategory({
          name: p.category,
          slug: p.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          image: p.mainImage,
          description: `Produtos do departamento ${p.category}`,
          isActive: true,
          order: categories.length + 1,
        });
      }

      db.addProduct(p);
      count++;
    });

    setSuccessCount(count);
    setImportResult(null);
    onRefresh();
  };

  const handleDownloadSampleZip = async () => {
    const sampleProducts: Product[] = [
      {
        id: 'sample-001',
        name: 'Smartphone SAT Titan Ultra 5G',
        sku: 'SAT-TITAN-01',
        category: 'Smartphones',
        price: 3499.9,
        promotionalPrice: 2999.9,
        isOffer: true,
        stock: 15,
        description: 'Processador Octa-Core, tela AMOLED 120Hz e câmera quádrupla 108MP.',
        detailedDescription: 'Dispositivo topo de linha construído com acabamento em titânio e alumínio aeroespacial.',
        isActive: true,
        isFeatured: true,
        tags: ['smartphone', '5g', 'titan', 'lancamento'],
        mainImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop',
        gallery: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'],
        specs: { Bateria: '5000 mAh', Armazenamento: '256GB', 'Tela': '6.8 polegadas' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await ZipService.exportProductsToZip(sampleProducts, 'sat_loja_exemplo_estrutura.zip');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Importar Produtos em Lote via Arquivo ZIP
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Faça o upload de um arquivo ZIP contendo pastas com fotos e os dados de cada produto em formato JSON.
        </p>
      </div>

      {/* Instructions & Sample Download */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileArchive className="w-4 h-4 text-amber-400" />
              <span>Como estruturar seu arquivo ZIP</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              O sistema detecta automaticamente pastas como <code className="text-amber-400 font-mono">/produtos/produto-01/produto.json</code> ou arquivos JSON na raiz.
            </p>
          </div>

          <button
            onClick={handleDownloadSampleZip}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-bold px-4 py-2 rounded-xl border border-zinc-700 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Baixar ZIP de Exemplo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="font-bold text-amber-400 block mb-1">1. Pastas do Produto</span>
            <p className="text-[11px] text-zinc-400">
              Crie uma pasta para cada produto (ex: <code className="font-mono text-zinc-300">produto-001</code>).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="font-bold text-amber-400 block mb-1">2. Arquivo produto.json</span>
            <p className="text-[11px] text-zinc-400">
              Inclua nome, SKU, preço, categoria e descrição no arquivo JSON interno.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="font-bold text-amber-400 block mb-1">3. Imagens Locais</span>
            <p className="text-[11px] text-zinc-400">
              Coloque as imagens (<code className="font-mono text-zinc-300">foto1.jpg</code>) dentro da pasta.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white text-xs underline font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <label className="border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/60 group">
          <input
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={(e) => handleZipFile(e.target.files)}
            className="hidden"
          />
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
              <p className="text-xs font-bold text-white">Descompactando e lendo produtos do ZIP...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-zinc-500 group-hover:text-amber-400 transition-colors mb-3" />
              <p className="text-sm font-bold text-zinc-200 group-hover:text-amber-400">
                Selecione ou solte o arquivo ZIP de produtos aqui
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Leitura instantânea de imagens e dados via JSZip sem necessidade de servidor
              </p>
            </>
          )}
        </label>
      </div>

      {/* Success Notification */}
      {successCount !== null && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Sucesso! <strong>{successCount}</strong> produto(s) foram importados e já estão disponíveis no catálogo.</span>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-500"
          >
            Ver Produtos
          </button>
        </div>
      )}

      {/* Validation & Preview Report */}
      {importResult && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Relatório de Validação do ZIP</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Foram identificados <strong>{importResult.products.length}</strong> produtos e <strong>{importResult.totalImagesFound}</strong> imagens.
              </p>
            </div>

            {/* Import Mode: Append or Overwrite */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">Modo:</span>
              <button
                onClick={() => setMode('append')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  mode === 'append' ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Adicionar aos existentes
              </button>
              <button
                onClick={() => setMode('overwrite')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  mode === 'overwrite' ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Substituir catálogo
              </button>
            </div>
          </div>

          {/* Warnings list if any */}
          {importResult.warnings.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Avisos encontrados durante a leitura:</span>
              </div>
              <ul className="list-disc pl-5 text-[11px] text-zinc-300 space-y-0.5">
                {importResult.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Products Preview List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Produtos Prontos para Importação ({importResult.products.length})
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {importResult.products.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-contain bg-zinc-900 border border-zinc-800 p-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white truncate">{p.name}</h5>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span>SKU: <strong className="font-mono text-zinc-300">{p.sku}</strong></span>
                      <span>Cat: <strong className="text-amber-400">{p.category}</strong></span>
                      <span>Fotos: <strong>{p.gallery?.length || 1}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-amber-400 block font-['Outfit']">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-zinc-500">Estoque: {p.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={() => setImportResult(null)}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar e Importar {importResult.products.length} Produtos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
