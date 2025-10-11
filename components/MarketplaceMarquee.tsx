import React from 'react';

const marketplaces = [
    { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/200px-2021_Facebook_icon.svg.png" },
    { name: "Wix", logo: "https://logo.clearbit.com/wix.com" },
    { name: "WooCommerce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/WooCommerce_logo.svg/200px-WooCommerce_logo.svg.png" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" },
    { name: "Etsy", logo: "https://logo.clearbit.com/etsy.com" },
    { name: "Tiktok", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/200px-TikTok_logo.svg.png" },
    { name: "Shopify", logo: "https://logo.clearbit.com/shopify.com" },
    { name: "eBay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/200px-EBay_logo.svg.png" },
];

const MarketplaceMarquee: React.FC = () => {
    // Duplicate logos for a seamless loop
    const extendedLogos = [...marketplaces, ...marketplaces];

    return (
        <section className="bg-white dark:bg-slate-900 py-16 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Satış Yapabileceğiniz Platformlar
                    </h2>
                    <p className="mt-3 text-lg text-dark-blue dark:text-slate-300">
                        dilediğiniz pazar yerinde satış yapın
                    </p>
                </div>

                <div
                    className="group relative w-full overflow-hidden"
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                >
                    <div className="inline-flex flex-nowrap animate-scroll-left group-hover:pause">
                        {extendedLogos.map((market, index) => (
                            <div key={index} className="flex-shrink-0 w-48 mx-2 md:mx-8 flex items-center justify-center">
                                <img
                                    src={market.logo}
                                    alt={`${market.name} Logo`}
                                    className="max-h-16 w-auto object-contain filter grayscale transition-all duration-300 group-hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes scroll-left {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 7s linear infinite;
                }
                @media (min-width: 768px) {
                  .animate-scroll-left {
                    animation-duration: 40s;
                  }
                }
                .group-hover\\:pause:hover .animate-scroll-left,
                .group-hover\\:pause .animate-scroll-left {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default MarketplaceMarquee;