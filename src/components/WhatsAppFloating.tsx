import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';

interface WhatsAppFloatingProps {
  settings: StoreSettings;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  if (!settings.enableWhatsappFloating) return null;

  const positionClass = settings.whatsappFloatingPosition === 'bottom-left'
    ? 'left-6'
    : 'right-6';

  const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`;

  return (
    <div className={`fixed bottom-6 ${positionClass} z-40 flex flex-col items-end gap-2`}>
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="bg-zinc-900 border border-emerald-500/40 p-3.5 rounded-2xl shadow-2xl shadow-black/80 max-w-xs text-xs text-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-300 relative flex gap-2.5 items-start">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-[10px]"
            title="Fechar dica"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <p className="font-bold text-white mb-0.5 flex items-center gap-1">
              <span>Atendimento SAT LOJA</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </p>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Dúvidas sobre produtos, disponibilidade ou frete? Fale conosco em tempo real!
            </p>
          </div>
        </div>
      )}

      {/* Floating Pulse Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-110 active:scale-95 transition-all duration-300"
        title="Falar no WhatsApp Oficial"
        aria-label="Falar no WhatsApp Oficial"
      >
        {/* Animated Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 drop-shadow-md" />
      </a>
    </div>
  );
};
