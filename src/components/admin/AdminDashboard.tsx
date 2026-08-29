import React from 'react';
import {
  Package,
  CheckCircle2,
  Flame,
  Layers,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { Product, Category, Order, StoreSettings } from '../../types';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  settings,
  onNavigateTab,
}) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const offerProducts = products.filter(p => p.isActive && p.isOffer).length;
  const outOfStockProducts = products.filter(p => p.stock <= 0).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Category distribution
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.category === cat.name).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Greeting */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-amber-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SAT LOJA • PAINEL ATIVO
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Visão Geral do E-commerce
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
            Acompanhe indicadores de vendas via WhatsApp, produtos em estoque, categorias e desempenho do catálogo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('products')}
            className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all hover:scale-105"
          >
            + Novo Produto
          </button>
          <button
            onClick={() => onNavigateTab('zip-import')}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase px-4 py-2.5 rounded-xl border border-zinc-700 transition-all"
          >
            Importar ZIP
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Produtos</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            {totalProducts}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeProducts} ativos na loja</span>
          </div>
        </div>

        {/* Card 2: Orders & WhatsApp Leads */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pedidos / WhatsApp</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>R$ {totalRevenue.toFixed(2).replace('.', ',')} em pedidos</span>
          </div>
        </div>

        {/* Card 3: In Promotion */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Em Promoção</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            {offerProducts}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            Ofertas com preço reduzido
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sem Estoque</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-['Outfit'] ${outOfStockProducts > 0 ? 'text-rose-400' : 'text-zinc-100'}`}>
            {outOfStockProducts}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            {outOfStockProducts > 0 ? 'Necessita reposição de estoque' : 'Estoque regular em todos'}
          </div>
        </div>
      </div>

      {/* Grid: Categories Breakdown & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Distribution */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Distribuição por Categoria</span>
              </h3>
              <button
                onClick={() => onNavigateTab('categories')}
                className="text-xs text-amber-400 hover:underline"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-3.5">
              {categoryStats.map((item, idx) => {
                const percentage = totalProducts > 0 ? Math.round((item.count / totalProducts) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-zinc-300 font-medium">
                      <span>{item.name}</span>
                      <span className="text-zinc-400">{item.count} un. ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between text-xs text-zinc-400">
            <span>Total de Departamentos:</span>
            <strong className="text-white">{categories.length}</strong>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Pedidos Recentes</span>
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Nenhum pedido registrado ainda. Os pedidos realizados pelo carrinho via WhatsApp aparecerão aqui.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{order.customerName}</span>
                      <span className="font-mono text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{order.id}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}: {order.items.map(i => i.product.name).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-bold text-amber-400 block font-['Outfit'] text-sm">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                      title="Chamar cliente no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
