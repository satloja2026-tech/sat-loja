import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { db } from '../services/db';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetToDefault = () => {
    try {
      db.resetToDefault();
      window.location.reload();
    } catch {
      localStorage.clear();
      window.location.reload();
    }
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white font-['Outfit']">
                SAT LOJA • Recuperação do Sistema
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Identificamos uma instabilidade temporária ao carregar a interface. Você pode tentar recarregar ou restaurar os dados de fábrica.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-500 font-mono text-left max-h-24 overflow-y-auto">
                {this.state.error.message || 'Erro inesperado na renderização.'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-400/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar Loja</span>
              </button>

              <button
                onClick={this.handleResetToDefault}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer border border-zinc-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Dados</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


