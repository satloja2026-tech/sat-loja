import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { StoreSettings } from '../types';

interface ContactSectionProps {
  settings: StoreSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('Dúvida sobre produtos');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const formattedMessage = `Olá SAT LOJA!\n\n👤 *Nome:* ${name}\n📌 *Assunto:* ${subject}\n\n💬 *Mensagem:*\n${message}`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }

    setSent(true);
    setName('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contato" className="py-16 bg-[#0e1017] border-b border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Contact details */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atendimento & Suporte</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
                FALE DIRETAMENTE COM A SAT LOJA
              </h2>
              <p className="text-zinc-400 text-sm mt-2 max-w-md leading-relaxed">
                Estamos prontos para atender você com agilidade, tirar dúvidas sobre especificações técnicas, prazos e formas de pagamento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Oficial</h4>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">{settings.phone || settings.whatsappNumber}</p>
                  <span className="text-[10px] text-zinc-500 block">Resposta rápida</span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${settings.email}`}
                className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">E-mail Comercial</h4>
                  <p className="text-xs text-zinc-300 font-medium mt-0.5 truncate max-w-[150px]">{settings.email}</p>
                  <span className="text-[10px] text-zinc-500 block">Orçamentos e parcerias</span>
                </div>
              </a>

              {/* Address Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Localização</h4>
                  <p className="text-xs text-zinc-300 font-medium mt-0.5 leading-snug">{settings.address}</p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Horário</h4>
                  <p className="text-xs text-zinc-300 font-medium mt-0.5 leading-snug">{settings.openingHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Form */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <h3 className="text-lg font-black text-white font-['Outfit'] mb-1">
              Envie uma Mensagem Rápida
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Preencha o formulário abaixo para abrir uma conversa direta no WhatsApp da loja com seu pedido de suporte ou orçamento.
            </p>

            {sent && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mensagem preparada! Abrindo o WhatsApp da SAT LOJA...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Seu Nome *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Assunto</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Dúvida sobre produtos">Dúvida sobre produtos</option>
                  <option value="Consultar disponibilidade e frete">Consultar disponibilidade e frete</option>
                  <option value="Suporte a pedido realizado">Suporte a pedido realizado</option>
                  <option value="Parceria ou atacado">Parceria ou atacado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Mensagem *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem ou dúvida detalhada..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar pelo WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
