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
        { imageUrl: 'https://picsum.photos/seed/p1/200/200', price: '$29.99' },
        { imageUrl: 'https://picsum.photos/seed/p2/200/200', price: '$34.90' },
        { imageUrl: 'https://picsum.photos/seed/p3/200/200', price: '$19.00' },
        { imageUrl: 'https://picsum.photos/seed/p4/200/200', price: '$42.50' },
        { imageUrl: 'https://picsum.photos/seed/p5/200/200', price: '$12.99' },
        { imageUrl: 'https://picsum.photos/seed/p6/200/200', price: '$55.00' },
        { imageUrl: 'https://picsum.photos/seed/p7/200/200', price: '$27.90' },
        { imageUrl: 'https://picsum.photos/seed/p8/200/200', price: '$39.00' },
        { imageUrl: 'https://picsum.photos/seed/p9/200/200', price: '$14.99' },
        { imageUrl: 'https://picsum.photos/seed/p10/200/200', price: '$18.00' },
        { imageUrl: 'https://picsum.photos/seed/p11/200/200', price: '$69.90' },
        { imageUrl: 'https://picsum.photos/seed/p12/200/200', price: '$9.50' },
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
        <section className="relative bg-white dark:bg-slate-900 overflow-hidden pb-20 md:pb-0">
             {showConfetti && <ConfettiBurst />}
             <FlyingLogos />

             <div 
                className="hidden md:block absolute top-0 right-0 h-full w-1/2 bg-primary" 
                style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0% 100%, 8% 80%, 2% 60%, 12% 40%, 4% 20%)' }}
             ></div>

            <div className="relative grid grid-cols-1 md:grid-cols-2">

                <div className="text-dark-blue dark:text-slate-200 flex items-center justify-center">
                    <div className="px-6 py-20 md:py-28 lg:py-32 max-w-2xl text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up text-primary" style={{ animationDelay: '0.2s' }}>
                            Supplyix ile e-ticaret zahmetsiz: Stok Yok, Kargo Yok, Sadece Satış Var!
                        </h1>
                        <p className="text-lg md:text-xl text-dark-blue dark:text-slate-300 mb-10 max-w-xl mx-auto md:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            Ürünlerini seç, listele, satış yaptıkça biz gönderelim. Sen sadece kazancına odaklan.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                            <a href="#pricing" onClick={handleScrollToPricing} className="bg-primary text-white font-bold py-4 px-10 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 inline-block w-full sm:w-auto text-center">
                                Şimdi Başla!
                            </a>
                            <a href="#/contact" onClick={handleContactClick} className="bg-white dark:bg-slate-800 text-primary border-2 border-primary font-bold py-4 px-10 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/10 inline-block w-full sm:w-auto text-center">
                                İletişime Geç
                            </a>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-center p-8 sm:p-12">
                     <div className="relative mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="w-full max-w-lg h-[550px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                            <div className="h-10 bg-white dark:bg-slate-800 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-700">
                                <img
                                    src="/logo.png"
                                    alt="Supplyix Logo"
                                    className="h-8 w-auto"
                                />
                                <div className="bg-primary text-white font-bold py-1 px-4 rounded-md text-xs cursor-pointer">
                                    Giriş Yap
                                </div>
                            </div>
                            <div className="h-[calc(100%-2.5rem)] overflow-hidden p-2 bg-neutral-50 dark:bg-slate-700">
                                <div className="animate-scroll-products">
                                    <div className="grid grid-cols-3 gap-2">
                                        {displayedProducts.map((product, index) => (
                                            <div key={index} className="bg-white dark:bg-slate-600 p-2 rounded-lg shadow-md flex flex-col">
                                                <img src={product.imageUrl} alt={`Product showcase ${index + 1}`} className="w-full object-cover rounded-md aspect-square" />
                                                <div className="pt-2 flex-grow flex flex-col justify-between">
                                                     <p className="font-bold text-dark-blue dark:text-white text-center text-sm mb-1">{product.price}</p>
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
                        className="animate-pop-in-out bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg py-2 px-4 border border-gray-200 dark:border-slate-600"
                     >
                        <p className="text-gray-600 dark:text-slate-300 text-sm text-center">
                            <span className="font-bold text-dark-blue dark:text-slate-100">{notification.location}</span>'dan bir satış: <span className="font-bold text-primary">{notification.price}</span>!
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