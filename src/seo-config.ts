// SEO Configuration for Supplyix - Turkish Market Optimization
// Türkiye pazarı için optimize edilmiş SEO yapılandırması

export interface SEOConfig {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonical?: string;
    noindex?: boolean;
    structuredData?: any;
}

// Site-wide defaults
export const DEFAULT_SEO: SEOConfig = {
    title: 'Supplyix - Dropshipping Türkiye | Stoksuz E-Ticaret Çözümü',
    description: 'Supplyix ile dropshipping yapmak artık çok kolay! Çin\'den toptan ürün tedarik, stoksuz satış, 1688 ve Taobao entegrasyonu. Türkiye\'nin en güvenilir dropshipping platformu.',
    keywords: [
        'dropshipping türkiye',
        'toptan ürün tedarik',
        'çin\'den toptan alışveriş',
        '1688 türkiye',
        'taobao türkiye',
        'alibaba türkiye',
        'stoksuz satış',
        'e-ticaret tedarikçi',
        'dropshipping nedir',
        'toptan ürün sitesi',
        'trendyol tedarikçi',
        'hepsiburada tedarikçi',
    ],
    ogImage: '/logo.png',
};

// Page-specific SEO configurations
export const PAGE_SEO: Record<string, SEOConfig> = {
    '/': {
        title: 'Supplyix - Dropshipping Türkiye | Stoksuz E-Ticaret ile Para Kazanın',
        description: 'Türkiye\'nin #1 dropshipping platformu Supplyix ile stoksuz satış yapın! Çin\'den milyonlarca ürün, hızlı kargo, 7/24 destek. 7 günlük deneme sadece 1$. Hemen başlayın!',
        keywords: [
            'dropshipping türkiye',
            'dropshipping nedir',
            'dropshipping ile para kazanma',
            'stoksuz satış',
            'çin\'den ürün getirme',
            'toptan ürün tedarik',
            '1688 türkiye',
            'taobao türkiye',
            'alibaba dropshipping',
            'e-ticaret başlangıç',
            'online satış',
            'trendyol satıcı',
            'hepsiburada satıcı',
        ],
        ogImage: '/logo.png',
        canonical: 'https://www.supplyix.com',
    },
    '/giris': {
        title: 'Giriş Yap - Supplyix Dropshipping Paneli',
        description: 'Supplyix dropshipping panelinize giriş yapın. Ürünlerinizi yönetin, siparişlerinizi takip edin, kazancınızı görüntüleyin.',
        keywords: ['supplyix giriş', 'dropshipping panel', 'üye girişi'],
        noindex: true,
    },
    '/kayit-ol': {
        title: 'Kayıt Ol - Supplyix ile Dropshipping\'e Başla | 7 Gün Deneme 1$',
        description: 'Supplyix\'e kayıt olun ve dropshipping\'e hemen başlayın! 7 günlük deneme sadece 1$. Kredi kartı gerekmez. Binlerce ürüne anında erişim.',
        keywords: [
            'supplyix kayıt',
            'dropshipping başla',
            'ücretsiz deneme',
            'dropshipping üyelik',
            '1 dolar deneme',
        ],
        canonical: 'https://www.supplyix.com/kayit-ol',
    },
    '/iletisim': {
        title: 'İletişim - Supplyix Müşteri Hizmetleri | 7/24 Destek',
        description: 'Supplyix müşteri hizmetleri ile iletişime geçin. Dropshipping, ürün tedarik, kargo ve tüm sorularınız için 7/24 destek.',
        keywords: [
            'supplyix iletişim',
            'müşteri hizmetleri',
            'destek',
            'yardım',
            'whatsapp destek',
        ],
        canonical: 'https://www.supplyix.com/iletisim',
    },
    '/sifremi-unuttum': {
        title: 'Şifremi Unuttum - Supplyix',
        description: 'Supplyix şifrenizi mi unuttunuz? E-posta adresinizle şifrenizi kolayca sıfırlayın.',
        keywords: ['şifre sıfırlama', 'şifremi unuttum'],
        noindex: true,
    },
    '/dashboard': {
        title: 'Panel - Supplyix Dropshipping Yönetim Paneli',
        description: 'Supplyix yönetim panelinizden ürünlerinizi yönetin, siparişleri takip edin, kazancınızı görüntüleyin.',
        keywords: ['supplyix panel', 'dropshipping yönetim'],
        noindex: true,
    },
    '/admin': {
        title: 'Admin Panel - Supplyix',
        description: 'Supplyix admin yönetim paneli.',
        keywords: ['admin panel'],
        noindex: true,
    },
};

// Structured Data Templates
export const ORGANIZATION_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Supplyix',
    description: 'Türkiye\'nin en güvenilir dropshipping ve toptan ürün tedarik platformu',
    url: 'https://www.supplyix.com',
    logo: 'https://www.supplyix.com/logo.png',
    foundingDate: '2024',
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Müşteri Hizmetleri',
        availableLanguage: ['Turkish'],
        areaServed: 'TR',
    },
    sameAs: [
        'https://www.instagram.com/supplyixturkiye/',
        'https://www.youtube.com/@Supplyix',
    ],
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'TR',
        addressLocality: 'Türkiye',
    },
};

export const WEBSITE_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Supplyix',
    url: 'https://www.supplyix.com',
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.supplyix.com/dashboard?search={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};

export const LOCAL_BUSINESS_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Supplyix',
    image: 'https://www.supplyix.com/logo.png',
    '@id': 'https://www.supplyix.com',
    url: 'https://www.supplyix.com',
    telephone: '',
    priceRange: '$$',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'TR',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.9334,
        longitude: 32.8597,
    },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
    },
    sameAs: [
        'https://www.instagram.com/supplyixturkiye/',
        'https://www.youtube.com/@Supplyix',
    ],
};

// FAQ Schema for FAQ Section
export const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Neden Supplyix\'i kullanmalıyım?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Çünkü zaman kaybetmeye, karmaşık panellerle uğraşmaya veya ürün aramakla boğuşmaya gerek yok. Supplyix ile en çok satan ürünleri tek tıkla keşfedersiniz, tedarikçiyi biz buluruz, danışmanlığı biz veririz. Sen sadece satışına odaklanırsın.',
            },
        },
        {
            '@type': 'Question',
            name: 'Supplyix ile dropshipping\'e nasıl başlayabilirim?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'İlk adımı atman için yalnızca 1$ yeterli! 7 günlük deneme süremizle platformu tam kapasiteyle keşfedebilirsin. Hiçbir risk almadan ürünleri inceleyebilir, danışmanlık talebinde bulunabilirsin.',
            },
        },
        {
            '@type': 'Question',
            name: 'Bir mağazam yoksa yine de kullanabilir miyim?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Kesinlikle. Supplyix, hem sıfırdan başlayanlar hem de deneyimli satıcılar için tasarlandı. Henüz mağaza açmadıysan seni yönlendiriyoruz. Aktif satış yapıyorsan ürün havuzumuzla işini büyütüyorsun.',
            },
        },
        {
            '@type': 'Question',
            name: 'Yeni başlıyorsam Supplyix bana uygun mu?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Tam sana göre! Ne satacağını biliyorsun ancak uygun tedarikçi mi bulamıyorsun? Ne satacağını bilmiyor, trend ürünleri keşfetmek mi istiyorsun? Onlarca kategori arasından trend ürünleri keşfedip mağazanda satışa başlayabilirsin.',
            },
        },
        {
            '@type': 'Question',
            name: 'Supplyix\'te istediğim ürünü bulamıyorum.',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ürün Talep Et özelliğimizle aradığınız ürünü bize iletin. Sizin için o ürünü en uygun fiyata satan tedarikçiyi bulalım ve ürünü sizin için havuzumuza ekleyelim.',
            },
        },
        {
            '@type': 'Question',
            name: 'Kendi ürün stoğum olması gerekiyor mu?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Hayır. Sizler için Çin\'den milyonlarca ürünün stokunu biz tutmaktayız.',
            },
        },
        {
            '@type': 'Question',
            name: 'Gönderi kaç gün içinde müşteriye ulaşır?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Siparişinizi aldığımız vakit ürünü tedarikçinizden alıp müşterinize gönderim için hazırlar, depomuzdan çıkış yaptıktan sonra sistemde belirtilen gün aralığında kargonuz müşterinize ulaşır.',
            },
        },
        {
            '@type': 'Question',
            name: 'Hangi pazaryerlerinde satış yapabilirim?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Supplyix tedarik havuzu ile istediğiniz pazaryerinde satış yapabilirsiniz. Trendyol, Hepsiburada, N11, Amazon Türkiye ve daha fazlası.',
            },
        },
    ],
};

// Helper function to get SEO config for a route
export function getSEOConfig(path: string): SEOConfig {
    // Remove query params and hash
    const cleanPath = path.split('?')[0].split('#')[0];

    // Check for dynamic routes
    if (cleanPath.startsWith('/sifre-sifirla/')) {
        return {
            title: 'Şifre Sıfırla - Supplyix',
            description: 'Yeni şifrenizi belirleyin.',
            keywords: ['şifre sıfırlama'],
            noindex: true,
        };
    }

    return PAGE_SEO[cleanPath] || DEFAULT_SEO;
}

// Helper function to generate breadcrumb schema
export function generateBreadcrumbSchema(path: string): any {
    const pathParts = path.split('/').filter(Boolean);

    const itemListElement = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Ana Sayfa',
            item: 'https://www.supplyix.com',
        },
    ];

    let currentPath = '';
    pathParts.forEach((part, index) => {
        currentPath += `/${part}`;
        const name = PAGE_SEO[currentPath]?.title?.split('-')[0]?.trim() || part;
        itemListElement.push({
            '@type': 'ListItem',
            position: index + 2,
            name,
            item: `https://www.supplyix.com${currentPath}`,
        });
    });

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
    };
}
