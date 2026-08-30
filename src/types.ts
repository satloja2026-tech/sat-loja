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

export type PaymentMethodKey = 'whatsapp' | 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'boleto' | 'payment_link' | 'card' | 'money';

export interface PaymentSettings {
  // Pix
  enablePix: boolean;
  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  pixBeneficiary: string;
  pixCity?: string;
  pixDiscountPercent: number; // Ex: 5% ou 10%
  pixInstructions: string;
  pixQrCodeUrl?: string;

  // Cartão de Crédito
  enableCreditCard: boolean;
  creditCardMaxInstallments: number; // Ex: 12
  creditCardInterestFreeInstallments: number; // Ex: 3 ou 6 (sem juros)
  creditCardInterestRate: number; // Ex: 1.99 (% a.m. se parcelar além das sem juros)
  creditCardMachineOnDelivery: boolean; // Levar maquininha na entrega
  creditCardInstructions: string;

  // Cartão de Débito
  enableDebitCard: boolean;
  debitCardMachineOnDelivery: boolean;
  debitCardInstructions: string;

  // Dinheiro / À Vista
  enableCash: boolean;
  cashDiscountPercent: number;
  cashInstructions: string;

  // Boleto Bancário
  enableBoleto: boolean;
  boletoDiscountPercent: number;
  boletoInstructions: string;

  // Link de Pagamento Online
  enablePaymentLink: boolean;
  paymentLinkName: string;
  paymentLinkUrl: string;
  paymentLinkInstructions: string;

  // Opções Gerais
  defaultPaymentMethod: PaymentMethodKey;
  showPaymentBadgesOnCards: boolean;
  customPaymentNotes?: string;
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
  paymentMethod: PaymentMethodKey | string;
  paymentDetails?: {
    methodName: string;
    installments?: number;
    installmentValue?: number;
    changeFor?: number;
  };
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
  paymentSettings?: PaymentSettings;
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
