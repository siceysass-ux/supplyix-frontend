export type Price = number | { min: number; max: number };

export interface VariationOption {
    name: string;
    image?: string; // Optional image specific to this variation option
}

export interface Variation {
    type: string; // e.g., "Renk", "Boyut"
    options: VariationOption[];
}

export interface Product {
    name: string;
    price: Price;
    shipping: string;
    images: string[]; // Changed from 'image' to 'images'
    isFavorite: boolean;
    category: string;
    subcategory: string;
    variations?: Variation[];
    description: string;
}

export const initialProducts: Product[] = [
    { 
        name: 'Akıllı Saat Pro X', 
        price: 850, 
        shipping: '2-4', 
        images: [
            'https://picsum.photos/seed/watchpro/800/800', 
            'https://picsum.photos/seed/watchpro2/800/800', 
            'https://picsum.photos/seed/watchpro3/800/800'
        ], 
        isFavorite: true, 
        category: 'Elektronik', 
        subcategory: 'Akıllı Saat',
        variations: [
            {
                type: 'Renk',
                options: [
                    { name: 'Siyah', image: 'https://picsum.photos/seed/watchpro/800/800' },
                    { name: 'Gümüş', image: 'https://picsum.photos/seed/watchpro-silver/800/800' },
                    { name: 'Altın', image: 'https://picsum.photos/seed/watchpro-gold/800/800' },
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
        description: `Modern tasarımı ve üstün özellikleriyle Akıllı Saat Pro X, hayatınızı kolaylaştırmak için tasarlandı. Yüksek çözünürlüklü AMOLED ekranı, uzun pil ömrü ve suya dayanıklı yapısıyla her an yanınızda.\n\n- Kalp atış hızı takibi\n- Adım sayar ve kalori ölçer\n- GPS ve navigasyon\n- Müzik kontrolü ve bildirimler\n- 14 farklı spor modu`
    },
    { 
        name: 'Kablosuz Bluetooth Kulaklık', 
        price: 750, 
        shipping: '2-4', 
        images: [
            'https://picsum.photos/seed/headphone/800/800', 
            'https://picsum.photos/seed/headphone2/800/800'
        ], 
        isFavorite: false, 
        category: 'Elektronik', 
        subcategory: 'Kulaklık',
        description: `Kristal netliğinde ses kalitesi ve ergonomik tasarımıyla gün boyu konfor sunar. Aktif gürültü engelleme (ANC) özelliği ile dış dünyadan soyutlanın.\n\n- Bluetooth 5.2 Teknolojisi\n- 30 saate varan pil ömrü\n- Dokunmatik kontrol yüzeyi`
    },
    { name: 'Paslanmaz Çelik Termos Seti', price: { min: 280, max: 350 }, shipping: '2-4', images: ['https://picsum.photos/seed/thermos/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Mutfak Gereçleri', description: 'İçeceklerinizi saatlerce sıcak veya soğuk tutan, sızdırmaz kapaklı şık termos seti.' },
    { name: 'Yoga ve Pilates Matı', price: 250, shipping: '3-5', images: ['https://picsum.photos/seed/yogamat/800/800'], isFavorite: true, category: 'Spor', subcategory: 'Yoga Malzemeleri', description: 'Kaymaz yüzeyi ve ideal kalınlığı ile yoga ve pilates pratiğiniz için mükemmel bir zemin sunar.' },
    { 
        name: '4K Aksiyon Kamerası', 
        price: 1200, 
        shipping: '2-4', 
        images: [
            'https://picsum.photos/seed/camera/800/800',
            'https://picsum.photos/seed/camera2/800/800',
            'https://picsum.photos/seed/camera3/800/800'
        ], 
        isFavorite: false, 
        category: 'Elektronik', 
        subcategory: 'Kamera',
        description: `Maceralarınızı 4K kalitesinde kaydedin. Su geçirmez kılıfı ve geniş aksesuar kiti ile her koşulda yanınızda.`
    },
    { name: 'Otomatik Kedi Mama Kabı', price: { min: 950, max: 1100 }, shipping: '3-5', images: ['https://picsum.photos/seed/petfeeder/800/800'], isFavorite: false, category: 'Evcil Hayvan', subcategory: 'Beslenme', description: 'Zaman ayarlı mama kabı ile evcil dostunuzun beslenme düzenini siz evde yokken bile koruyun.' },
    { name: 'Masaj Tabancası', price: 1100, shipping: '2-4', images: ['https://picsum.photos/seed/massagegun/800/800'], isFavorite: false, category: 'Sağlık & Bakım', subcategory: 'Masaj Aletleri', description: 'Farklı başlıkları ve ayarlanabilir hız seviyeleri ile kaslarınızı gevşetin ve rahatlayın.' },
    { name: 'LED Masa Lambası', price: 320, shipping: '3-5', images: ['https://picsum.photos/seed/lamp/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Aydınlatma', description: 'Göz yormayan, ayarlanabilir parlaklık ve renk sıcaklığına sahip modern masa lambası.' },
    { name: 'Taşınabilir Blender', price: 450, shipping: '2-4', images: ['https://picsum.photos/seed/blender/800/800'], isFavorite: true, category: 'Ev & Yaşam', subcategory: 'Mutfak Gereçleri', description: 'USB ile şarj edilebilir, güçlü motoru sayesinde taze smoothie ve içeceklerinizi dilediğiniz yerde hazırlayın.' },
    { name: 'Ergonomik Ofis Sandalyesi', price: { min: 2500, max: 3200 }, shipping: '5-7', images: ['https://picsum.photos/seed/officechair/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Ofis Mobilyası', description: 'Bel desteği ve ayarlanabilir özellikleri ile uzun çalışma saatlerinde konfor sağlar.' },
    { name: 'Akıllı Ev Güvenlik Kamerası', price: 800, shipping: '2-4', images: ['https://picsum.photos/seed/securitycam/800/800'], isFavorite: false, category: 'Elektronik', subcategory: 'Güvenlik Sistemleri', description: 'Gece görüşü ve hareket sensörü özellikleriyle evinizi 7/24 izleyin.' },
    { name: 'Bambu Banyo Seti', price: 380, shipping: '3-5', images: ['https://picsum.photos/seed/bathset/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Banyo Aksesuarları', description: 'Doğal bambu malzemeden üretilmiş, banyonuza şıklık katacak 4 parçalı set.' },
    { name: 'Gamer Klavye RGB', price: 1300, shipping: '2-4', images: ['https://picsum.photos/seed/keyboard/800/800'], isFavorite: false, category: 'Elektronik', subcategory: 'Bilgisayar Aksesuarları', description: 'Mekanik tuşları ve ayarlanabilir RGB aydınlatması ile oyun deneyiminizi bir üst seviyeye taşıyın.' },
    { name: 'Dijital Mutfak Terazisi', price: 180, shipping: '3-5', images: ['https://picsum.photos/seed/scale/800/800'], isFavorite: false, category: 'Ev & Yaşam', subcategory: 'Mutfak Gereçleri', description: 'Hassas ölçüm özelliği ile tariflerinizde mükemmel sonuçlar elde edin.' },
];
