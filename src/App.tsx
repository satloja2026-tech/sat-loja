import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Zap,
} from 'lucide-react';

import { Product, Category, Banner, Order, StoreSettings, CartItem } from './types';
import { db } from './services/db';

// Public Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategorySection } from './components/CategorySection';
import { OffersSection } from './components/OffersSection';
import { CatalogSection } from './components/CatalogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppFloating } from './components/WhatsAppFloating';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminModal } from './components/admin/AdminModal';

export const App: React.FC = () => {
  // Store Core State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(db.getSettings());
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation & Modal States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Load / Reload Data from Database
  const loadData = useCallback(() => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
    setBanners(db.getBanners());
    setOrders(db.getOrders());
    setSettings(db.getSettings());
    setCart(db.getCart());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update Page Title & Favicon/Meta
  useEffect(() => {
    if (settings.metaTitle) {
      document.title = settings.metaTitle;
    } else if (settings.storeName) {
      document.title = `${settings.storeName} — Loja Virtual Oficial`;
    }
  }, [settings]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    const updated = db.addToCart(product, quantity);
    setCart([...updated]);
    setIsCartOpen(true);
    setSelectedProduct(null);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updated = db.updateCartItemQuantity(productId, quantity);
    setCart([...updated]);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = db.removeFromCart(productId);
    setCart([...updated]);
  };

  const handleClearCart = () => {
    const updated = db.clearCart();
    setCart([...updated]);
  };

  // Direct WhatsApp Purchase for Single Product
  const handleDirectWhatsApp = (product: Product) => {
    const price = product.promotionalPrice || product.price;
    const formattedPrice = `R$ ${price.toFixed(2).replace('.', ',')}`;
    const productUrl = window.location.href;

    let message = settings.whatsappProductMessageTemplate ||
      'Olá SAT LOJA! Tenho interesse no produto:\n\n📱 *{NOME}*\n🏷️ SKU: {SKU}\n💵 Preço: {PRECO}\n🔗 Link: {LINK}\n\nAinda está disponível?';

    message = message
      .replace('{NOME}', product.name)
      .replace('{SKU}', product.sku)
      .replace('{PRECO}', formattedPrice)
      .replace('{LINK}', productUrl);

    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }
  };

  // Admin Access Flow
  const handleOpenAdmin = () => {
    if (db.isAdminAuthenticated()) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = settings.sectionsConfig || {
    showHeroBanner: true,
    showBenefitsBar: true,
    showCategories: true,
    showOffersSection: true,
    showCatalogSection: true,
    showContactSection: true,
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 font-['Plus_Jakarta_Sans'] flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        categories={categories}
        products={products}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigateSection('catalogo');
        }}
        onNavigate={handleNavigateSection}
        currentSection="home"
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Hero Carousel Banner */}
        {sections.showHeroBanner && (
          <HeroBanner
            banners={banners}
            onNavigateToProducts={() => handleNavigateSection('catalogo')}
          />
        )}

        {/* Section 2: Trust & Benefits Bar */}
        {sections.showBenefitsBar && (
          <div className="bg-zinc-950 border-y border-zinc-800/80 py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Envio Rápido & Seguro</h4>
                    <p className="text-[11px] text-zinc-400">Rastreio detalhado de ponta a ponta</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Garantia SAT LOJA</h4>
                    <p className="text-[11px] text-zinc-400">100% de produtos originais e lacrados</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atendimento WhatsApp</h4>
                    <p className="text-[11px] text-zinc-400">Suporte humanizado e ágil</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pagamento Facilitado</h4>
                    <p className="text-[11px] text-zinc-400">Pix com desconto e aprovação imediata</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Categories Carousel/Grid */}
        {sections.showCategories && (
          <CategorySection
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigateSection('catalogo');
            }}
          />
        )}

        {/* Section 4: Lightning Offers / Descontos */}
        {sections.showOffersSection && (
          <OffersSection
            products={products}
            settings={settings}
            onViewProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onDirectWhatsApp={handleDirectWhatsApp}
            onNavigateToCatalog={() => handleNavigateSection('catalogo')}
          />
        )}

        {/* Section 5: Main Catalog with Filters & Search */}
        {sections.showCatalogSection && (
          <CatalogSection
            products={products}
            categories={categories}
            settings={settings}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onViewProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onDirectWhatsApp={handleDirectWhatsApp}
          />
        )}

        {/* Section 6: Contact & Direct WhatsApp Form */}
        {sections.showContactSection && (
          <ContactSection settings={settings} />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        categories={categories}
        onNavigate={handleNavigateSection}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onWhatsAppOrder={(p, qty) => handleDirectWhatsApp(p)}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={(order) => {
          setOrders(db.getOrders());
        }}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppFloating settings={settings} />

      {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onClose={() => setIsAdminLoginOpen(false)}
        />
      )}

      {/* Full Admin Management Panel */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={products}
          categories={categories}
          banners={banners}
          orders={orders}
          settings={settings}
          onRefresh={loadData}
          onViewProductOnSite={(product) => {
            setSelectedProduct(product);
          }}
        />
      )}
    </div>
  );
};
export default App;
