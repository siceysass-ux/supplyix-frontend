import React, { useState } from 'react';

interface PricingCardProps {
    plan: string;
    price: number;
    duration: string;
    popular?: boolean;
    isSelected: boolean;
    onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, duration, popular = false, isSelected, onSelect }) => {
    return (
        <div className={`relative flex flex-col p-8 rounded-xl border-2 transition-all duration-300 transform cursor-pointer ${isSelected ? 'border-primary scale-105 shadow-2xl shadow-primary/20' : `hover:-translate-y-2 ${popular ? 'border-primary bg-white lg:scale-105 hover:shadow-primary/20' : 'border-gray-200 bg-white hover:shadow-gray-500/10'}`}`} onClick={onSelect}>
            {popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">En Popüler</span>
                </div>
            )}
            <div className="flex-grow">
                <h3 className="text-2xl font-bold text-dark-blue mb-2 text-center">{plan}</h3>
                <div className="text-center mb-8">
                    <span className="text-5xl font-extrabold text-dark-blue">${price}</span>
                    <span className="text-gray-500 text-lg">/{duration}</span>
                </div>
            </div>
            <button
                onClick={onSelect}
                className={`w-full font-bold py-3 px-8 rounded-lg transition-all duration-300 mt-auto ${isSelected || popular ? 'bg-primary text-white hover:bg-primary-focus' : 'bg-dark-blue text-white hover:bg-dark-blue/80'}`}
            >
                {isSelected ? 'Seçildi' : 'Planı Seç'}
            </button>
        </div>
    );
};

interface PricingSectionProps {
  navigate: (path: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ navigate }) => {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(1); // Default to popular plan

    const plans = [
        {
            plan: 'Haftalık Deneme',
            price: 1,
            duration: 'hafta',
        },
        {
            plan: 'Aylık',
            price: 10,
            duration: 'ay',
            popular: true,
        },
        {
            plan: '6 Aylık',
            price: 50,
            duration: '6 ay',
        },
        {
            plan: 'Yıllık',
            price: 100,
            duration: 'yıl',
        },
    ];
    
    const handleProceed = () => {
        if (selectedPlan !== null) {
            const plan = plans[selectedPlan];
            const planName = encodeURIComponent(plan.plan);
            const planPrice = encodeURIComponent(plan.price);
            navigate(`/signup?plan=${planName}&price=${planPrice}`);
        }
    };

    return (
        <section id="pricing" className="py-20 bg-neutral">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Planınızı Seçin</h2>
                    <p className="text-lg text-dark-blue">
                        Basit, şeffaf fiyatlandırma. Dakikalar içinde başlayın.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 items-center">
                    {plans.map((p, index) => (
                        <PricingCard
                            key={index}
                            plan={p.plan}
                            price={p.price}
                            duration={p.duration}
                            popular={p.popular}
                            isSelected={selectedPlan === index}
                            onSelect={() => setSelectedPlan(index)}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    {selectedPlan !== null && (
                        <button 
                            onClick={handleProceed}
                            className="bg-primary text-white font-bold py-4 px-10 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
                            İlerle
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;