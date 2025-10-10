export type Price = number | { min: number; max: number };

export interface VariationOption {
    name: string;
    image?: string; // Optional image specific to this variation option
    value?: string; // For color hex codes, etc.
}

export interface Variation {
    type: string; // e.g., "Renk", "Boyut"
    options: VariationOption[];
}

export interface Product {
    name: string;
    sku: string;
    stock: number;
    price: Price;
    recommendedPrice: number;
    shipping: string;
    images: string[];
    isFavorite: boolean;
    category: string;
    subcategory: string;
    variations?: Variation[];
    description: string;
    specifications: { key: string; value: string }[];
    shippingInfo: { processingTime: string; warehouse: string };
}

export interface CartItem {
  id: string; // A unique ID generated from product sku and variations
  product: Product;
  quantity: number;
  selectedVariations: Record<string, string>;
}

// Order type
export type OrderStatus = 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal';
export interface OrderProduct {
    name: string;
    quantity: number;
    price: string;
}
export interface Order {
    id: string;
    customer: string;
    total: string;
    status: OrderStatus;
    creationDate: string;
    updateDate: string;
    address: string;
    trackingNumber: string | null;
    products: OrderProduct[];
}

// Request type
export type RequestType = 'Tedarik' | 'Danışmanlık';
export type RequestStatus = 'Bekliyor' | 'Tamamlandı';
export type RequestResult = 'Başarılı' | 'Başarısız' | null;
export interface Request {
    id: string;
    type: RequestType;
    title: string;
    status: RequestStatus;
    result: RequestResult;
    explanation: string;
    updated: string;
}

// Extra Fee type
export type FeeStatus = 'Ödendi' | 'Beklemede';
export interface ExtraFee {
    id: string;
    item: string;
    description: string;
    amount: string;
    date: string;
    status: FeeStatus;
}

// Chat Message type
export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'consultant';
    timestamp: string;
    avatar?: string;
    file?: {
        name: string;
        type: string;
        size: number;
    };
}


export const initialProducts: Product[] = [
    { 
        name: 'Akıllı Saat Pro X', 
        sku: 'SPX-W01-BLK',
        stock: 157,
        price: 85,
        recommendedPrice: 169.99,
        shipping: '2-4 gün', 
        images: [
            'https://picsum.photos/seed/watchpro/800/800', 
            'https://picsum.photos/seed/watchpro2/800/800', 
            'https://picsum.photos/seed/watchpro3/800/800',
            'https://picsum.photos/seed/watchpro-silver/800/800',
            'https://picsum.photos/seed/watchpro-gold/800/800'
        ], 
        isFavorite: true, 
        category: 'Elektronik', 
        subcategory: 'Akıllı Saat',
        variations: [
            {
                type: 'Renk',
                options: [
                    { name: 'Siyah', image: 'https://picsum.photos/seed/watchpro/800/800', value: '#1a1a1a' },
                    { name: 'Gümüş', image: 'https://picsum.photos/seed/watchpro-silver/800/800', value: '#c0c0c0' },
                    { name: 'Altın', image: 'https://picsum.photos/seed/watchpro-gold/800/800', value: '#ffd700' },
                ]
            },
            {
                type: 'Kordon',
                options: [
                    { name: 'Silikon' },
                    { name: 'Metal' },
                ]
            }
        ],
        description: `Modern tasarımı ve üstün özellikleriyle Akıllı Saat Pro X, hayatınızı kolaylaştırmak için tasarlandı. Yüksek çözünürlüklü AMOLED ekranı, uzun pil ömrü ve suya dayanıklı yapısıyla her an yanınızda.\n\n- Kalp atış hızı takibi\n- Adım sayar ve kalori ölçer\n- GPS ve navigasyon\n- Müzik kontrolü ve bildirimler\n- 14 farklı spor modu`,
        specifications: [
            { key: 'Ekran', value: '1.4" AMOLED Dokunmatik Ekran' },
            { key: 'Çözünürlük', value: '454 x 454 piksel' },
            { key: 'Malzeme', value: 'Titanyum Kasa, Safir Cam' },
            { key: 'Pil Ömrü', value: '14 güne kadar' },
            { key: 'Su Direnci', value: '5 ATM' },
            { key: 'Bağlantı', value: 'Bluetooth 5.1, GPS, NFC' },
            { key: 'Uyumluluk', value: 'Android 6.0+, iOS 9.0+' },
        ],
        shippingInfo: {
            processingTime: '1-2 iş günü',
            warehouse: 'Hong Kong Deposu',
        }
    },
    { 
        name: 'Kablosuz Bluetooth Kulaklık', 
        sku: 'SPX-H02-WHT',
        stock: 250,
        price: 45.50, 
        recommendedPrice: 89.99,
        shipping: '2-4 gün', 
        images: [
            'https://picsum.photos/seed/headphone/800/800', 
            'https://picsum.photos/seed/headphone2/800/800'
        ], 
        isFavorite: false, 
        category: 'Elektronik', 
        subcategory: 'Kulaklık',
        description: `Kristal netliğinde ses kalitesi ve ergonomik tasarımıyla gün boyu konfor sunar. Aktif gürültü engelleme (ANC) özelliği ile dış dünyadan soyutlanın.\n\n- Bluetooth 5.2 Teknolojisi\n- 30 saate varan pil ömrü\n- Dokunmatik kontrol yüzeyi`,
        specifications: [{key: 'Bağlantı', value: 'Bluetooth 5.2'}],
        shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Shenzhen Deposu' }
    },
    { name: 'Paslanmaz Çelik Termos Seti', sku: 'SPX-T01', stock: 88, price: { min: 28, max: 35 }, recommendedPrice: 59.99, shipping: '2-4 gün', images: ['https://picsum.photos/seed/thermos/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Mutfak Gereçleri', description: 'İçeceklerinizi saatlerce sıcak veya soğuk tutan, sızdırmaz kapaklı şık termos seti.', specifications: [{key: 'Kapasite', value: '500ml'}], shippingInfo: { processingTime: '2-3 iş günü', warehouse: 'Yiwu Deposu' } },
    { name: 'Yoga ve Pilates Matı', sku: 'SPX-YM01', stock: 30, price: 25, recommendedPrice: 49.99, shipping: '3-5 gün', images: ['https://picsum.photos/seed/yogamat/800/800'], isFavorite: true, category: 'Spor', subcategory: 'Yoga Malzemeleri', description: 'Kaymaz yüzeyi ve ideal kalınlığı ile yoga ve pilates pratiğiniz için mükemmel bir zemin sunar.', specifications: [{key: 'Kalınlık', value: '6mm'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Shenzhen Deposu' } },
    { 
        name: '4K Aksiyon Kamerası', 
        sku: 'SPX-AC01',
        stock: 75,
        price: 120, 
        recommendedPrice: 229.99,
        shipping: '2-4 gün', 
        images: [
            'https://picsum.photos/seed/camera/800/800',
            'https://picsum.photos/seed/camera2/800/800',
            'https://picsum.photos/seed/camera3/800/800'
        ], 
        isFavorite: false, 
        category: 'Elektronik', 
        subcategory: 'Kamera',
        description: `Maceralarınızı 4K kalitesinde kaydedin. Su geçirmez kılıfı ve geniş aksesuar kiti ile her koşulda yanınızda.`,
        specifications: [{key: 'Video Çözünürlüğü', value: '4K/60fps'}],
        shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Hong Kong Deposu' }
    },
    { name: 'Otomatik Kedi Mama Kabı', sku: 'SPX-PF01', stock: 0, price: { min: 95, max: 110 }, recommendedPrice: 199.99, shipping: '3-5 gün', images: ['https://picsum.photos/seed/petfeeder/800/800'], isFavorite: false, category: 'Evcil Hayvan', subcategory: 'Beslenme', description: 'Zaman ayarlı mama kabı ile evcil dostunuzun beslenme düzenini siz evde yokken bile koruyun.', specifications: [{key: 'Kapasite', value: '4 Litre'}], shippingInfo: { processingTime: '2-3 iş günü', warehouse: 'Yiwu Deposu' } },
    { name: 'Masaj Tabancası', sku: 'SPX-MG01', stock: 120, price: 110, recommendedPrice: 219.99, shipping: '2-4 gün', images: ['https://picsum.photos/seed/massagegun/800/800'], isFavorite: false, category: 'Sağlık & Bakım', subcategory: 'Masaj Aletleri', description: 'Farklı başlıkları ve ayarlanabilir hız seviyeleri ile kaslarınızı gevşetin ve rahatlayın.', specifications: [{key: 'Hız Seviyesi', value: '30'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Shenzhen Deposu' } },
    { name: 'LED Masa Lambası', sku: 'SPX-DL01', stock: 200, price: 32, recommendedPrice: 64.99, shipping: '3-5 gün', images: ['https://picsum.photos/seed/lamp/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Aydınlatma', description: 'Göz yormayan, ayarlanabilir parlaklık ve renk sıcaklığına sahip modern masa lambası.', specifications: [{key: 'Işık Rengi', value: 'Sıcak/Soğuk Beyaz'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Yiwu Deposu' } },
    { name: 'Taşınabilir Blender', sku: 'SPX-PB01', stock: 45, price: 45, recommendedPrice: 89.99, shipping: '2-4 gün', images: ['https://picsum.photos/seed/blender/800/800'], isFavorite: true, category: 'Ev & Yaşam', subcategory: 'Mutfak Gereçleri', description: 'USB ile şarj edilebilir, güçlü motoru sayesinde taze smoothie ve içeceklerinizi dilediğiniz yerde hazırlayın.', specifications: [{key: 'Şarj', value: 'USB-C'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Shenzhen Deposu' } },
    { name: 'Ergonomik Ofis Sandalyesi', sku: 'SPX-OC01', stock: 60, price: { min: 250, max: 320 }, recommendedPrice: 499.99, shipping: '5-7 gün', images: ['https://picsum.photos/seed/officechair/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Ofis Mobilyası', description: 'Bel desteği ve ayarlanabilir özellikleri ile uzun çalışma saatlerinde konfor sağlar.', specifications: [{key: 'Malzeme', value: 'File Kumaş'}], shippingInfo: { processingTime: '3-4 iş günü', warehouse: 'Foshan Deposu' } },
    { name: 'Akıllı Ev Güvenlik Kamerası', sku: 'SPX-SC01', stock: 95, price: 80, recommendedPrice: 159.99, shipping: '2-4 gün', images: ['https://picsum.photos/seed/securitycam/800/800'], isFavorite: false, category: 'Elektronik', subcategory: 'Güvenlik Sistemleri', description: 'Gece görüşü ve hareket sensörü özellikleriyle evinizi 7/24 izleyin.', specifications: [{key: 'Görüş Açısı', value: '360 Derece'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Hong Kong Deposu' } },
    { name: 'Bambu Banyo Seti', sku: 'SPX-BS01', stock: 150, price: 38, recommendedPrice: 74.99, shipping: '3-5 gün', images: ['https://picsum.photos/seed/bathset/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Banyo Aksesuarları', description: 'Doğal bambu malzemeden üretilmiş, banyonuza şıklık katacak 4 parçalı set.', specifications: [{key: 'Parça Sayısı', value: '4'}], shippingInfo: { processingTime: '2-3 iş günü', warehouse: 'Yiwu Deposu' } },
    { name: 'Gamer Klavye RGB', sku: 'SPX-GK01', stock: 110, price: 130, recommendedPrice: 249.99, shipping: '2-4 gün', images: ['https://picsum.photos/seed/keyboard/800/800'], isFavorite: false, category: 'Elektronik', subcategory: 'Bilgisayar Aksesuarları', description: 'Mekanik tuşları ve ayarlanabilir RGB aydınlatması ile oyun deneyiminizi bir üst seviyeye taşıyın.', specifications: [{key: 'Tuş Tipi', value: 'Mekanik Mavi Switch'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Shenzhen Deposu' } },
    { name: 'Dijital Mutfak Terazisi', sku: 'SPX-KS01', stock: 300, price: 15.75, recommendedPrice: 34.99, shipping: '3-5 gün', images: ['https://picsum.photos/seed/scale/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Mutfak Gereçleri', description: 'Hassas ölçüm özelliği ile tariflerinizde mükemmel sonuçlar elde edin.', specifications: [{key: 'Kapasite', value: '5kg'}], shippingInfo: { processingTime: '1-2 iş günü', warehouse: 'Yiwu Deposu' } },
];