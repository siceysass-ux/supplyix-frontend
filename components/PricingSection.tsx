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
            navigate(`/signup?plan=${planName}&price=${planPrice}`);
        }
    };

    return (
        <section id="pricing" className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Planınızı Seçin</h2>
                    <p className="text-lg text-dark-blue dark:text-slate-300">
                        Basit, şeffaf fiyatlandırma. Dakikalar içinde başlayın.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => {
                        const isSelected = selectedPlanName === plan.name;
                        return (
                             <div 
                                key={plan.name}
                                className={`relative flex flex-col p-4 md:p-6 rounded-xl border-2 transition-all duration-300 transform cursor-pointer ${isSelected ? 'border-primary scale-105 shadow-2xl shadow-primary/20' : `hover:-translate-y-2 ${plan.popular ? 'border-primary bg-white dark:bg-slate-800 lg:scale-105 hover:shadow-primary/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-gray-500/10'}`}`} 
                                onClick={() => setSelectedPlanName(plan.name)}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                        <span className="whitespace-nowrap bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">En Popüler</span>
                                    </div>
                                )}
                                <div className="flex-grow flex flex-col justify-center">
                                    <h3 className="text-lg md:text-xl font-bold text-dark-blue dark:text-slate-100 mb-2 text-center">{plan.name}</h3>
                                    <div className="text-center mb-6 md:mb-8">
                                        <span className="text-4xl md:text-5xl font-extrabold text-dark-blue dark:text-slate-100">${plan.price}</span>
                                        <span className="text-gray-500 dark:text-slate-400 text-base md:text-lg">{plan.durationText}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedPlanName(plan.name)}
                                    className={`w-full font-bold text-sm md:text-base py-2 md:py-3 px-4 rounded-lg transition-all duration-300 mt-auto ${isSelected ? 'bg-primary text-white hover:bg-primary-focus' : 'bg-dark-blue text-white hover:bg-dark-blue/80'}`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <button 
                        onClick={handleProceed}
                        className="bg-primary text-white font-bold py-4 px-10 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
                        İlerle
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;