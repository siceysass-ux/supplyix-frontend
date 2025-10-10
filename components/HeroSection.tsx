import React from 'react';

const HeroSection: React.FC = () => {
    // Product data for the animated showcase - UPDATED with dollar prices
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
    // Duplicate for seamless infinite scroll
    const displayedProducts = [...products, ...products];

    const handleScrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative bg-white overflow-hidden">
             {/* Cracked Orange Background */}
             <div 
                className="hidden md:block absolute top-0 right-0 h-full w-1/2 bg-primary" 
                style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0% 100%, 8% 80%, 2% 60%, 12% 40%, 4% 20%)' }}
             ></div>

            <div className="relative grid grid-cols-1 md:grid-cols-2">

                {/* Left Column: Text Content */}
                <div className="text-dark-blue flex items-center justify-center">
                    <div className="px-6 py-20 md:py-28 lg:py-32 max-w-2xl text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up text-primary" style={{ animationDelay: '0.2s' }}>
                            Supplyix ile e-ticaret zahmetsiz: Stok Yok, Kargo Yok, Sadece Satış Var!
                        </h1>
                        <p className="text-lg md:text-xl text-dark-blue mb-10 max-w-xl mx-auto md:mx-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            Ürünlerini seç, listele, satış yaptıkça biz gönderelim. Sen sadece kazancına odaklan.
                        </p>
                        <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
                            <a href="#pricing" onClick={handleScrollToPricing} className="bg-primary text-white font-bold py-4 px-10 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 inline-block">
                                Şimdi Başla!
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Animated Website Mockup */}
                <div className="hidden md:flex items-center justify-center p-8 sm:p-12">
                     <div className="relative mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="w-full max-w-lg h-[550px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                            {/* Browser header */}
                            <div className="h-10 bg-gray-100 flex items-center px-4 space-x-1.5 border-b border-gray-200">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            {/* Content area */}
                            <div className="h-[calc(100%-2.5rem)] overflow-hidden p-2 bg-neutral">
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

            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fade-in-up 0.8s ease-out forwards;
                }

                @keyframes scroll-products {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }

                .animate-scroll-products {
                    animation: scroll-products 55s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;