import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  FileArchive,
  Database,
  MessageCircle,
  Palette,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { Product, Category, Banner, Order, StoreSettings } from '../../types';
import { db } from '../../services/db';

import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminBanners } from './AdminBanners';
import { AdminLogo } from './AdminLogo';
import { AdminImages } from './AdminImages';
import { AdminZipImporter } from './AdminZipImporter';
import { AdminBackup } from './AdminBackup';
import { AdminWhatsApp } from './AdminWhatsApp';
import { AdminAppearance } from './AdminAppearance';
import { AdminSettings } from './AdminSettings';
import { AdminUsers } from './AdminUsers';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  banners: Banner[];
  orders: Order[];
  settings: StoreSettings;
  onRefresh: () => void;
  onViewProductOnSite: (product: Product) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  banners,
  orders,
  settings,
  onRefresh,
  onViewProductOnSite,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    db.setAdminAuthenticated(false);
    onClose();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Produtos', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categorias', icon: Layers, badge: categories.length },
    { id: 'orders', label: 'Pedidos WhatsApp', icon: ShoppingBag, badge: orders.filter(o => o.status === 'pending').length || null, badgeColor: 'bg-amber-400 text-black' },
    { id: 'banners', label: 'Banners Iniciais', icon: ImageIcon, badge: banners.length },
    { id: 'logo', label: 'Logo & Marca', icon: Sparkles, badge: null },
    { id: 'images', label: 'Carregar Imagens', icon: UploadCloud, badge: null },
    { id: 'zip-import', label: 'Importar ZIP', icon: FileArchive, badge: 'JSZip', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'backup', label: 'Backup & Restaurar', icon: Database, badge: null },
    { id: 'whatsapp', label: 'WhatsApp Oficial', icon: MessageCircle, badge: null },
    { id: 'appearance', label: 'Editor do Site', icon: Palette, badge: null },
    { id: 'settings', label: 'Configurações', icon: Settings, badge: null },
    { id: 'users', label: 'Segurança & Conta', icon: UserCheck, badge: null },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-zinc-950 border-r border-zinc-800/80 flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand in sidebar */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <BrandLogo logoUrl={settings.logoUrl} storeName={settings.storeName} size="sm" />
          </div>

          {/* Nav list */}
          <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest block py-1.5">
              Menu Administrativo
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                        item.badgeColor || (isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0d12] overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">SAT LOJA</span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                {navItems.find(i => i.id === activeTab)?.label || 'Painel'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase transition-all shadow-md shadow-amber-400/10 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Loja</span>
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              products={products}
              categories={categories}
              orders={orders}
              settings={settings}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              categories={categories}
              onRefresh={onRefresh}
              onViewProductOnSite={(p) => {
                onViewProductOnSite(p);
                onClose();
              }}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              categories={categories}
              products={products}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'banners' && (
            <AdminBanners
              banners={banners}
              products={products}
              categories={categories}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'logo' && (
            <AdminLogo
              settings={settings}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'images' && (
            <AdminImages
              products={products}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'zip-import' && (
            <AdminZipImporter
              onRefresh={onRefresh}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'backup' && (
            <AdminBackup
              products={products}
              settings={settings}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'whatsapp' && (
            <AdminWhatsApp
              settings={settings}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'appearance' && (
            <AdminAppearance
              settings={settings}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={settings}
              onRefresh={onRefresh}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsers />
          )}
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-zinc-950 h-full border-r border-zinc-800 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <BrandLogo logoUrl={settings.logoUrl} storeName={settings.storeName} size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-400 text-black font-bold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Painel</span>
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};
