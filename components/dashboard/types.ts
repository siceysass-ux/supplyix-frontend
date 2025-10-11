// Fix: Removed self-import which caused conflicts with local declarations.
// Product-related types
export interface Price {
  min: number;
  max: number;
}

export interface VariationOption {
  name: string;
  value: string;
  image?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Variation {
  type: string;
  options: VariationOption[];
}

export interface ProductVariant {
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  shippingCostModifier: number;
}

export interface Product {
  name: string;
  sku: string;
  images: string[];
  category: string;
  subcategory: string;
  tags: string[];
  price: Price;
  isFavorite: boolean;
  description: string;
  variations?: Variation[];
  variants: ProductVariant[];
  shippingInfo: {
    weight: string;
    dimensions: string;
    shippingCosts: {
      eu: number;
      usa: number;
    };
  };
}

// Cart-related types
export interface CartItem {
  id: string; // Composite ID of variant SKU and destination
  product: Product;
  variant: ProductVariant;
  quantity: number;
  destination: 'eu' | 'usa';
}


// Order-related types
export type OrderStatus = 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal';

export interface OrderProduct {
    name: string;
    quantity: number;
    price: string;
    variationDetails: string;
    destination: 'eu' | 'usa';
}

export interface Order {
    id: string;
    creationDate: string; // YYYY-MM-DD
    customer: string;
    total: string;
    subtotal: string;
    shippingTotal: string;
    status: OrderStatus;
    products: OrderProduct[];
    address: string;
    trackingNumber?: string;
}

// Request-related types
export type RequestType = 'Tedarik' | 'Danışmanlık';
export type RequestStatus = 'Bekliyor' | 'Tamamlandı';
export type RequestResult = 'Başarılı' | 'Başarısız' | null;

export interface Request {
    id: string;
    type: RequestType;
    title: string;
    updated: string;
    status: RequestStatus;
    result: RequestResult;
    explanation: string;
    response?: string;
}

// Fee-related types
export interface ExtraFee {
    id: string;
    item: string;
    description: string;
    amount: string;
    date: string;
    status: 'Ödendi' | 'Beklemede';
}

// Support-related types
export interface ChatMessage {
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}

export type ConversationStatus = 'active' | 'archived' | 'spam';

export interface Conversation {
  id: string; // Corresponds to userId
  userName: string;
  userAvatar: string;
  messages: ChatMessage[];
  status: ConversationStatus;
  isRead: boolean;
  lastMessageTimestamp: string;
}


// Initial Data
export const initialProducts: Product[] = [
  {
    name: 'Ergonomik Ofis Sandalyesi',
    sku: 'CHR-001',
    images: ['https://picsum.photos/seed/chair1/800/800', 'https://picsum.photos/seed/chair2/800/800', 'https://picsum.photos/seed/chair3/800/800'],
    category: 'Ev & Yaşam',
    subcategory: 'Ofis Mobilyaları',
    tags: ['ofis', 'sandalye', 'ergonomik'],
    price: { min: 120.00, max: 135.00 },
    isFavorite: true,
    description: `Tüm gün konfor için tasarlanmış, ayarlanabilir özelliklere sahip modern ve ergonomik ofis sandalyesi.
- Ayarlanabilir bel desteği
- Nefes alabilen file sırtlık
- 360 derece dönebilen tekerlekler`,
    variations: [
      {
        type: 'Renk',
        options: [
          { name: 'Siyah', value: '#000000', price: 120.00, stock: 75, sku: 'BLK' },
          { name: 'Gri', value: '#808080', price: 125.00, stock: 40, sku: 'GRY' },
          { name: 'Beyaz', value: '#FFFFFF', price: 135.00, stock: 22, sku: 'WHT' },
        ]
      }
    ],
    variants: [
      { sku: 'CHR-001-BLK', attributes: { 'Renk': 'Siyah' }, price: 120.00, stock: 75, shippingCostModifier: 0 },
      { sku: 'CHR-001-GRY', attributes: { 'Renk': 'Gri' }, price: 125.00, stock: 40, shippingCostModifier: 0 },
      { sku: 'CHR-001-WHT', attributes: { 'Renk': 'Beyaz' }, price: 135.00, stock: 22, shippingCostModifier: 0 },
    ],
    shippingInfo: { weight: '15kg', dimensions: '60x60x90cm', shippingCosts: { eu: 20.00, usa: 35.00 } },
  },
   {
    name: 'Kablosuz Gürültü Engelleme Kulaklık',
    sku: 'HDPH-002',
    images: ['https://picsum.photos/seed/headphone1/800/800', 'https://picsum.photos/seed/headphone2/800/800'],
    category: 'Elektronik',
    subcategory: 'Ses Sistemleri',
    tags: ['kulaklık', 'bluetooth', 'gürültü engelleme'],
    price: { min: 99.99, max: 99.99 },
    isFavorite: false,
    description: `Kristal netliğinde ses kalitesi ve üstün gürültü engelleme özelliğiyle müzik ve aramalarda sürükleyici bir deneyim.
- 30 saate varan pil ömrü
- Dahili mikrofon
- Taşıma çantası dahil`,
    variants: [
       { sku: 'HDPH-002-BLK', attributes: { 'Renk': 'Siyah' }, price: 99.99, stock: 150, shippingCostModifier: 0 },
    ],
    shippingInfo: { weight: '0.8kg', dimensions: '20x18x10cm', shippingCosts: { eu: 10.00, usa: 15.00 } },
  },
  // Add more products...
];

export const initialOrders: Order[] = [
    { id: '#S001', creationDate: '2025-10-12', customer: 'Ahmet Yılmaz', total: '$67.50', subtotal: '$55.00', shippingTotal: '$12.50', status: 'Teslim Edildi', products: [{ name: 'Akıllı Saat Kordonu', quantity: 1, price: '$55.00', variationDetails: 'Silikon - Gece Mavisi', destination: 'eu' }], address: '123 Örnek Cad, İstanbul, Türkiye', trackingNumber: 'TR123456789' },
    { id: '#S002', creationDate: '2025-10-11', customer: 'Ayşe Kaya', total: '$140.00', subtotal: '$120.00', shippingTotal: '$20.00', status: 'Kargoda', products: [{ name: 'Ergonomik Ofis Sandalyesi', quantity: 1, price: '$120.00', variationDetails: 'Siyah', destination: 'eu' }], address: '456 Test Sok, Ankara, Türkiye', trackingNumber: 'TR987654321' },
    { id: '#S003', creationDate: '2025-10-10', customer: 'Ahmet Yılmaz', total: '$114.99', subtotal: '$99.99', shippingTotal: '$15.00', status: 'Hazırlanıyor', products: [{ name: 'Kablosuz Gürültü Engelleme Kulaklık', quantity: 1, price: '$99.99', variationDetails: 'Siyah', destination: 'usa' }], address: '789 Elm St, New York, USA' },
];

export const initialRequests: Request[] = [
    { id: '#T001', type: 'Tedarik', title: 'Ahşap Telefon Standı', updated: '10.10.2025', status: 'Tamamlandı', result: 'Başarılı', explanation: 'Minimalist tasarımlı, kayın ağacından yapılmış bir telefon standı arıyorum.' },
    { id: '#D001', type: 'Danışmanlık', title: 'Facebook Reklam Stratejileri', updated: '08.10.2025', status: 'Bekliyor', result: null, explanation: 'Yeni ürün lansmanım için Facebook ve Instagram reklamları konusunda bir strateji danışmanlığına ihtiyacım var.' },
];

export const initialFees: ExtraFee[] = [
    { id: 'FEE001', item: 'Logo Tasarımı', description: 'Yeni mağaza için özel logo tasarımı hizmeti.', amount: '$75.00', date: '05.10.2025', status: 'Ödendi' },
    { id: 'FEE002', item: 'Ürün Fotoğraf Çekimi', description: '3 adet ürün için profesyonel stüdyo çekimi.', amount: '$150.00', date: '02.10.2025', status: 'Beklemede' },
];

export const initialConversations: Conversation[] = [
    {
        id: 'user-1',
        userName: 'Ahmet Yılmaz',
        userAvatar: 'https://i.pravatar.cc/150?u=supplyix',
        status: 'active',
        isRead: true,
        lastMessageTimestamp: new Date().toISOString(),
        messages: [
            {
                sender: 'support',
                text: 'Merhaba! Supplyix Destek Hattı\'na hoş geldiniz. Size nasıl yardımcı olabilirim?',
                timestamp: new Date(Date.now() - 120000).toLocaleString('tr-TR')
            },
            {
                sender: 'user',
                text: 'Merhaba, kargo ücretleri hakkında bilgi almak istiyorum.',
                timestamp: new Date(Date.now() - 60000).toLocaleString('tr-TR')
            },
            {
                sender: 'support',
                text: 'Elbette. Kargo ücretlerimiz ürünün ağırlığına, boyutlarına ve gönderileceği ülkeye (EU/USA) göre değişiklik göstermektedir. İlgilendiğiniz ürünün detay sayfasında bu maliyetleri görebilirsiniz.',
                timestamp: new Date().toLocaleString('tr-TR')
            },
        ],
    },
    {
        id: 'user-2',
        userName: 'Ayşe Kaya',
        userAvatar: 'https://i.pravatar.cc/150?u=ayse',
        status: 'active',
        isRead: false,
        lastMessageTimestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        messages: [
            {
                sender: 'user',
                text: 'Bir siparişimle ilgili sorun yaşıyorum. Sipariş numaram #S002.',
                timestamp: new Date(Date.now() - 5 * 60000).toLocaleString('tr-TR')
            }
        ]
    },
    {
        id: 'user-3',
        userName: 'Mehmet Çelik',
        userAvatar: 'https://i.pravatar.cc/150?u=mehmet',
        status: 'archived',
        isRead: true,
        lastMessageTimestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        messages: [
            {
                sender: 'user',
                text: 'Teşekkür ederim, sorunum çözüldü.',
                timestamp: new Date(Date.now() - 24 * 3600 * 1000).toLocaleString('tr-TR')
            }
        ]
    }
];