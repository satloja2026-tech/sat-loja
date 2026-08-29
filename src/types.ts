export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'dispatched';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  detailedDescription?: string;
  category: string;
  price: number;
  promotionalPrice?: number;
  isOffer: boolean;
  stock: number;
  mainImage: string;
  gallery: string[];
  externalLink?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  specs?: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon?: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgGradient?: string;
  order: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'whatsapp' | 'pix' | 'card' | 'money';
  status: OrderStatus;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline?: string;
  logoUrl?: string;
  logoType?: 'image' | 'svg';
  faviconUrl?: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  whatsappProductMessageTemplate?: string;
  whatsappCartMessageTemplate?: string;
  enableWhatsappFloating: boolean;
  whatsappFloatingPosition: 'bottom-right' | 'bottom-left';
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  openingHours?: string;
  privacyPolicy?: string;
  termsOfUse?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
  siteTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  enableStockControl?: boolean;
  freeShippingThreshold?: number;
  showTopBar?: boolean;
  topBarText?: string;
  sectionsConfig?: SiteSectionsConfig;
}

export interface SiteSectionsConfig {
  showHeroBanner: boolean;
  showCategories: boolean;
  showOffersSection: boolean;
  showFeaturedSection?: boolean;
  showCatalogSection: boolean;
  showBenefitsBar?: boolean;
  showBenefitsSection?: boolean;
  showContactSection: boolean;
  showFooter?: boolean;
}

export interface AdminUser {
  username: string;
  email: string;
  name: string;
  lastLogin?: string;
}

export interface ZipImportResult {
  totalFolders: number;
  totalImagesFound: number;
  products: Product[];
  warnings: string[];
  errors: string[];
}

export interface ZipImportPreview {
  totalFolders: number;
  validProducts: {
    folderName: string;
    productData: Partial<Product>;
    images: { name: string; dataUrl: string; isMain: boolean }[];
  }[];
  errors: { folderName: string; reason: string }[];
  totalImages: number;
}
