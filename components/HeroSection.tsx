import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
    navigate: (path: string) => void;
}

// Confetti Component
const ConfettiBurst: React.FC = () => {
    const confettiCount = 60;
    const colors = ['#ff6a00', '#042d4d', '#FBBF24', '#36D399', '#3ABFF8'];

    const pieces = Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
            '--translate-x': `${Math.random() * 400 - 200}px`, // Horizontal spread
            '--translate-y': `${Math.random() * -350 - 50}px`, // Vertical (upward) spread
            '--initial-rotate': `${Math.random() * 360}deg`,
            '--final-rotate': `${Math.random() * 720 + 360}deg`,
            left: '50%',
            top: '50%',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animation: `confetti-burst 1.8s cubic-bezier(0.1, 1, 0.7, 1) forwards`,
        } as React.CSSProperties;
        return <div key={i} className="absolute w-[6px] h-[12px]" style={style} />;
    });

    return <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none z-50 md:hidden">{pieces}</div>;
};

// New Flying Logos Component for Mobile
const FlyingLogos: React.FC = () => {
    const logos = [
        { top: '15%', duration: '12s', delay: '0s', direction: 'ltr' },
        { top: '30%', duration: '15s', delay: '2s', direction: 'rtl' },
        { top: '50%', duration: '10s', delay: '5s', direction: 'ltr' },
        { top: '70%', duration: '18s', delay: '7s', direction: 'rtl' },
        { top: '85%', duration: '13s', delay: '9s', direction: 'ltr' },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
            {logos.map((logo, i) => (
                <img
                    key={i}
                    src="/logo.png"
                    alt=""
                    className={`absolute h-8 w-auto opacity-20 ${logo.direction === 'ltr' ? 'animate-fly-diagonal-ltr' : 'animate-fly-diagonal-rtl'}`}
                    style={{
                        top: logo.top,
                        animationDuration: logo.duration,
                        animationDelay: logo.delay,
                    }}
                />
            ))}
        </div>
    );
};


const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
    const products = [
        { imageUrl: '/product-images/1.png', price: '$12.99' },
        { imageUrl: '/product-images/2.png', price: '$8.50' },
        { imageUrl: '/product-images/3.png', price: '$14.90' },
        { imageUrl: '/product-images/4.png', price: '$6.75' },
        { imageUrl: '/product-images/5.png', price: '$11.20' },
        { imageUrl: '/product-images/6.png', price: '$9.99' },
        { imageUrl: '/product-images/7.png', price: '$13.45' },
        { imageUrl: '/product-images/8.png', price: '$7.80' },
        { imageUrl: '/product-images/9.png', price: '$10.50' },
        { imageUrl: '/product-images/10.png', price: '$5.99' },
        { imageUrl: '/product-images/11.png', price: '$14.25' },
        { imageUrl: '/product-images/12.png', price: '$8.90' },
        { imageUrl: '/product-images/13.png', price: '$12.40' },
        { imageUrl: '/product-images/14.png', price: '$6.50' },
        { imageUrl: '/product-images/15.png', price: '$11.75' },
        { imageUrl: '/product-images/1_1387213615438.jpg', price: '$9.25' },
        { imageUrl: '/product-images/1_1905720621116.jpg', price: '$13.90' },
        { imageUrl: '/product-images/1_2224fcb2-f40e-4b48-b524-0019b1152c2e.jpg', price: '$7.50' },
        { imageUrl: '/product-images/2_4739765b-cfca-40d6-b1d3-6b662478c8fc.jpg', price: '$10.99' },
        { imageUrl: '/product-images/3_2edeaef7-57b2-4554-a362-656d001dd9b2.jpg', price: '$5.75' },
        { imageUrl: '/product-images/4_6f466ebe-69a4-463e-90da-246b3d2c1f1e.png', price: '$14.50' },
        { imageUrl: '/product-images/5_48106c86-2713-41b7-a064-76551d0acb9c.jpg', price: '$8.25' },
        { imageUrl: '/product-images/078d6b98-c82d-49c0-8a15-7d4a305f46b6.webp', price: '$12.10' },
        { imageUrl: '/product-images/1623810948043.webp', price: '$9.60' },
    ];
    const displayedProducts = [...products, ...products, ...products, ...products];

    const turkishCities = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahyav', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'];

    const [notification, setNotification] = useState<{
        location: string;
        price: string;
        key: number;
    } | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const showRandomNotification = () => {
            const randomCity = turkishCities[Math.floor(Math.random() * turkishCities.length)];
            const randomPrice = (Math.random() * 65 + 5).toFixed(2);

            setNotification({
                location: randomCity,
                price: `$${randomPrice}`,
                key: Date.now(),
            });
        };

        const intervalId = setInterval(showRandomNotification, 7000);

        setTimeout(showRandomNotification, 500);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (notification) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);


    const handleScrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/contact');
    };

    return (
        <section className="relative bg-white overflow-hidden pb-20 md:pb-0">
            {showConfetti && <ConfettiBurst />}
            <FlyingLogos />

            <div
                className="hidden md:block absolute top-0 right-0 h-full w-1/2 bg-primary"
                style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0% 100%, 8% 80%, 2% 60%, 12% 40%, 4% 20%)' }}
            ></div>

            <div className="relative grid grid-cols-1 md:grid-cols-2">

                <div className="text-dark-blue flex items-center justify-center">
                    <div className="px-4 md:px-6 py-16 md:py-20 lg:py-28 xl:py-32 max-w-2xl text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 md:mb-6 animate-fade-in-up text-primary" style={{ animationDelay: '0.2s' }}>
                            Dropshipping Türkiye ile Stoksuz Satış: Çin'den Toptan Ürün Tedarik
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl text-dark-blue mb-8 md:mb-10 max-w-xl mx-auto md:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            1688, Taobao ve Alibaba entegrasyonu ile binlerce ürüne anında erişim. Stoksuz e-ticaret çözümü ile sen sadece sat, biz gönderelim!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                            <a href="#pricing" onClick={handleScrollToPricing} className="btn-shimmer btn-pulse bg-primary text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 inline-block w-full sm:w-auto text-center text-sm md:text-base">
                                Şimdi Başla!
                            </a>
                            <a href="#/contact" onClick={handleContactClick} className="bg-white text-primary border-2 border-primary font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/10 inline-block w-full sm:w-auto text-center text-sm md:text-base">
                                İletişime Geç
                            </a>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-center p-8 sm:p-12">
                    <div className="relative mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="w-full max-w-lg h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                            <div className="h-10 bg-white flex items-center justify-between px-4 border-b border-gray-200">
                                <img
                                    src="/logo.png"
                                    alt="Supplyix Logo"
                                    className="h-8 w-auto"
                                />
                                <div className="bg-primary text-white font-bold py-1 px-4 rounded-md text-xs cursor-pointer">
                                    Giriş Yap
                                </div>
                            </div>
                            <div className="h-[calc(100%-2.5rem)] overflow-hidden p-2 bg-neutral-50">
                                <div className="animate-scroll-products">
                                    <div className="grid grid-cols-3 gap-2">
                                        {displayedProducts.map((product, index) => (
                                            <div key={index} className="bg-white p-2 rounded-lg shadow-md flex flex-col">
                                                <img src={product.imageUrl} alt={`Product showcase ${index + 1}`} className="w-full object-cover rounded-md aspect-square" />
                                                <div className="pt-2 flex-grow flex flex-col justify-between">
                                                    <p className="font-bold text-dark-blue text-center text-sm mb-1">{product.price}</p>
                                                    <button className="w-full text-xs bg-primary text-white font-semibold py-1 px-2 rounded-md hover:bg-primary-focus transition-colors duration-300">
                                                        Satmaya Başla
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none w-max">
                {notification && (
                    <div
                        key={notification.key}
                        className="animate-pop-in-out bg-white/90 backdrop-blur-sm rounded-lg shadow-lg py-2 px-4 border border-gray-200"
                    >
                        <p className="text-gray-600 text-sm text-center">
                            <span className="font-bold text-dark-blue">{notification.location}</span>'dan bir satış: <span className="font-bold text-primary">{notification.price}</span>!
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    opacity: 0; animation: fade-in-up 0.8s ease-out forwards;
                }
                @keyframes scroll-products {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                .animate-scroll-products {
                    animation: scroll-products 55s linear infinite;
                }
                @keyframes confetti-burst {
                    0% { transform: translate(-50%, -50%) rotate(var(--initial-rotate)) scale(1); opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--translate-x)), calc(-50% + var(--translate-y))) rotate(var(--final-rotate)) scale(0); opacity: 0; }
                }
                @keyframes pop-in-out {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    15%, 85% { opacity: 1; transform: scale(1); }
                }
                .animate-pop-in-out {
                    animation: pop-in-out 6.5s ease-in-out forwards;
                }
                @keyframes fly-diagonal-ltr {
                    from { transform: translateX(-110%) translateY(50px) rotate(-15deg); }
                    to { transform: translateX(calc(100vw + 110%)) translateY(-50px) rotate(15deg); }
                }
                .animate-fly-diagonal-ltr {
                    animation-name: fly-diagonal-ltr; animation-timing-function: linear; animation-iteration-count: infinite;
                }
                @keyframes fly-diagonal-rtl {
                    from { transform: translateX(calc(100vw + 110%)) translateY(50px) rotate(15deg); }
                    to { transform: translateX(-110%) translateY(-50px) rotate(-15deg); }
                }
                .animate-fly-diagonal-rtl {
                    animation-name: fly-diagonal-rtl; animation-timing-function: linear; animation-iteration-count: infinite;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;