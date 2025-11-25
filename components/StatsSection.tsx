import React from 'react';
import NumberCounter from './animations/NumberCounter';
import ScrollFadeIn from './animations/ScrollFadeIn';

const StatsSection: React.FC = () => {
    return (
        <ScrollFadeIn>
            <section className="py-16 bg-gradient-to-r from-primary/10 via-orange-50 to-primary/10 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">
                                <NumberCounter end={10000} suffix="+" />
                            </div>
                            <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">Aktif Kullanıcı</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">
                                <NumberCounter end={50000} suffix="+" />
                            </div>
                            <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">Satılan Ürün</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">
                                ₺<NumberCounter end={2} suffix="M+" />
                            </div>
                            <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">Toplam Ciro</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">
                                <NumberCounter end={98} suffix="%" />
                            </div>
                            <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 font-medium">Müşteri Memnuniyeti</p>
                        </div>
                    </div>
                </div>
            </section>
        </ScrollFadeIn>
    );
};

export default StatsSection;
