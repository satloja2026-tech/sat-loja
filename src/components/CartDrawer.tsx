import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  QrCode,
  CreditCard,
  Banknote,
  FileText,
  Link as LinkIcon,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, StoreSettings, Order, PaymentMethodKey } from '../types';
import { db } from '../services/db';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>(
    (settings?.paymentSettings?.defaultPaymentMethod as PaymentMethodKey) || 'pix'
  );
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);
  const [cashChangeNeeded, setCashChangeNeeded] = useState<string>('');
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formError, setFormError] = useState('');

  // Always show the items list first when opening the cart
  React.useEffect(() => {
    if (isOpen) {
      setShowCheckoutForm(false);
    }
  }, [isOpen, cart.length]);

  if (!isOpen) return null;

  const paymentCfg = settings?.paymentSettings;

  const subtotal = cart.reduce((acc, item) => {
    if (!item || !item.product) return acc;
    const rawPrice = item.product.promotionalPrice && item.product.promotionalPrice > 0
      ? item.product.promotionalPrice
      : item.product.price;
    const price = typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice : parseFloat(String(rawPrice || 0)) || 0;
    const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : 1;
    return acc + price * qty;
  }, 0);

  // Dynamic Discount based on selected payment method
  let discount = 0;
  let discountLabel = '';

  if (paymentMethod === 'pix' && paymentCfg?.enablePix && (paymentCfg?.pixDiscountPercent || 0) > 0) {
    discount = (subtotal * (paymentCfg.pixDiscountPercent || 0)) / 100;
    discountLabel = `Desconto Pix (${paymentCfg.pixDiscountPercent}%)`;
  } else if (paymentMethod === 'cash' && paymentCfg?.enableCash && (paymentCfg?.cashDiscountPercent || 0) > 0) {
    discount = (subtotal * (paymentCfg.cashDiscountPercent || 0)) / 100;
    discountLabel = `Desconto À Vista (${paymentCfg.cashDiscountPercent}%)`;
  } else if (paymentMethod === 'boleto' && paymentCfg?.enableBoleto && (paymentCfg?.boletoDiscountPercent || 0) > 0) {
    discount = (subtotal * (paymentCfg.boletoDiscountPercent || 0)) / 100;
    discountLabel = `Desconto Boleto (${paymentCfg.boletoDiscountPercent}%)`;
  }

  const finalTotal = Math.max(0, subtotal - discount);

  const freeShippingThreshold = settings.freeShippingThreshold || 299;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const copyPixKey = async () => {
    if (paymentCfg?.pixKey) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(paymentCfg.pixKey);
        }
      } catch {
        // Fallback for iframe environment
      }
      setCopiedPixKey(true);
      setTimeout(() => setCopiedPixKey(false), 2500);
    }
  };

  const getPaymentDescriptionForWhatsApp = () => {
    switch (paymentMethod) {
      case 'pix': {
        const discText = discount > 0 ? ` (com ${paymentCfg?.pixDiscountPercent}% de desconto aplicado)` : '';
        return `⚡ Pix Instantâneo${discText}`;
      }
      case 'credit_card': {
        const instAmount = (subtotal / selectedInstallments).toFixed(2).replace('.', ',');
        const isFree = selectedInstallments <= (paymentCfg?.creditCardInterestFreeInstallments || 1);
        return `💳 Cartão de Crédito (${selectedInstallments}x de R$ ${instAmount}${isFree ? ' sem juros' : ''})`;
      }
      case 'debit_card':
        return `💳 Cartão de Débito (Maquininha na entrega)`;
      case 'cash':
        return `💵 Dinheiro / À Vista ${cashChangeNeeded ? `(Troco para: R$ ${cashChangeNeeded})` : '(Valor exato)'}`;
      case 'boleto':
        return `📄 Boleto Bancário`;
      case 'payment_link':
        return `🔗 Link de Pagamento Online`;
      default:
        return `📱 A Combinar no WhatsApp`;
    }
  };

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    if (!showCheckoutForm) {
      setShowCheckoutForm(true);
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setFormError('Por favor, preencha nome, WhatsApp e endereço para entrega.');
      return;
    }

    setFormError('');

    // Build items text list
    const itemsFormatted = cart
      .map((item, idx) => {
        const price = item.product.promotionalPrice || item.product.price;
        return `${idx + 1}. *${item.product.name}*\n   📦 Qtd: ${item.quantity}x | R$ ${price.toFixed(2).replace('.', ',')} un.\n   🏷️ SKU: ${item.product.sku} | Subtotal: R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}`;
      })
      .join('\n\n');

    const paymentText = getPaymentDescriptionForWhatsApp();
    const subtotalFormatted = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    const discountFormatted = discount > 0 ? `\n🎁 *${discountLabel}:* -R$ ${discount.toFixed(2).replace('.', ',')}` : '';
    const totalFormatted = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;

    // Custom template interpolation or default template
    let message = settings.whatsappCartMessageTemplate ||
`🛒 *NOVO PEDIDO — SAT LOJA*

📋 *Itens do Pedido:*
{ITENS}

💰 *Subtotal:* {SUBTOTAL}{DESCONTO}
💵 *Total a Pagar:* {TOTAL}
💳 *Forma de Pagamento:* {PAGAMENTO}

👤 *Cliente:* {NOME}
📱 *WhatsApp:* {TELEFONE}
📍 *Endereço:* {ENDERECO}
📝 *Observações:* {OBSERVACOES}

Por favor, confirmem a disponibilidade e dados para prosseguirmos!`;

    message = message
      .replace('{ITENS}', itemsFormatted)
      .replace('{SUBTOTAL}', subtotalFormatted)
      .replace('{DESCONTO}', discountFormatted)
      .replace('{TOTAL}', totalFormatted)
      .replace('{PAGAMENTO}', paymentText)
      .replace('{NOME}', customerName)
      .replace('{TELEFONE}', customerPhone)
      .replace('{ENDERECO}', customerAddress)
      .replace('{OBSERVACOES}', customerNotes || 'Nenhuma');

    // Create Order Record in DB
    const newOrder = db.addOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerNotes: customerNotes + (cashChangeNeeded ? ` | Troco para: R$ ${cashChangeNeeded}` : ''),
      items: [...cart],
      subtotal,
      discount,
      total: finalTotal,
      paymentMethod,
      status: 'pending',
    });

    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onOrderPlaced(newOrder);
    onClearCart();
    onClose();

    // Open WhatsApp
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black text-white font-['Outfit'] uppercase tracking-wide">
                Seu Carrinho ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>Faltam <b className="text-amber-400">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</b> para <span className="font-bold text-emerald-400">Frete Grátis</span></span>
                  <span className="font-bold text-zinc-400">{Math.round(shippingProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Parabéns! Você ganhou Frete Grátis neste pedido.</span>
              </div>
            )}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-500">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">Seu carrinho está vazio</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Explore nossos eletrônicos e selecione os melhores produtos para você.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : showCheckoutForm ? (
              /* Customer Details & Payment Checkout Form */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📋 Dados para Envio & Pagamento</span>
                  </h3>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Voltar aos Itens
                  </button>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                {/* Personal Information */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Seu Nome Completo *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Seu WhatsApp com DDD *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex: (82) 99999-8888"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Endereço de Entrega (Rua, Nº, Bairro, Cidade/UF) *</label>
                    <textarea
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Ex: Av. Fernandes Lima, 1200, Apto 402 - Maceió/AL"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Observações / Ponto de Referência (Opcional)</label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Ex: Próximo à padaria central"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Forma de Pagamento Selection */}
                <div className="pt-3 border-t border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Escolha a Forma de Pagamento
                    </label>
                    {discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {discountLabel}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Pix Option */}
                    {paymentCfg?.enablePix !== false && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                          paymentMethod === 'pix'
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold flex items-center gap-1.5">
                            <QrCode className="w-4 h-4 text-emerald-400" />
                            Pix
                          </span>
                          {(paymentCfg?.pixDiscountPercent || 0) > 0 && (
                            <span className="text-[9px] font-extrabold bg-emerald-500 text-black px-1.5 py-0.2 rounded">
                              {paymentCfg?.pixDiscountPercent}% OFF
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400">Aprovação imediata</span>
                      </button>
                    )}

                    {/* Credit Card Option */}
                    {paymentCfg?.enableCreditCard !== false && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                          paymentMethod === 'credit_card'
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-amber-400" />
                            Cartão Crédito
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          Até {paymentCfg?.creditCardMaxInstallments || 12}x parcelado
                        </span>
                      </button>
                    )}

                    {/* Debit Card Option */}
                    {paymentCfg?.enableDebitCard && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('debit_card')}
                        className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                          paymentMethod === 'debit_card'
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="font-bold flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-400" />
                          Cartão Débito
                        </span>
                        <span className="text-[10px] text-zinc-400">Maquininha entrega</span>
                      </button>
                    )}

                    {/* Cash Option */}
                    {paymentCfg?.enableCash && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                          paymentMethod === 'cash'
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-emerald-400" />
                            Dinheiro
                          </span>
                          {(paymentCfg?.cashDiscountPercent || 0) > 0 && (
                            <span className="text-[9px] font-extrabold bg-emerald-500 text-black px-1.5 py-0.2 rounded">
                              {paymentCfg?.cashDiscountPercent}% OFF
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400">À vista na entrega</span>
                      </button>
                    )}

                    {/* Boleto Option */}
                    {paymentCfg?.enableBoleto && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                          paymentMethod === 'boleto'
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="font-bold flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-purple-400" />
                          Boleto
                        </span>
                        <span className="text-[10px] text-zinc-400">Compensação 1-2 dias</span>
                      </button>
                    )}

                    {/* Payment Link Option */}
                    {paymentCfg?.enablePaymentLink && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('payment_link')}
                        className={`p-3 rounded-xl border flex flex-col items-start gap-1 text-left transition-all ${
                          paymentMethod === 'payment_link'
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <span className="font-bold flex items-center gap-1.5">
                          <LinkIcon className="w-4 h-4 text-indigo-400" />
                          Link Online
                        </span>
                        <span className="text-[10px] text-zinc-400">Pague pelo celular</span>
                      </button>
                    )}
                  </div>

                  {/* Payment Method Details / Context Box */}
                  {paymentMethod === 'pix' && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span>Chave Pix da SAT LOJA:</span>
                        <span className="text-[10px] text-zinc-400 uppercase">({paymentCfg?.pixKeyType || 'CNPJ'})</span>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-950 border border-emerald-500/30 rounded-lg p-2 font-mono text-white text-xs">
                        <span className="truncate mr-2">{paymentCfg?.pixKey || settings.phone}</span>
                        <button
                          type="button"
                          onClick={copyPixKey}
                          className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] flex items-center gap-1 shrink-0"
                        >
                          {copiedPixKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPixKey ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                      {paymentCfg?.pixBeneficiary && (
                        <p className="text-[10px] text-zinc-400">
                          Beneficiário: <strong className="text-zinc-200">{paymentCfg.pixBeneficiary}</strong> {paymentCfg?.pixCity && `(${paymentCfg.pixCity})`}
                        </p>
                      )}
                    </div>
                  )}

                  {paymentMethod === 'credit_card' && (
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                      <label className="block text-zinc-300 font-semibold">Selecione o Parcelamento Desejado:</label>
                      <select
                        value={selectedInstallments}
                        onChange={(e) => setSelectedInstallments(parseInt(e.target.value, 10))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
                      >
                        {Array.from({ length: paymentCfg?.creditCardMaxInstallments || 12 }, (_, i) => i + 1).map((num) => {
                          const isInterestFree = num <= (paymentCfg?.creditCardInterestFreeInstallments || 3);
                          const instVal = subtotal / num;
                          return (
                            <option key={num} value={num}>
                              {num}x de R$ {instVal.toFixed(2).replace('.', ',')} {isInterestFree ? '(sem juros)' : ''}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-[10px] text-zinc-400">
                        {paymentCfg?.creditCardInstructions || 'Aceitamos as principais bandeiras (Visa, Mastercard, Elo, Hipercard, Amex).'}
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                      <label className="block text-zinc-300 font-semibold">Precisa de troco? (Opcional)</label>
                      <input
                        type="text"
                        value={cashChangeNeeded}
                        onChange={(e) => setCashChangeNeeded(e.target.value)}
                        placeholder="Ex: Troco para R$ 100,00 ou R$ 200,00"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-zinc-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Ao clicar em enviar pedido, abriremos o WhatsApp com todos os detalhes prontos para confirmação imediata.</span>
                </div>
              </div>
            ) : (
              /* Item List */
              <>
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                  <span>Itens Selecionados</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar</span>
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/80">
                  {cart.map((item) => {
                    const rawPrice = item.product.promotionalPrice && item.product.promotionalPrice > 0
                      ? item.product.promotionalPrice
                      : item.product.price;
                    const price = typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice : parseFloat(String(rawPrice || 0)) || 0;
                    const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : 1;
                    return (
                      <div key={item.product.id} className="py-3 flex gap-3 group">
                        {/* Thumbnail */}
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-contain bg-zinc-950 border border-zinc-800 p-1 shrink-0"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-zinc-100 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                              title="Remover item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity buttons */}
                            <div className="flex items-center bg-zinc-950 border border-zinc-700 rounded-lg p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-zinc-400 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="text-xs font-bold text-amber-400">
                                R$ {(price * qty).toFixed(2).replace('.', ',')}
                              </span>
                              {qty > 1 && (
                                <span className="text-[10px] text-zinc-400 block">
                                  (R$ {price.toFixed(2).replace('.', ',')} un.)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Subtotal, Discount and WhatsApp CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>{discountLabel}</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Frete</span>
                  <span className={remainingForFreeShipping === 0 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                    {remainingForFreeShipping === 0 ? 'GRÁTIS' : 'A calcular via WhatsApp'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total Final</span>
                  <span className="text-amber-400 text-lg font-['Outfit']">
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{showCheckoutForm ? 'ENVIAR PEDIDO NO WHATSAPP' : 'CONTINUAR PARA WHATSAPP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
