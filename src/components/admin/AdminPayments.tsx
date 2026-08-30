import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  Save,
  Percent,
  Sparkles,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Upload,
  RefreshCw,
  HelpCircle,
  Eye,
  Smartphone,
  Truck,
  Copy,
  Check,
} from 'lucide-react';
import { StoreSettings, PaymentSettings, PaymentMethodKey } from '../../types';
import { db, DEFAULT_PAYMENT_SETTINGS } from '../../services/db';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminPaymentsProps {
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<PaymentSettings>({
    ...DEFAULT_PAYMENT_SETTINGS,
    ...(settings.paymentSettings || {}),
  });

  const [activeSubTab, setActiveSubTab] = useState<'pix' | 'credit_card' | 'debit_card' | 'cash' | 'boleto' | 'payment_link' | 'simulator'>('pix');
  const [testAmount, setTestAmount] = useState<number>(1200.00);
  const [isCompressingQr, setIsCompressingQr] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdate = <K extends keyof PaymentSettings>(field: K, value: PaymentSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      db.updateSettings({
        paymentSettings: formData,
      });
      showToast('Formas de pagamento e regras salvas com sucesso!');
      onRefresh();
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar formas de pagamento.', 'error');
    }
  };

  // Upload QR Code
  const handleUploadQrCode = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      showToast('Selecione uma imagem válida para o QR Code.', 'error');
      return;
    }
    setIsCompressingQr(true);
    try {
      const compressed = await compressImageFile(file, 600, 600, 0.9);
      handleUpdate('pixQrCodeUrl', compressed);
      showToast('QR Code do Pix carregado com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao processar imagem do QR Code.', 'error');
    } finally {
      setIsCompressingQr(false);
    }
  };

  const copyPixKeyToClipboard = async () => {
    if (!formData.pixKey) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formData.pixKey);
      }
    } catch {
      // Fallback for iframe restrictions
    }
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // Simulation calculations
  const pixDiscountValue = (testAmount * (formData.pixDiscountPercent || 0)) / 100;
  const pixFinalAmount = Math.max(0, testAmount - pixDiscountValue);

  // Installment calculations
  const maxInstallments = Math.max(1, formData.creditCardMaxInstallments || 12);
  const interestFree = Math.max(1, Math.min(maxInstallments, formData.creditCardInterestFreeInstallments || 3));
  const interestRateMonthly = (formData.creditCardInterestRate || 1.99) / 100;

  const installmentRows = Array.from({ length: maxInstallments }, (_, idx) => {
    const n = idx + 1;
    const isFree = n <= interestFree;
    let totalWithInterest = testAmount;
    let perInstallment = testAmount / n;

    if (!isFree && interestRateMonthly > 0) {
      // Compound interest formula: M = C * (1 + i)^t
      totalWithInterest = testAmount * Math.pow(1 + interestRateMonthly, n);
      perInstallment = totalWithInterest / n;
    }

    return {
      n,
      isFree,
      perInstallment,
      totalWithInterest,
    };
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-60 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all text-xs font-bold ${
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <span>Editar Formas de Pagamento</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personalize as opções aceitas (Pix, Cartões, Dinheiro, Boleto), chaves de recebimento, descontos e parcelamento.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* Quick Summary Cards / Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {/* Pix */}
        <button
          type="button"
          onClick={() => setActiveSubTab('pix')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeSubTab === 'pix'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <span className={`w-2 h-2 rounded-full ${formData.enablePix ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-white">Pix</div>
            <div className="text-[10px] text-zinc-500">{formData.pixDiscountPercent}% OFF</div>
          </div>
        </button>

        {/* Cartão de Crédito */}
        <button
          type="button"
          onClick={() => setActiveSubTab('credit_card')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeSubTab === 'credit_card'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span className={`w-2 h-2 rounded-full ${formData.enableCreditCard ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-white">C. Crédito</div>
            <div className="text-[10px] text-zinc-500">Até {formData.creditCardMaxInstallments}x</div>
          </div>
        </button>

        {/* Cartão de Débito */}
        <button
          type="button"
          onClick={() => setActiveSubTab('debit_card')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeSubTab === 'debit_card'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className={`w-2 h-2 rounded-full ${formData.enableDebitCard ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-white">C. Débito</div>
            <div className="text-[10px] text-zinc-500">{formData.debitCardMachineOnDelivery ? 'Na entrega' : 'Ativo'}</div>
          </div>
        </button>

        {/* Dinheiro */}
        <button
          type="button"
          onClick={() => setActiveSubTab('cash')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeSubTab === 'cash'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Banknote className="w-5 h-5 text-emerald-400" />
            <span className={`w-2 h-2 rounded-full ${formData.enableCash ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-white">Dinheiro</div>
            <div className="text-[10px] text-zinc-500">{formData.cashDiscountPercent}% OFF</div>
          </div>
        </button>

        {/* Boleto */}
        <button
          type="button"
          onClick={() => setActiveSubTab('boleto')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeSubTab === 'boleto'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className={`w-2 h-2 rounded-full ${formData.enableBoleto ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-white">Boleto</div>
            <div className="text-[10px] text-zinc-500">{formData.enableBoleto ? 'Ativo' : 'Desativado'}</div>
          </div>
        </button>

        {/* Link / Simulador */}
        <button
          type="button"
          onClick={() => setActiveSubTab('simulator')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeSubTab === 'simulator'
              ? 'bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Calculator className="w-5 h-5 text-amber-400" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-white">Simulador</div>
            <div className="text-[10px] text-zinc-500">Testar parcelas</div>
          </div>
        </button>
      </div>

      {/* Main Settings Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===================== TAB: PIX ===================== */}
        {activeSubTab === 'pix' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Configuração do Pix Instantâneo
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Defina sua chave de recebimento, titular e desconto exclusivo à vista.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.enablePix}
                  onChange={(e) => handleUpdate('enablePix', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">
                  {formData.enablePix ? 'Pix Ativado' : 'Pix Desativado'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tipo de Chave Pix</label>
                <select
                  value={formData.pixKeyType}
                  onChange={(e) => handleUpdate('pixKeyType', e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="phone">Telefone / Celular</option>
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">E-mail</option>
                  <option value="random">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Chave Pix Cadastrada *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => handleUpdate('pixKey', e.target.value)}
                    placeholder="Ex: (82) 99999-9999 ou seu@email.com"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-3.5 pr-9 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={copyPixKeyToClipboard}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400 p-1"
                    title="Copiar chave"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Desconto no Pix (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={formData.pixDiscountPercent}
                    onChange={(e) => handleUpdate('pixDiscountPercent', parseFloat(e.target.value) || 0)}
                    placeholder="5"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <Percent className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome do Favorecido / Titular</label>
                <input
                  type="text"
                  value={formData.pixBeneficiary}
                  onChange={(e) => handleUpdate('pixBeneficiary', e.target.value)}
                  placeholder="Ex: SAT LOJA OFICIAL LTDA"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Cidade do Titular</label>
                <input
                  type="text"
                  value={formData.pixCity || ''}
                  onChange={(e) => handleUpdate('pixCity', e.target.value)}
                  placeholder="Ex: Maceió"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* QR Code Upload / Link */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">QR Code Pix (Opcional)</label>
                <label className="border border-zinc-700 hover:border-amber-400 bg-zinc-950 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadQrCode(e.target.files)}
                    className="hidden"
                  />
                  <span className="text-zinc-400 truncate max-w-[140px]">
                    {formData.pixQrCodeUrl ? 'QR Code carregado' : 'Carregar imagem'}
                  </span>
                  {isCompressingQr ? (
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-amber-400" />
                  )}
                </label>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-zinc-300 font-semibold mb-1">Instruções de Pagamento Pix para o Cliente</label>
                <textarea
                  rows={2}
                  value={formData.pixInstructions}
                  onChange={(e) => handleUpdate('pixInstructions', e.target.value)}
                  placeholder="Ex: Envie o comprovante pelo WhatsApp após finalizar o pedido para despacho imediato."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: CARTÃO DE CRÉDITO ===================== */}
        {activeSubTab === 'credit_card' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Cartão de Crédito & Parcelamento
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Configure número de parcelas, parcelas sem juros e taxa mensal para cálculo automático.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.enableCreditCard}
                  onChange={(e) => handleUpdate('enableCreditCard', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">
                  {formData.enableCreditCard ? 'Cartão Ativado' : 'Cartão Desativado'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Máximo de Parcelas Aceitas</label>
                <select
                  value={formData.creditCardMaxInstallments}
                  onChange={(e) => handleUpdate('creditCardMaxInstallments', parseInt(e.target.value) || 12)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer font-bold"
                >
                  <option value={1}>1x (À vista)</option>
                  <option value={2}>Até 2x</option>
                  <option value={3}>Até 3x</option>
                  <option value={4}>Até 4x</option>
                  <option value={6}>Até 6x</option>
                  <option value={10}>Até 10x</option>
                  <option value={12}>Até 12x</option>
                  <option value={18}>Até 18x</option>
                  <option value={24}>Até 24x</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Parcelas Sem Juros (0% taxa)</label>
                <select
                  value={formData.creditCardInterestFreeInstallments}
                  onChange={(e) => handleUpdate('creditCardInterestFreeInstallments', parseInt(e.target.value) || 3)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer font-bold text-emerald-400"
                >
                  <option value={1}>Somente 1x sem juros</option>
                  <option value={2}>Até 2x sem juros</option>
                  <option value={3}>Até 3x sem juros</option>
                  <option value={4}>Até 4x sem juros</option>
                  <option value={6}>Até 6x sem juros</option>
                  <option value={10}>Até 10x sem juros</option>
                  <option value={12}>Até 12x sem juros</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Taxa de Juros ao Mês (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.01"
                    value={formData.creditCardInterestRate}
                    onChange={(e) => handleUpdate('creditCardInterestRate', parseFloat(e.target.value) || 0)}
                    placeholder="1.99"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <Percent className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <input
                    type="checkbox"
                    checked={formData.creditCardMachineOnDelivery}
                    onChange={(e) => handleUpdate('creditCardMachineOnDelivery', e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                  />
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-zinc-200">
                    Levamos a maquininha de cartão no endereço do cliente na entrega
                  </span>
                </label>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-zinc-300 font-semibold mb-1">Instruções de Pagamento com Cartão</label>
                <textarea
                  rows={2}
                  value={formData.creditCardInstructions}
                  onChange={(e) => handleUpdate('creditCardInstructions', e.target.value)}
                  placeholder="Ex: Aceitamos Visa, Mastercard, Elo e Hipercard. Parcelamos em até 12x."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: CARTÃO DE DÉBITO ===================== */}
        {activeSubTab === 'debit_card' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Cartão de Débito
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Aceite pagamentos na entrega via maquininha móvel.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.enableDebitCard}
                  onChange={(e) => handleUpdate('enableDebitCard', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">
                  {formData.enableDebitCard ? 'Débito Ativado' : 'Débito Desativado'}
                </span>
              </label>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.debitCardMachineOnDelivery}
                  onChange={(e) => handleUpdate('debitCardMachineOnDelivery', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <Truck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-zinc-200">
                  Levar maquininha de débito na entrega
                </span>
              </label>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Instruções para Débito</label>
                <textarea
                  rows={2}
                  value={formData.debitCardInstructions}
                  onChange={(e) => handleUpdate('debitCardInstructions', e.target.value)}
                  placeholder="Ex: Aceitamos Visa Débito, Mastercard Maestro e Elo Débito na entrega."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: DINHEIRO ===================== */}
        {activeSubTab === 'cash' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Dinheiro / Pagamento em Espécie na Entrega
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Defina desconto para pagamento à vista em dinheiro e instrução de troco.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.enableCash}
                  onChange={(e) => handleUpdate('enableCash', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">
                  {formData.enableCash ? 'Dinheiro Ativado' : 'Dinheiro Desativado'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Desconto para Pagamento em Dinheiro (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={formData.cashDiscountPercent}
                    onChange={(e) => handleUpdate('cashDiscountPercent', parseFloat(e.target.value) || 0)}
                    placeholder="5"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <Percent className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">Instruções para Dinheiro e Troco</label>
                <textarea
                  rows={2}
                  value={formData.cashInstructions}
                  onChange={(e) => handleUpdate('cashInstructions', e.target.value)}
                  placeholder="Ex: Pagamento na entrega. Informe se precisará de troco no campo de observações do pedido."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: BOLETO ===================== */}
        {activeSubTab === 'boleto' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Boleto Bancário
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Opção para emissão de boleto bancário via WhatsApp ou gateway.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.enableBoleto}
                  onChange={(e) => handleUpdate('enableBoleto', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-white">
                  {formData.enableBoleto ? 'Boleto Ativado' : 'Boleto Desativado'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Desconto no Boleto (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={formData.boletoDiscountPercent}
                    onChange={(e) => handleUpdate('boletoDiscountPercent', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <Percent className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">Instruções do Boleto Bancário</label>
                <textarea
                  rows={2}
                  value={formData.boletoInstructions}
                  onChange={(e) => handleUpdate('boletoInstructions', e.target.value)}
                  placeholder="Ex: O boleto bancário é gerado após confirmação com nosso atendente no WhatsApp. Prazo de compensação de 1 a 2 dias úteis."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: SIMULADOR DE PREÇO & PARCELAS ===================== */}
        {activeSubTab === 'simulator' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-['Outfit']">
                    Simulador em Tempo Real de Preços & Parcelas
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Veja exatamente como os valores, descontos e parcelas serão exibidos para os clientes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400">Valor de Teste:</span>
                <span className="text-xs font-bold text-amber-400">R$</span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={testAmount}
                  onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white font-bold text-xs text-right focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Simulated Product Card Badge Preview */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-400/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Eye className="w-4 h-4" />
                <span>Como aparece no Card do Produto na Loja:</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-zinc-400">R$</span>
                  <span className="text-xl font-black text-amber-400 font-['Outfit']">
                    {pixFinalAmount.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    à vista no Pix ({formData.pixDiscountPercent}% OFF)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-1">
                  ou em até <strong className="text-white">{maxInstallments}x</strong> de{' '}
                  <strong className="text-amber-400">
                    R$ {(installmentRows[maxInstallments - 1]?.perInstallment || 0).toFixed(2).replace('.', ',')}
                  </strong>{' '}
                  no cartão {interestFree > 1 && `(até ${interestFree}x sem juros)`}
                </span>
              </div>
            </div>

            {/* Installments Table */}
            <div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>Tabela Completa de Parcelamento no Cartão</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {installmentRows.map((row) => (
                  <div
                    key={row.n}
                    className={`p-2.5 rounded-xl border text-xs ${
                      row.isFree
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{row.n}x de R$ {row.perInstallment.toFixed(2).replace('.', ',')}</span>
                      {row.isFree ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                          Sem Juros
                        </span>
                      ) : (
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {formData.creditCardInterestRate}% a.m.
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      Total: R$ {row.totalWithInterest.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Checkout Display Preferences */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Preferências Globais do Checkout & Exibição</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Forma de Pagamento Padrão Selecionada</label>
              <select
                value={formData.defaultPaymentMethod}
                onChange={(e) => handleUpdate('defaultPaymentMethod', e.target.value as PaymentMethodKey)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer font-bold"
              >
                <option value="pix">⚡ Pix Instantâneo (Recomendado)</option>
                <option value="credit_card">💳 Cartão de Crédito</option>
                <option value="debit_card">💳 Cartão de Débito</option>
                <option value="cash">💵 Dinheiro / Espécie na Entrega</option>
                <option value="boleto">📄 Boleto Bancário</option>
                <option value="whatsapp">📱 WhatsApp / A Combinar</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 w-full">
                <input
                  type="checkbox"
                  checked={formData.showPaymentBadgesOnCards}
                  onChange={(e) => handleUpdate('showPaymentBadgesOnCards', e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-zinc-200">
                  Exibir condições de pagamento ("Pix com desconto ou até 12x") nos cards dos produtos
                </span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Nota ou Aviso de Pagamento no Carrinho</label>
              <input
                type="text"
                value={formData.customPaymentNotes || ''}
                onChange={(e) => handleUpdate('customPaymentNotes', e.target.value)}
                placeholder="Ex: Dúvidas sobre pagamento ou parcelamento? Fale diretamente com nossa equipe no WhatsApp!"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Bottom Bar */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Formas de Pagamento</span>
          </button>
        </div>
      </form>
    </div>
  );
};
