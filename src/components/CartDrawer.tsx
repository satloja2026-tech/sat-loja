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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, StoreSettings, Order } from '../types';
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
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.promotionalPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const freeShippingThreshold = settings.freeShippingThreshold || 299;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

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

    const totalFormatted = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

    // Custom template interpolation
    let message = settings.whatsappCartMessageTemplate ||
`🛒 *NOVO PEDIDO — SAT LOJA*

📋 *Itens do Pedido:*
{ITENS}

💵 *Total:* {TOTAL}

👤 *Cliente:* {NOME}
📱 *WhatsApp:* {TELEFONE}
📍 *Endereço:* {ENDERECO}
📝 *Observações:* {OBSERVACOES}

Por favor, confirmem a disponibilidade e dados para pagamento!`;

    message = message
      .replace('{ITENS}', itemsFormatted)
      .replace('{TOTAL}', totalFormatted)
      .replace('{NOME}', customerName)
      .replace('{TELEFONE}', customerPhone)
      .replace('{ENDERECO}', customerAddress)
      .replace('{OBSERVACOES}', customerNotes || 'Nenhuma');

    // Create Order Record in DB
    const newOrder = db.addOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerNotes,
      items: [...cart],
      subtotal,
      discount: 0,
      total: subtotal,
      paymentMethod: 'whatsapp',
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
    window.open(waUrl, '_blank');
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
              /* Customer Details Checkout Form */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📋 Dados para Envio & WhatsApp</span>
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
                    <label className="block text-zinc-400 font-semibold mb-1">Observações ou Ponto de Referência (Opcional)</label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Ex: Próximo à padaria central"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-zinc-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Ao clicar em finalizar, abriremos o WhatsApp com seu pedido preenchido pronto para envio imediato para nossa equipe SAT LOJA.</span>
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
                    const price = item.product.promotionalPrice || item.product.price;
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
                                R$ {(price * item.quantity).toFixed(2).replace('.', ',')}
                              </span>
                              {item.quantity > 1 && (
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

          {/* Drawer Footer with Subtotal and WhatsApp CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Frete</span>
                  <span className={remainingForFreeShipping === 0 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                    {remainingForFreeShipping === 0 ? 'GRÁTIS' : 'A calcular via WhatsApp'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total Estimado</span>
                  <span className="text-amber-400 text-lg font-['Outfit']">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
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
