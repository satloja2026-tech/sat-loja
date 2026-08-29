import { Product, Category, Banner, StoreSettings, SiteSectionsConfig, Order, AdminUser, CartItem, OrderStatus } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'sat_loja_products',
  CATEGORIES: 'sat_loja_categories',
  BANNERS: 'sat_loja_banners',
  SETTINGS: 'sat_loja_settings',
  SECTIONS: 'sat_loja_sections',
  ORDERS: 'sat_loja_orders',
  CART: 'sat_loja_cart',
  ADMIN_USER: 'sat_loja_admin_user',
  ADMIN_AUTH: 'sat_loja_admin_auth',
};

// Default Settings aligned with SAT LOJA visual identity
export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SAT LOJA',
  tagline: 'Tecnologia, Inovação e Qualidade Premium',
  logoUrl: '', // Uses SVG brand emblem if blank, or custom uploaded image
  logoType: 'image',
  whatsappNumber: '5582999999999',
  whatsappDefaultMessage: 'Olá! Vim pelo site da SAT LOJA e gostaria de tirar algumas dúvidas.',
  whatsappProductMessageTemplate: 'Olá! Tenho interesse neste produto da SAT LOJA:\n\n📦 *{NOME}*\n🏷️ Código: {SKU}\n💰 Preço: {PRECO}\n🔗 Link: {LINK}\n\nGostaria de saber mais informações e formas de entrega!',
  whatsappCartMessageTemplate: '🛒 *NOVO PEDIDO — SAT LOJA*\n\n📋 *Itens do Pedido:*\n{ITENS}\n\n💵 *Total:* {TOTAL}\n\n👤 *Cliente:* {NOME}\n📱 *WhatsApp:* {TELEFONE}\n📍 *Endereço:* {ENDERECO}\n📝 *Observações:* {OBSERVACOES}\n\nPor favor, confirmem a disponibilidade para envio!',
  enableWhatsappFloating: true,
  whatsappFloatingPosition: 'bottom-right',
  phone: '(82) 99999-9999',
  email: 'satloja2026@gmail.com',
  address: 'Av. Principal da Tecnologia, 1000 - Centro Empresarial SAT',
  instagram: 'https://instagram.com/satloja',
  facebook: 'https://facebook.com/satloja',
  tiktok: 'https://tiktok.com/@satloja',
  openingHours: 'Segunda a Sábado: 08h00 às 20h00',
  privacyPolicy: 'A SAT LOJA respeita sua privacidade. Seus dados são protegidos e utilizados exclusivamente para o processamento de pedidos e atendimento personalizado.',
  termsOfUse: 'Todos os produtos possuem garantia oficial de 90 dias até 1 ano conforme especificações do fabricante.',
  primaryColor: '#eab308', // Gold / Amber
  secondaryColor: '#121318', // Graphite dark
  accentColor: '#f59e0b', // Amber accent
  fontHeading: 'Outfit',
  fontBody: 'Plus Jakarta Sans',
  siteTitle: 'SAT LOJA — Tecnologia e Qualidade Para Você',
  metaDescription: 'Loja Oficial SAT LOJA. Encontre os melhores smartphones, fones bluetooth, smartwatches e acessórios com garantia e atendimento rápido via WhatsApp.',
  enableStockControl: true,
  freeShippingThreshold: 299.00,
};

export const DEFAULT_SECTIONS: SiteSectionsConfig = {
  showHeroBanner: true,
  showCategories: true,
  showOffersSection: true,
  showFeaturedSection: true,
  showCatalogSection: true,
  showBenefitsSection: true,
  showContactSection: true,
  showFooter: true,
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-smartphones',
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop',
    icon: 'Smartphone',
    description: 'Smartphones topo de linha, tecnologia 5G e alta performance.',
    isActive: true,
    order: 1,
  },
  {
    id: 'cat-audio',
    name: 'Áudio & Fones',
    slug: 'audio-fones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    icon: 'Headphones',
    description: 'Fones TWS, Headsets com ANC e caixas de som de alta definição.',
    isActive: true,
    order: 2,
  },
  {
    id: 'cat-wearables',
    name: 'Smartwatches & Pulseiras',
    slug: 'smartwatches-wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    icon: 'Watch',
    description: 'Monitore sua saúde, batimentos e notificações com elegância.',
    isActive: true,
    order: 3,
  },
  {
    id: 'cat-carregadores',
    name: 'Carregadores & Cabos',
    slug: 'carregadores-cabos',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    icon: 'Zap',
    description: 'Carregamento turbo GaN, bases por indução e cabos reforçados.',
    isActive: true,
    order: 4,
  },
  {
    id: 'cat-acessorios',
    name: 'Acessórios & Suportes',
    slug: 'acessorios-suportes',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800&auto=format&fit=crop',
    icon: 'Grid',
    description: 'Suportes magnéticos, hubs USB-C e organizadores de mesa.',
    isActive: true,
    order: 5,
  },
  {
    id: 'cat-gamers',
    name: 'Gamer & Periféricos',
    slug: 'gamer-perifericos',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    icon: 'Gamepad2',
    description: 'Mouses de precisão, teclados mecânicos e pads gamer.',
    isActive: true,
    order: 6,
  },
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'TECNOLOGIA E QUALIDADE PARA VOCÊ',
    subtitle: 'Eletrônicos de alta performance com garantia, design premium e atendimento exclusivo.',
    buttonText: 'VER PRODUTOS',
    buttonLink: '#catalogo',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1600&auto=format&fit=crop',
    bgGradient: 'from-black/90 via-[#13151b]/80 to-amber-950/40',
    order: 1,
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'ÁUDIO DE ALTA FIDELIDADE COM CANCELAMENTO DE RUÍDO',
    subtitle: 'Sinta cada detalhe da sua música com graves profundos e tecnologia ANC avançada.',
    buttonText: 'CONHECER FONES',
    buttonLink: '#categoria-cat-audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop',
    bgGradient: 'from-black/90 via-[#0e1017]/85 to-amber-900/30',
    order: 2,
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'SMARTWATCHES SAT PRO COM TELA AMOLED',
    subtitle: 'Elegância em titânio e aço com autonomia de bateria para acompanhar seu ritmo diário.',
    buttonText: 'VER OFERTAS',
    buttonLink: '#ofertas',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop',
    bgGradient: 'from-black/95 via-[#181920]/80 to-yellow-900/40',
    order: 3,
    isActive: true,
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Smartphone SAT Titan Ultra 5G (256GB / 12GB RAM)',
    sku: 'SAT-TITAN-01',
    description: 'Smartphone topo de linha com chassi de titânio escovado, tela AMOLED 120Hz e câmera quádrupla 108MP.',
    detailedDescription: 'O Smartphone SAT Titan Ultra foi projetado para usuários exigentes que necessitam de velocidade instantânea, autonomia estendida e fotografia de nível profissional. Conta com processador octa-core de última geração, bateria de 5000mAh com carregamento ultrarrápido de 67W e proteção contra água e poeira IP68.',
    category: 'Smartphones & Tablets',
    price: 3499.90,
    promotionalPrice: 2999.90,
    isOffer: true,
    stock: 15,
    mainImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: true,
    tags: ['smartphone', '5g', 'titanium', 'celular', 'lancamento'],
    specs: {
      'Processador': 'Octa-Core 3.2 GHz Ultra Turbo',
      'Memória RAM': '12 GB LPDDR5X',
      'Armazenamento': '256 GB UFS 4.0',
      'Tela': '6.7" Dynamic AMOLED 120Hz HDR10+',
      'Bateria': '5.000 mAh com carga rápida 67W',
      'Garantia': '12 meses SAT Loja Oficial'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Fone Bluetooth SAT NoiseCancel Pro Black & Gold',
    sku: 'SAT-AUDIO-02',
    description: 'Fone de ouvido over-ear sem fio com Cancelamento Ativo de Ruído (ANC), drivers de 40mm e 45h de bateria.',
    detailedDescription: 'Experimente um som imersivo de alta resolução com o SAT NoiseCancel Pro. Com acabamento premium em preto fosco com toques dourados, almofadas viscoelásticas ultra confortáveis e conectividade Bluetooth 5.3 multiponto para alternar facilmente entre celular e notebook.',
    category: 'Áudio & Fones',
    price: 499.90,
    promotionalPrice: 389.90,
    isOffer: true,
    stock: 28,
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: true,
    tags: ['fone', 'bluetooth', 'anc', 'audio', 'headset'],
    specs: {
      'Autonomia': 'Até 45 horas de reprodução contínua',
      'Conexão': 'Bluetooth 5.3 + Cabo P2 3.5mm incluso',
      'Microfone': 'Duplo com cancelamento de eco ENC',
      'Drivers': '40mm Neodímio Hi-Res Audio'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Smartwatch SAT Chronos Gold Edition com Monitor Cardíaco',
    sku: 'SAT-WATCH-03',
    description: 'Relógio inteligente com caixa metálica dourada, pulseira magnética milanesa e mais de 100 modos esportivos.',
    detailedDescription: 'O SAT Chronos Gold Edition une a sofisticação da alta relojoaria clássica à tecnologia de sensores biométricos de ponta. Monitora frequência cardíaca 24h, oxigenação do sangue (SpO2), sono e recebe todas as notificações e chamadas telefônicas diretamente no seu pulso.',
    category: 'Smartwatches & Pulseiras',
    price: 599.90,
    promotionalPrice: 449.90,
    isOffer: true,
    stock: 20,
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: true,
    tags: ['smartwatch', 'relogio', 'saude', 'gold', 'fitness'],
    specs: {
      'Tela': '1.43" HD AMOLED Always-On Display',
      'Resistência': 'Resistente a respingos e suor IP67',
      'Bateria': 'Até 10 dias de uso moderado',
      'Compatibilidade': 'Android e iOS'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Carregador Turbo GaN SAT 65W Triplo Port (2x USB-C + 1x USB-A)',
    sku: 'SAT-POWER-04',
    description: 'Carregador ultrarrápido de Nitreto de Gálio (GaN), carrega notebook, tablet e smartphone simultaneamente.',
    detailedDescription: 'Tecnologia GaN de última geração: menor aquecimento, tamanho 40% mais compacto e eficiência energética superior. Suporta protocolos Power Delivery 3.0, Quick Charge 4+ e PPS.',
    category: 'Carregadores & Cabos',
    price: 189.90,
    promotionalPrice: 149.90,
    isOffer: false,
    stock: 45,
    mainImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: false,
    tags: ['carregador', 'turbo', 'gan', 'usb-c', 'power'],
    specs: {
      'Potência': '65W Max',
      'Entradas': '100-240V Bivolt Automático',
      'Portas': '2x USB-C Power Delivery + 1x USB-A QC 3.0'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Caixa de Som Portátil SAT SoundBoom 30W Bluetooth com LED',
    sku: 'SAT-SPEAKER-05',
    description: 'Som estéreo potente com radiadores passivos de graves, iluminação RGB dinâmica e proteção à prova d’água IPX7.',
    detailedDescription: 'Leve a festa para qualquer lugar com a SAT SoundBoom 30W. Bateria para até 16 horas de reprodução contínua, função TWS para parear duas caixas de som e criar um som surround estéreo 60W.',
    category: 'Áudio & Fones',
    price: 329.90,
    promotionalPrice: 259.90,
    isOffer: true,
    stock: 18,
    mainImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: true,
    tags: ['caixa de som', 'speaker', 'bluetooth', 'festa', 'grave'],
    specs: {
      'Potência RMS': '30W RMS Real',
      'Proteção': 'IPX7 (À prova d’água)',
      'Bateria': '4.400 mAh (até 16h)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Cabo Blindado SAT Kevlar Ultra Flex Type-C 100W (2 Metros)',
    sku: 'SAT-CABLE-06',
    description: 'Cabo USB-C para USB-C com revestimento em nylon trançado e fios de Kevlar resistente a mais de 30.000 dobras.',
    detailedDescription: 'O cabo definitivo para carregamento ultrarrápido de 100W e transferência de dados em alta velocidade. Conectores banhados com acabamento em liga de zinco e chip e-Marker inteligente integrado.',
    category: 'Carregadores & Cabos',
    price: 79.90,
    promotionalPrice: 49.90,
    isOffer: false,
    stock: 60,
    mainImage: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: false,
    tags: ['cabo', 'usb-c', 'reforcado', 'turbo', 'acessorio'],
    specs: {
      'Comprimento': '2 Metros',
      'Potência Máxima': '100W (20V/5A)',
      'Material': 'Nylon Trançado Reforçado + Liga de Zinco'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-007',
    name: 'Suporte Articulado SAT Pro Alumínio para Notebook e Tablet',
    sku: 'SAT-DESK-07',
    description: 'Suporte ergonômico 100% em liga de alumínio usinado CNC com múltiplos ajustes de altura e rotação 360°.',
    detailedDescription: 'Melhore sua postura e o resfriamento do seu computador com o Suporte SAT Pro. Estrutura sólida que suporta notebooks de até 17 polegadas, com almofadas de silicone anti-risco e furação para ventilação máxima.',
    category: 'Acessórios & Suportes',
    price: 159.90,
    promotionalPrice: 129.90,
    isOffer: false,
    stock: 22,
    mainImage: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: false,
    tags: ['suporte', 'mesa', 'ergonomia', 'setup', 'notebook'],
    specs: {
      'Material': 'Liga de Alumínio Anodizado',
      'Ajustes': '6 níveis de altura e rotação livre',
      'Capacidade': 'Até 10 kg de carga'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-008',
    name: 'Mouse Gamer Sem Fio SAT Apex RGB 16.000 DPI Sensor Óptico',
    sku: 'SAT-GAME-08',
    description: 'Mouse ultraleve (68g) com conexão tri-mode (2.4GHz, Bluetooth e Cabo), switches ópticos de 80M cliques.',
    detailedDescription: 'Precisão cirúrgica em jogos competitivos. O SAT Apex entrega tempo de resposta de 1ms, iluminação RGB customizável, patins 100% PTFE virgem para deslize suave e bateria recarregável com até 70h de duração.',
    category: 'Gamer & Periféricos',
    price: 279.90,
    promotionalPrice: 219.90,
    isOffer: true,
    stock: 14,
    mainImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop'
    ],
    isActive: true,
    isFeatured: true,
    tags: ['gamer', 'mouse', 'rgb', 'sem fio', 'periferico'],
    specs: {
      'Sensor': 'Sensor Óptico Pro 16.000 DPI',
      'Peso': '68 gramas (Ultra-leve)',
      'Switches': 'Ópticos durabilidade 80 milhões de cliques'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'PED-8941',
    customerName: 'Carlos Eduardo Mendes',
    customerPhone: '(82) 98844-2211',
    customerAddress: 'Rua das Palmeiras, 450 - Ponta Verde, Maceió/AL',
    customerNotes: 'Entregar no período da tarde, interfone 302.',
    items: [
      { product: DEFAULT_PRODUCTS[1], quantity: 1 },
      { product: DEFAULT_PRODUCTS[5], quantity: 2 }
    ],
    subtotal: 489.70,
    discount: 0,
    total: 489.70,
    paymentMethod: 'whatsapp',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'PED-8942',
    customerName: 'Mariana Silveira Ramos',
    customerPhone: '(82) 99123-5566',
    customerAddress: 'Av. Fernandes Lima, 1200 - Farol, Maceió/AL',
    items: [
      { product: DEFAULT_PRODUCTS[2], quantity: 1 }
    ],
    subtotal: 449.90,
    discount: 0,
    total: 449.90,
    paymentMethod: 'pix',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];

class DatabaseService {
  // Products
  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return DEFAULT_PRODUCTS;
      return parsed.map((p) => ({
        ...p,
        id: String(p.id || 'prod-' + Math.random().toString(36).substr(2, 9)),
        name: String(p.name || 'Produto'),
        sku: String(p.sku || 'SKU-001'),
        category: String(p.category || 'Geral'),
        price: typeof p.price === 'number' && !isNaN(p.price) ? p.price : 0,
        promotionalPrice: typeof p.promotionalPrice === 'number' && !isNaN(p.promotionalPrice) ? p.promotionalPrice : undefined,
        stock: typeof p.stock === 'number' && !isNaN(p.stock) ? p.stock : 0,
        description: String(p.description || ''),
        detailedDescription: String(p.detailedDescription || p.description || ''),
        isActive: p.isActive ?? true,
        isFeatured: p.isFeatured ?? false,
        isOffer: p.isOffer ?? false,
        tags: Array.isArray(p.tags) ? p.tags : ['eletronicos'],
        mainImage: String(p.mainImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'),
        gallery: Array.isArray(p.gallery) ? p.gallery : (p.mainImage ? [p.mainImage] : []),
        specs: p.specs && typeof p.specs === 'object' ? p.specs : {},
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      }));
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  saveProducts(products: Product[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return true;
    } catch (error) {
      console.error('Erro ao persistir produtos no LocalStorage:', error);
      // If quota exceeded, try removing base64 overhead or large caches if needed
      return false;
    }
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updated = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updated;
    this.saveProducts(products);
    return updated;
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    this.saveProducts(filtered);
    return true;
  }

  deleteMultipleProducts(ids: string[]): number {
    const idSet = new Set(ids);
    const products = this.getProducts();
    const filtered = products.filter(p => !idSet.has(p.id));
    const deletedCount = products.length - filtered.length;
    this.saveProducts(filtered);
    return deletedCount;
  }

  deleteProductsByCategory(categoryName: string): number {
    const products = this.getProducts();
    const target = categoryName.toLowerCase().trim();
    const filtered = products.filter(p => p.category.toLowerCase().trim() !== target);
    const deletedCount = products.length - filtered.length;
    this.saveProducts(filtered);
    return deletedCount;
  }

  // Categories
  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return DEFAULT_CATEGORIES;
      return parsed.map((c, index) => ({
        ...c,
        id: String(c.id || 'cat-' + Math.random().toString(36).substr(2, 9)),
        name: String(c.name || 'Categoria'),
        slug: String(c.slug || (c.name ? c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : `cat-${index}`)),
        image: String(c.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?q=80&w=800&auto=format&fit=crop'),
        icon: String(c.icon || 'Grid'),
        order: typeof c.order === 'number' ? c.order : index,
        isActive: c.isActive ?? true,
      }));
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...category,
      id: 'cat-' + Math.random().toString(36).substr(2, 9),
    };
    categories.push(newCat);
    this.saveCategories(categories);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    this.saveCategories(categories);
    return categories[index];
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    this.saveCategories(categories.filter(c => c.id !== id));
    return true;
  }

  // Banners
  getBanners(): Banner[] {
    const data = localStorage.getItem(STORAGE_KEYS.BANNERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(DEFAULT_BANNERS));
      return DEFAULT_BANNERS;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return DEFAULT_BANNERS;
      return parsed.map((b, index) => ({
        ...b,
        id: String(b.id || 'ban-' + (Date.now() + index)),
        title: String(b.title || 'SAT LOJA'),
        subtitle: String(b.subtitle || ''),
        image: String(b.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1600&auto=format&fit=crop'),
        buttonText: String(b.buttonText || 'VER PRODUTOS'),
        link: String(b.link || '#catalogo'),
        order: typeof b.order === 'number' ? b.order : index,
        isActive: b.isActive ?? true,
      }));
    } catch {
      return DEFAULT_BANNERS;
    }
  }

  saveBanners(banners: Banner[]): void {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  }

  addBanner(banner: Omit<Banner, 'id'>): Banner {
    const banners = this.getBanners();
    const newBanner: Banner = {
      ...banner,
      id: 'ban-' + Date.now(),
    };
    banners.push(newBanner);
    this.saveBanners(banners);
    return newBanner;
  }

  updateBanner(id: string, updated: Partial<Banner>): Banner | null {
    const banners = this.getBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) return null;
    banners[index] = { ...banners[index], ...updated };
    this.saveBanners(banners);
    return banners[index];
  }

  deleteBanner(id: string): boolean {
    const banners = this.getBanners();
    const filtered = banners.filter((b) => b.id !== id);
    if (filtered.length === banners.length) return false;
    this.saveBanners(filtered);
    return true;
  }

  // Settings
  getSettings(): StoreSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: Partial<StoreSettings>): StoreSettings {
    let current: StoreSettings = DEFAULT_SETTINGS;
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      try {
        current = { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      } catch {
        current = DEFAULT_SETTINGS;
      }
    }
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    return this.saveSettings(settings);
  }

  // Sections
  getSections(): SiteSectionsConfig {
    const data = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(DEFAULT_SECTIONS));
      return DEFAULT_SECTIONS;
    }
    try {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SECTIONS, ...parsed };
    } catch {
      return DEFAULT_SECTIONS;
    }
  }

  saveSections(sections: SiteSectionsConfig): void {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  }

  // Orders
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return DEFAULT_ORDERS;
      return parsed
        .filter((o) => o && typeof o === 'object')
        .map((o) => ({
          ...o,
          id: String(o.id || 'PED-' + Math.floor(1000 + Math.random() * 9000)),
          customerName: String(o.customerName || 'Cliente'),
          customerPhone: String(o.customerPhone || ''),
          customerAddress: String(o.customerAddress || ''),
          customerNotes: String(o.customerNotes || ''),
          items: Array.isArray(o.items)
            ? o.items
                .filter((item: any) => item && item.product && typeof item.product === 'object')
                .map((item: any) => ({
                  product: {
                    ...item.product,
                    id: String(item.product.id || 'prod-0'),
                    name: String(item.product.name || 'Produto'),
                    sku: String(item.product.sku || 'SKU-000'),
                    category: String(item.product.category || 'Geral'),
                    price: typeof item.product.price === 'number' && !isNaN(item.product.price) ? item.product.price : 0,
                    promotionalPrice: typeof item.product.promotionalPrice === 'number' && !isNaN(item.product.promotionalPrice) ? item.product.promotionalPrice : undefined,
                    stock: typeof item.product.stock === 'number' ? item.product.stock : 0,
                    mainImage: String(item.product.mainImage || ''),
                    tags: Array.isArray(item.product.tags) ? item.product.tags : [],
                    gallery: Array.isArray(item.product.gallery) ? item.product.gallery : [],
                    specs: item.product.specs && typeof item.product.specs === 'object' ? item.product.specs : {},
                  },
                  quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
                }))
            : [],
          subtotal: typeof o.subtotal === 'number' && !isNaN(o.subtotal) ? o.subtotal : 0,
          discount: typeof o.discount === 'number' && !isNaN(o.discount) ? o.discount : 0,
          total: typeof o.total === 'number' && !isNaN(o.total) ? o.total : 0,
          paymentMethod: o.paymentMethod || 'whatsapp',
          status: o.status || 'pending',
          createdAt: o.createdAt || new Date().toISOString(),
        }));
    } catch {
      return DEFAULT_ORDERS;
    }
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  addOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: 'PED-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      this.saveOrders(orders);
    }
  }

  updateOrder(orderId: string, updated: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    orders[index] = { ...orders[index], ...updated };
    this.saveOrders(orders);
    return orders[index];
  }

  deleteOrder(orderId: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    if (filtered.length === orders.length) return false;
    this.saveOrders(filtered);
    return true;
  }

  // Cart
  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && item.product && typeof item.product === 'object' && item.product.id)
        .map((item) => ({
          product: {
            ...item.product,
            id: String(item.product.id),
            name: String(item.product.name || 'Produto'),
            sku: String(item.product.sku || 'SKU-000'),
            category: String(item.product.category || 'Geral'),
            price: typeof item.product.price === 'number' && !isNaN(item.product.price) ? item.product.price : 0,
            promotionalPrice: typeof item.product.promotionalPrice === 'number' && !isNaN(item.product.promotionalPrice) ? item.product.promotionalPrice : undefined,
            stock: typeof item.product.stock === 'number' ? item.product.stock : 99,
            mainImage: String(item.product.mainImage || ''),
            tags: Array.isArray(item.product.tags) ? item.product.tags : [],
            gallery: Array.isArray(item.product.gallery) ? item.product.gallery : [],
            specs: item.product.specs && typeof item.product.specs === 'object' ? item.product.specs : {},
          },
          quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
        }));
    } catch {
      return [];
    }
  }

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  addToCart(product: Product, quantity = 1): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    this.saveCart(cart);
    return cart;
  }

  updateCartItemQuantity(productId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.product.id !== productId);
    } else {
      const index = cart.findIndex((item) => item.product.id === productId);
      if (index > -1) {
        cart[index].quantity = quantity;
      }
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    this.saveCart(cart);
    return cart;
  }

  clearCart(): CartItem[] {
    this.saveCart([]);
    return [];
  }

  // Admin Auth (demo/local storage session)
  isAdminAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  setAdminAuthenticated(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, status ? 'true' : 'false');
  }

  getAdminUser(): AdminUser {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    if (!data) {
      const defaultAdmin: AdminUser = {
        username: 'admin',
        email: 'satloja2026@gmail.com',
        name: 'Administrador SAT LOJA',
      };
      return defaultAdmin;
    }
    try {
      return JSON.parse(data);
    } catch {
      return { username: 'admin', email: 'satloja2026@gmail.com', name: 'Administrador SAT LOJA' };
    }
  }

  saveAdminUser(user: AdminUser): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user));
  }

  // Full Backup Export / Restore
  exportFullBackup(): string {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      storeName: 'SAT LOJA',
      products: this.getProducts(),
      categories: this.getCategories(),
      banners: this.getBanners(),
      settings: this.getSettings(),
      sections: this.getSections(),
      orders: this.getOrders(),
    };
    return JSON.stringify(backup, null, 2);
  }

  restoreFullBackup(jsonContent: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonContent);
      if (data.products && Array.isArray(data.products)) {
        this.saveProducts(data.products);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.saveCategories(data.categories);
      }
      if (data.banners && Array.isArray(data.banners)) {
        this.saveBanners(data.banners);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      if (data.sections) {
        this.saveSections(data.sections);
      }
      if (data.orders && Array.isArray(data.orders)) {
        this.saveOrders(data.orders);
      }
      return { success: true, message: 'Backup restaurado com sucesso!' };
    } catch (e: any) {
      return { success: false, message: 'Arquivo de backup inválido: ' + (e.message || 'erro desconhecido') };
    }
  }

  resetToDefault(): void {
    localStorage.clear();
    this.saveProducts(DEFAULT_PRODUCTS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveBanners(DEFAULT_BANNERS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveSections(DEFAULT_SECTIONS);
    this.saveOrders(DEFAULT_ORDERS);
  }

  resetToDefaults(): void {
    this.resetToDefault();
  }
}

export const db = new DatabaseService();
