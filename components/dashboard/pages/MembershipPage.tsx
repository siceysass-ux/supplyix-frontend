import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';

const plans = [
    { name: '7 Günlük Deneme', price: 1, durationText: '/ 7 gün' },
    { name: '1 Ay', price: 10, durationText: '/ aylık' },
    { name: '6 Ay', price: 50, durationText: '/ 6 aylık' },
    { name: '1 Sene', price: 100, durationText: '/ yıllık' },
];

const MembershipPage: React.FC = () => {
    const [currentPlanName, setCurrentPlanName] = useState('1 Ay');
    const currentPlan = plans.find(p => p.name === currentPlanName);

    if (!currentPlan) {
        // Fallback for an unlikely scenario
        return <div>Aktif plan bulunamadı.</div>;
    }

    return (
        <div>
            <PageHeader
                title="Planlarım"
                subtitle="Mevcut planınızı yönetin ve diğer seçenekleri keşfedin."
            />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-xl font-semibold text-dark-blue mb-4">Mevcut Planınız: {currentPlan.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Durum</p>
                        <StatusBadge status="Aktif" />
                    </div>
                     <div>
                        <p className="text-sm text-slate-500 mb-1">Başlangıç Tarihi</p>
                        <p className="font-semibold text-dark-blue">10.10.2025</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500 mb-1">Yenileme Tarihi</p>
                        <p className="font-semibold text-dark-blue">10.11.2025</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500 mb-1">Fiyat</p>
                        <p className="font-semibold text-dark-blue">${currentPlan.price}{currentPlan.durationText}</p>
                    </div>
                </div>
                 <div className="mt-6 border-t border-slate-200 pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus transition-colors">Şimdi Yenile</button>
                        <button className="bg-dark-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-dark-blue/80 transition-colors">Ödeme Yöntemini Değiştir</button>
                    </div>
                </div>
            </div>
            
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-dark-blue text-center mb-8">Planlarımızı Keşfedin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                    {plans.map(plan => {
                         const isCurrent = plan.name === currentPlanName;
                         return (
                            <div key={plan.name} className={`relative rounded-xl border-2 p-8 flex flex-col text-center ${isCurrent ? 'border-primary shadow-2xl shadow-primary/20' : 'border-slate-200 bg-white'}`}>
                                {isCurrent && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MEVCUT PLAN</div>}
                                <h4 className="text-xl font-bold text-primary flex-grow">{plan.name}</h4>
                                <div className="my-5">
                                    <p className="text-4xl font-extrabold text-dark-blue">${plan.price}</p>
                                    <p className="text-md font-medium text-slate-600 mt-1">{plan.durationText}</p>
                                </div>
                                <button 
                                    onClick={() => setCurrentPlanName(plan.name)}
                                    className={`w-full font-bold py-3 px-6 rounded-lg transition-colors mt-auto ${isCurrent ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-focus'}`}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? 'Mevcut Plan' : 'Plana Geç'}
                                </button>
                            </div>
                         );
                    })}
                </div>
                 <div className="text-center mt-8 text-sm text-slate-500">
                    <p>Plan değişikliği bir sonraki fatura döneminizde uygulanır.</p>
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;