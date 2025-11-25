import React, { useState } from 'react';
import { Plan } from './dashboard/types';

interface PricingSectionProps {
    navigate: (path: string) => void;
    plans: Plan[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ navigate, plans }) => {
    const [selectedPlanName, setSelectedPlanName] = useState<string>(plans.find(p => p.popular)?.name || plans[0].name);

    const handleProceed = () => {
        const plan = plans.find(p => p.name === selectedPlanName);
        if (plan) {
            const planName = encodeURIComponent(plan.name);
            const planPrice = encodeURIComponent(plan.price);
            navigate(`/kayit-ol?plan=${planName}&price=${planPrice}`);
        }
    };

    return (
        <section id="pricing" className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-4">Planınızı Seçin</h2>
                    <p className="text-base md:text-lg text-dark-blue">
                        Basit, şeffaf fiyatlandırma. Dakikalar içinde başlayın.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => {
                        const isSelected = selectedPlanName === plan.name;
                        return (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col p-3 md:p-4 lg:p-6 rounded-xl border-2 transition-all duration-300 transform cursor-pointer ${isSelected ? 'border-primary scale-105 shadow-2xl shadow-primary/20' : `hover:-translate-y-2 ${plan.popular ? 'border-primary bg-white lg:scale-105 hover:shadow-primary/20' : 'border-gray-200 bg-white hover:shadow-gray-500/10'}`}`}
                                onClick={() => setSelectedPlanName(plan.name)}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                        <span className="whitespace-nowrap bg-primary text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider">En Popüler</span>
                                    </div>
                                )}
                                <div className="flex-grow flex flex-col justify-center">
                                    <h3 className="text-sm md:text-lg lg:text-xl font-bold text-dark-blue mb-1 md:mb-2 text-center">{plan.name}</h3>
                                    <div className="text-center mb-4 md:mb-6 lg:mb-8">
                                        <span className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-dark-blue">${plan.price}</span>
                                        <span className="text-gray-500 text-xs md:text-base lg:text-lg block md:inline">{plan.durationText}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedPlanName(plan.name)}
                                    className={`w-full font-bold text-xs md:text-sm lg:text-base py-2 md:py-2.5 lg:py-3 px-2 md:px-4 rounded-lg transition-all duration-300 mt-auto ${isSelected ? 'bg-primary text-white hover:bg-primary-focus' : 'bg-dark-blue text-white hover:bg-dark-blue/80'}`}
                                >
                                    {isSelected ? 'Seçildi ✓' : plan.buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 md:mt-12 lg:mt-16 text-center">
                    <button
                        onClick={handleProceed}
                        className="btn-shimmer bg-primary text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 text-sm md:text-base">
                        İlerle
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;