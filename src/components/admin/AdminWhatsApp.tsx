import React, { useState } from 'react';
import {
  MessageCircle,
  Sparkles,
  Check,
  Smartphone,
  ExternalLink,
  Code,
  Tag,
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { db } from '../../services/db';

interface AdminWhatsAppProps {
  settings: StoreSettings;
  onRefresh: () => void;
}

export const AdminWhatsApp: React.FC<AdminWhatsAppProps> = ({ settings, onRefresh }) => {
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '5582999998888');
  const [defaultMessage, setDefaultMessage] = useState(
    settings.whatsappDefaultMessage || 'Olá SAT LOJA! Gostaria de mais informações sobre os produtos.'
  );
  const [productTemplate, setProductTemplate] = useState(
    settings.whatsappProductMessageTemplate ||
      'Olá SAT LOJA! Tenho interesse no produto:\n\n📱 *{NOME}*\n🏷️ SKU: {SKU}\n💵 Preço: {PRECO}\n🔗 Link: {LINK}\n\nAinda está disponível?'
  );
  const [cartTemplate, setCartTemplate] = useState(
    settings.whatsappCartMessageTemplate ||
`🛒 *NOVO PEDIDO — SAT LOJA*

📋 *Itens do Pedido:*
{ITENS}

💵 *Total:* {TOTAL}

👤 *Cliente:* {NOME}
📱 *WhatsApp:* {TELEFONE}
📍 *Endereço:* {ENDERECO}
📝 *Observações:* {OBSERVACOES}

Por favor, confirmem a disponibilidade e dados para pagamento!`
  );
  const [enableFloating, setEnableFloating] = useState(settings.enableWhatsappFloating !== false);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>(
    settings.whatsappFloatingPosition || 'bottom-right'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    db.updateSettings({
      whatsappNumber: cleanNumber,
      whatsappDefaultMessage: defaultMessage,
      whatsappProductMessageTemplate: productTemplate,
      whatsappCartMessageTemplate: cartTemplate,
      enableWhatsappFloating: enableFloating,
      whatsappFloatingPosition: position,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  const handleTestWhatsApp = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Configuração e Integração do WhatsApp
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personalize os números de atendimento, o botão flutuante e os modelos de mensagens de pedidos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestWhatsApp}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Testar Conexão WhatsApp</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Configurações do WhatsApp salvas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* General WhatsApp Number & Floating Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Número do WhatsApp (com DDI e DDD) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: 5582999998888"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <Smartphone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Insira o código do país (55 para Brasil), DDD e o número sem espaços.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Botão Flutuante no Site
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableFloating}
                    onChange={(e) => setEnableFloating(e.target.checked)}
                    className="rounded bg-zinc-950 border-zinc-700 text-emerald-400 focus:ring-0 w-4 h-4"
                  />
                  <span>Exibir botão flutuante</span>
                </label>

                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="bottom-right">Canto Inferior Direito</option>
                  <option value="bottom-left">Canto Inferior Esquerdo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Floating Message */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
              Mensagem Padrão do Botão Flutuante
            </label>
            <input
              type="text"
              value={defaultMessage}
              onChange={(e) => setDefaultMessage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Product direct purchase template */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Modelo de Mensagem: "Comprar pelo WhatsApp" (Produto Individual)
              </label>
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <Code className="w-3.5 h-3.5" />
                <span>Tags: &#123;NOME&#125;, &#123;SKU&#125;, &#123;PRECO&#125;, &#123;LINK&#125;</span>
              </div>
            </div>
            <textarea
              rows={4}
              value={productTemplate}
              onChange={(e) => setProductTemplate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Cart checkout template */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Modelo de Mensagem: "Finalizar Pedido do Carrinho"
              </label>
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <Tag className="w-3.5 h-3.5" />
                <span>Tags: &#123;ITENS&#125;, &#123;TOTAL&#125;, &#123;NOME&#125;, &#123;TELEFONE&#125;, &#123;ENDERECO&#125;, &#123;OBSERVACOES&#125;</span>
              </div>
            </div>
            <textarea
              rows={8}
              value={cartTemplate}
              onChange={(e) => setCartTemplate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Configurações do WhatsApp</span>
          </button>
        </div>
      </form>
    </div>
  );
};
