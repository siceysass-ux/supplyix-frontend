// FIX: Import React to resolve "Cannot find namespace 'React'" error.
import React from 'react';
import { HomeIcon as DuotoneHomeIcon, CubeIcon as DuotoneCubeIcon, DocumentTextIcon as DuotoneDocumentTextIcon, ShoppingCartIcon as DuotoneShoppingCartIcon, StarIcon, BanknotesIcon, SupportIcon } from './icons/duotone';
import { HomeIcon, UsersIcon, CubeIcon, ShoppingCartIcon, DocumentTextIcon, Squares2X2Icon, BellIcon, Cog6ToothIcon, PencilIcon, CurrencyDollarIcon } from './icons/outline';


// --- INTERFACES ---

export interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

export interface Plan {
  name: string;
  price: number;
  durationText: string;
  popular?: boolean;
  buttonText: string;
}

export interface EventPopup {
    enabled: boolean;
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
}

export interface InfluencerCode {
    id: string;
    code: string;
}

export interface Price {
    min: number;
    max: number;
}

export interface ShippingInfo {
    weight: string;
    dimensions: string;
    shippingCosts: {
        eu: number;
        usa: number;
    };
}

export interface VariationOption {
    name: string;
    value: string; // e.g., hex code for color, or name for size
    image?: string; // Optional image for this specific option
    price: number;
    stock: number;
    sku?: string;
}

export interface Variation {
    type: string; // 'Renk', 'Beden', etc.
    options: VariationOption[];
}

export interface ProductVariant {
    sku: string;
    attributes: Record<string, string>; // e.g., { "Renk": "Siyah", "Beden": "M" }
    price: number;
    stock: number;
    shippingCostModifier: number; // Can be positive or negative
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
    isPOD: boolean;
    variations?: Variation[];
    variants: ProductVariant[];
    shippingInfo: ShippingInfo;
}

export interface CartItem {
    id: string; // Composite ID like productSku-variantSku-destination
    product: Product;
    variant: ProductVariant;
    quantity: number;
    destination: 'eu' | 'usa';
    podFile?: File;
}

export interface ShippingAddress {
    consignee: string;
    address: string;
    address2?: string;
    city: string;
    province?: string;
    postcode: string;
    country: string;
    phone?: string;
    email?: string;
}

export interface OrderProduct {
    name: string;
    variationDetails: string;
    quantity: number;
    price: string;
    destination: 'eu' | 'usa';
    podFileUrl?: string;
    podFileName?: string;
}

export type OrderStatus = 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal';

export interface Order {
    id: string;
    creationDate: string; // YYYY-MM-DD
    status: OrderStatus;
    shippingAddress: ShippingAddress;
    products: OrderProduct[];
    subtotal: string;
    shippingTotal: string;
    total: string;
    shippingCarrier?: string;
    trackingNumber?: string;
}

export type RequestType = 'Tedarik' | 'Danışmanlık';
export type RequestStatus = 'Bekliyor' | 'Tamamlandı';
export type RequestResult = 'Başarılı' | 'Başarısız' | null;

export interface Request {
    id: string;
    type: RequestType;
    updated: string;
    status: RequestStatus;
    result: RequestResult;
    title?: string; // For 'Danışmanlık'
    productName?: string; // For 'Tedarik'
    imageUrls?: string[]; // For 'Tedarik'
    referenceLink?: string; // For 'Tedarik'
    explanation: string;
    response?: string;
    // User info
    userName: string;
    userEmail: string;
}

export interface ExtraFee {
    id: string;
    userId: string;
    item: string;
    description: string;
    amount: string;
    date: string;
    status: 'Ödendi' | 'Beklemede';
}

export interface ChatMessage {
    sender: 'user' | 'support';
    text: string;
    timestamp: string; // ISO string
}

export type ConversationStatus = 'active' | 'archived' | 'spam';

export interface Conversation {
    id: string;
    userName: string;
    userAvatar: string;
    lastMessageTimestamp: string;
    isRead: boolean;
    status: ConversationStatus;
    messages: ChatMessage[];
}

export interface Announcement {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'primary' | 'blue' | 'green';
}

export interface FavoriteCategory {
    id: string;
    name: string;
    productNames: string[];
}


// --- INITIAL MOCK DATA ---

export const initialMainNavItems: NavItem[] = [
    { name: 'Panel Ana Sayfa', path: '/dashboard', icon: DuotoneHomeIcon },
    { name: 'Tedarik Havuzu', path: '/dashboard/sourcing-pool', icon: DuotoneCubeIcon },
    { name: 'Siparişlerim', path: '/dashboard/orders', icon: DuotoneDocumentTextIcon },
    { name: 'Sepetim', path: '/dashboard/cart', icon: DuotoneShoppingCartIcon },
    { name: 'Favorilerim', path: '/dashboard/favorites', icon: StarIcon },
    { name: 'Taleplerim', path: '/dashboard/requests', icon: DuotoneDocumentTextIcon },
    { name: 'Ek Ücretler', path: '/dashboard/extra-fees', icon: BanknotesIcon },
];

export const initialAdminNavItems: NavItem[] = [
    { name: 'Admin Ana Sayfa', path: '/admin/home', icon: HomeIcon },
    { name: 'Kullanıcıları Yönet', path: '/admin/users', icon: UsersIcon },
    { name: 'Ürünleri Yönet', path: '/admin/products', icon: CubeIcon },
    { name: 'Siparişleri Yönet', path: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Talepleri Yönet', path: '/admin/requests', icon: DocumentTextIcon },
    { name: 'Destek Yönetimi', path: '/admin/support', icon: SupportIcon },
    { name: 'Kategorileri Yönet', path: '/admin/categories', icon: Squares2X2Icon },
    { name: 'Ek Ücretleri Yönet', path: '/admin/extra-fees', icon: CurrencyDollarIcon },
    { name: 'Duyuruları Yönet', path: '/admin/announcements', icon: BellIcon },
    { name: 'Site Ayarları', path: '/admin/settings', icon: Cog6ToothIcon },
];


export const initialPlans: Plan[] = [
    { name: '7 Günlük Deneme', price: 1, durationText: '/ 7 gün', buttonText: 'Denemeye Başla' },
    { name: '1 Ay', price: 10, durationText: '/ aylık', popular: true, buttonText: 'Planı Seç' },
    { name: '6 Ay', price: 50, durationText: '/ 6 aylık', buttonText: 'Planı Seç' },
    { name: '1 Sene', price: 100, durationText: '/ yıllık', buttonText: 'Planı Seç' },
];

export const initialEventPopup: EventPopup = {
    enabled: true,
    title: "Yıl Sonu İndirimi!",
    description: "Tüm yıllık planlarda %25 indirim fırsatını kaçırmayın. Sınırlı süreli teklif!",
    imageUrl: "https://picsum.photos/seed/promo/600/300",
    ctaText: "İndirimi Gör",
    ctaLink: "#pricing"
};

export const initialInfluencerCodes: InfluencerCode[] = [
    { id: 'inf-1', code: 'INFLUENCER-10' },
    { id: 'inf-2', code: 'PROMO-2025' },
];

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
        isPOD: false,
        description: `Tüm gün konfor için tasarlanmış ergonomik ofis sandalyesi.
- Ayarlanabilir bel desteği
- Nefes alabilen file sırtlık
- 4D ayarlanabilir kolçaklar`,
        variations: [
            { type: 'Renk', options: [
                { name: 'Siyah', value: '#000000', price: 120, stock: 50, sku: 'BLK' },
                { name: 'Gri', value: '#808080', price: 125, stock: 30, sku: 'GRY' },
            ]},
            { type: 'Malzeme', options: [
                { name: 'Kumaş', value: 'Kumaş', price: 0, stock: 100, sku: 'FAB' },
                { name: 'Deri', value: 'Deri', price: 10, stock: 100, sku: 'LTH' },
            ]}
        ],
        variants: [
            { sku: 'CHR-001-BLK-FAB', attributes: { 'Renk': 'Siyah', 'Malzeme': 'Kumaş' }, price: 120.00, stock: 50, shippingCostModifier: 0 },
            { sku: 'CHR-001-BLK-LTH', attributes: { 'Renk': 'Siyah', 'Malzeme': 'Deri' }, price: 130.00, stock: 20, shippingCostModifier: 5 },
            { sku: 'CHR-001-GRY-FAB', attributes: { 'Renk': 'Gri', 'Malzeme': 'Kumaş' }, price: 125.00, stock: 30, shippingCostModifier: 0 },
            { sku: 'CHR-001-GRY-LTH', attributes: { 'Renk': 'Gri', 'Malzeme': 'Deri' }, price: 135.00, stock: 15, shippingCostModifier: 5 },
        ],
        shippingInfo: { weight: '15kg', dimensions: '60x60x90cm', shippingCosts: { eu: 15.00, usa: 35.00 } },
    },
    {
        name: 'Özelleştirilebilir T-Shirt',
        sku: 'TSH-POD-01',
        images: ['https://picsum.photos/seed/tshirt1/800/800', 'https://picsum.photos/seed/tshirt2/800/800'],
        category: 'Giyim',
        subcategory: 'Unisex',
        tags: ['t-shirt', 'giyim', 'pod'],
        price: { min: 15.00, max: 18.00 },
        isFavorite: false,
        isPOD: true,
        description: `Yüksek kaliteli pamuklu, kendi tasarımınızı yükleyebileceğiniz t-shirt.
- %100 Pamuk
- Modern kesim
- Dayanıklı baskı`,
        variations: [
            { type: 'Renk', options: [
                { name: 'Beyaz', value: '#FFFFFF', price: 15, stock: 1000, sku: 'WHT' },
                { name: 'Siyah', value: '#000000', price: 16, stock: 1000, sku: 'BLK' },
            ]},
            { type: 'Beden', options: ['S', 'M', 'L', 'XL'].map(s => ({ name: s, value: s, price: s === 'XL' ? 2 : 0, stock: 1000, sku: s })) },
        ],
        variants: [
            { sku: 'TSH-POD-01-WHT-S', attributes: { Renk: 'Beyaz', Beden: 'S' }, price: 15.00, stock: 1000, shippingCostModifier: 0 },
            { sku: 'TSH-POD-01-WHT-M', attributes: { Renk: 'Beyaz', Beden: 'M' }, price: 15.00, stock: 1000, shippingCostModifier: 0 },
            { sku: 'TSH-POD-01-BLK-L', attributes: { Renk: 'Siyah', Beden: 'L' }, price: 16.00, stock: 1000, shippingCostModifier: 0 },
            { sku: 'TSH-POD-01-BLK-XL', attributes: { Renk: 'Siyah', Beden: 'XL' }, price: 18.00, stock: 1000, shippingCostModifier: 0.5 },
        ],
        shippingInfo: { weight: '0.3kg', dimensions: '30x20x3cm', shippingCosts: { eu: 5.00, usa: 10.00 } },
    },
    {
        name: 'Akıllı Saat',
        sku: 'WTCH-01',
        images: ['https://picsum.photos/seed/watch01/800/800'],
        category: 'Elektronik',
        subcategory: 'Giyilebilir Teknoloji',
        tags: ['saat', 'akıllı', 'teknoloji'],
        price: { min: 89.90, max: 89.90 },
        isFavorite: true,
        isPOD: false,
        description: 'Tüm bildirimlerinizi takip edin, sağlığınızı izleyin.',
        variants: [{ sku: 'WTCH-01', attributes: {}, price: 89.90, stock: 150, shippingCostModifier: 0 }],
        shippingInfo: { weight: '0.5kg', dimensions: '10x10x10cm', shippingCosts: { eu: 8.00, usa: 15.00 } },
    },
];

const defaultShippingAddress: ShippingAddress = {
    consignee: 'Ahmet Yılmaz', address: 'Örnek Mah. Test Sk. No:12 D:3', city: 'İstanbul', country: 'Turkey', postcode: '34000', email: 'ahmet@sirket.com', phone: '555-123-4567'
};

export const initialOrders: Order[] = [
    { id: '#S001', creationDate: '2025-10-10', status: 'Teslim Edildi', shippingAddress: defaultShippingAddress, products: [{ name: 'Ergonomik Ofis Sandalyesi', variationDetails: 'Siyah, Deri', quantity: 1, price: '$130.00', destination: 'eu' }], subtotal: '$130.00', shippingTotal: '$20.00', total: '$150.00', shippingCarrier: 'UPS', trackingNumber: '1Z9999999999999999' },
    { id: '#S002', creationDate: '2025-10-11', status: 'Kargoda', shippingAddress: {...defaultShippingAddress, consignee: 'Ayşe Kaya'}, products: [{ name: 'Akıllı Saat', variationDetails: '', quantity: 2, price: '$179.80', destination: 'usa' }], subtotal: '$179.80', shippingTotal: '$15.00', total: '$194.80', shippingCarrier: 'FedEx', trackingNumber: '999999999999' },
    { id: '#S003', creationDate: '2025-10-12', status: 'Hazırlanıyor', shippingAddress: defaultShippingAddress, products: [{ name: 'Ergonomik Ofis Sandalyesi', variationDetails: 'Gri, Kumaş', quantity: 1, price: '$125.00', destination: 'eu' }], subtotal: '$125.00', shippingTotal: '$15.00', total: '$140.00' },
    { id: '#S004', creationDate: '2025-10-13', status: 'Beklemede', shippingAddress: defaultShippingAddress, products: [{ name: 'Özelleştirilebilir T-Shirt', variationDetails: 'Beyaz, M', quantity: 1, price: '$15.00', destination: 'eu', podFileUrl: '/logo.png', podFileName: 'musteri_tasarimi.png' }], subtotal: '$15.00', shippingTotal: '$5.00', total: '$20.00' },
];

export const initialRequests: Request[] = [
    { id: '#T001', type: 'Tedarik', updated: '10.10.2025', status: 'Tamamlandı', result: 'Başarılı', productName: 'Ahşap Telefon Standı', explanation: 'Bambu malzemeden yapılmış, şık bir telefon standı arıyorum.', userName: 'Ahmet Yılmaz', userEmail: 'ahmet@sirket.com' },
    { id: '#D001', type: 'Danışmanlık', updated: '09.10.2025', status: 'Bekliyor', result: null, title: 'Reklam Stratejileri', explanation: 'Facebook reklamları için hedef kitle belirleme konusunda yardıma ihtiyacım var.', userName: 'Ahmet Yılmaz', userEmail: 'ahmet@sirket.com' },
];

export const initialFees: ExtraFee[] = [
    { id: 'fee-1', userId: 'user-1', item: 'Logo Tasarımı', description: 'Yeni mağaza için özel logo tasarımı hizmeti.', amount: '$50.00', date: '2025-10-08', status: 'Ödendi' },
    { id: 'fee-2', userId: 'user-2', item: 'Ek Depolama Alanı', description: 'POD ürünleri için ek 10GB bulut depolama.', amount: '$5.00', date: '2025-10-11', status: 'Beklemede' },
];

export const initialConversations: Conversation[] = [
    {
        id: 'conv-1',
        userName: 'Ahmet Yılmaz',
        userAvatar: 'https://i.pravatar.cc/150?u=ahmet',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isRead: false,
        status: 'active',
        messages: [
            { sender: 'user', text: 'Merhaba, kargo ücretleri hakkında bir sorum vardı.', timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
            { sender: 'support', text: 'Elbette, nasıl yardımcı olabilirim?', timestamp: new Date(Date.now() - 1000 * 60 * 5.5).toISOString() },
            { sender: 'user', text: 'Amerika gönderimlerinde ek gümrük vergisi oluyor mu?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        ]
    },
    {
        id: 'conv-2',
        userName: 'Ayşe Kaya',
        userAvatar: 'https://i.pravatar.cc/150?u=ayse',
        lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: true,
        status: 'active',
        messages: [{ sender: 'user', text: 'Teşekkür ederim, sorunum çözüldü.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }]
    }
];

export const initialAnnouncements: Announcement[] = [
    { id: 'ann-1', title: 'Yeni Özellik: Kategori Yönetimi', description: 'Favori ürünlerinizi artık özel kategoriler altında gruplayabilirsiniz.', date: '10.10.2025', type: 'green' },
    { id: 'ann-2', title: 'Sistem Güncellemesi', description: 'Performans iyileştirmeleri ve hata düzeltmeleri yapıldı.', date: '08.10.2025', type: 'blue' },
    { id: 'ann-3', title: 'Önemli Hatırlatma', description: 'Danışmanlık taleplerinize en geç 24 saat içinde yanıt verilecektir.', date: '05.10.2025', type: 'primary' },
];