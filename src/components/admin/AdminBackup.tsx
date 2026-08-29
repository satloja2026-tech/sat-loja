import React, { useState } from 'react';
import {
  Download,
  Upload,
  FileArchive,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Product, StoreSettings } from '../../types';
import { db } from '../../services/db';
import { ZipService } from '../../services/zipService';

interface AdminBackupProps {
  products: Product[];
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminBackup: React.FC<AdminBackupProps> = ({ products, settings, onRefresh }) => {
  const [exportingZip, setExportingZip] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExportZip = async () => {
    setExportingZip(true);
    try {
      await ZipService.exportProductsToZip(products, `sat_loja_produtos_${Date.now()}.zip`);
      setSuccessMsg('Download do arquivo ZIP com todos os produtos e fotos concluído!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Erro ao gerar arquivo ZIP: ' + err.message);
    } finally {
      setExportingZip(false);
    }
  };

  const handleExportJson = () => {
    const jsonString = db.exportFullBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sat_loja_backup_completo_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('Backup completo em JSON exportado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRestoreJson = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const ok = db.restoreFullBackup(content);
        if (ok) {
          setSuccessMsg('Backup restaurado com sucesso! Loja atualizada.');
          setTimeout(() => setSuccessMsg(''), 4000);
          onRefresh();
        } else {
          setErrorMsg('Arquivo JSON inválido ou incompatível.');
        }
      } catch (err: any) {
        setErrorMsg('Erro ao ler arquivo de backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    db.resetToDefault();
    setShowConfirmReset(false);
    setSuccessMsg('Catálogo e configurações SAT LOJA restaurados aos padrões!');
    setTimeout(() => setSuccessMsg(''), 4000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          Backup, Exportação e Restauração
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Faça cópias de segurança do seu catálogo completo, exporte para ZIP ou restaure dados salvos.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export ZIP Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3">
              <FileArchive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Exportar Produtos (.ZIP)</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Gera um arquivo ZIP com pastas individuais para cada produto contendo <code className="text-amber-400 font-mono">produto.json</code> e todas as suas imagens.
            </p>
          </div>

          <button
            onClick={handleExportZip}
            disabled={exportingZip}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exportingZip ? 'Gerando arquivo ZIP...' : 'Exportar Produtos em ZIP'}</span>
          </button>
        </div>

        {/* Export JSON Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Backup Geral da Loja (.JSON)</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Exporta um único arquivo contendo produtos, categorias, pedidos, banners e todas as preferências visuais da SAT LOJA.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-blue-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-zinc-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup Completo (JSON)</span>
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Restaurar Backup (.JSON)</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Carregue um arquivo JSON gerado anteriormente para restabelecer os dados e configurações da sua loja virtual.
            </p>
          </div>

          <label className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-emerald-500/40 transition-all cursor-pointer">
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => handleRestoreJson(e.target.files)}
              className="hidden"
            />
            <Upload className="w-4 h-4" />
            <span>Importar Arquivo JSON</span>
          </label>
        </div>

        {/* Reset Defaults Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Restaurar Padrões de Fábrica</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Restaura a loja virtual para a coleção inicial de demonstração com produtos de exemplo.
            </p>
          </div>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider border border-rose-500/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Catálogo Padrão</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Restaurar Padrões de Fábrica?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tem certeza de que deseja restaurar as configurações e catálogo padrão? Todos os dados customizados serão substituídos pelo catálogo inicial.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Sim, Restaurar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
