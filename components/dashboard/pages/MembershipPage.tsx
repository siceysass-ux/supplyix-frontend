import React from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';

const plans = [
    {
        name: 'Starter',
        price: '₺150',
        duration: '/ay',
        features: ['500 Ürün Listeleme Limiti', '60 Dakika Danışmanlık', 'Temel Raporlama', 'E-posta Desteği'],
        current: false,
    },
    {
        name: 'Pro',
        price: '₺450',
        duration: '/ay',
        features: ['2500 Ürün Listeleme Limiti', '180 Dakika Danışmanlık', 'Gelişmiş Raporlama', 'Öncelikli E-posta Desteği', 'API Erişimi'],
        current: true,
    },
    {
        name: 'Business',
        price: '₺900',
        duration: '/ay',
        features: ['Sınırsız Ürün Listeleme', 'Sınırsız Danışmanlık', 'Özelleştirilebilir Raporlar', 'Telefon & E-posta Desteği', 'Özel Hesap Yöneticisi'],
        current: false,
    }
];


const MembershipPage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Üyeliğim"
                subtitle="Mevcut planınızı yönetin, yükseltin veya yenileyin."
            />

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold text-dark-blue mb-4">Mevcut Planınız: Pro</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Durum</p>
                        <StatusBadge status="Aktif" />
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 mb-1">Başlangıç Tarihi</p>
                        <p className="font-semibold text-dark-blue">10.10.2025</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 mb-1">Yenileme Tarihi</p>
                        <p className="font-semibold text-dark-blue">10.11.2025</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500 mb-1">Kalan Danışmanlık</p>
                        <p className="font-semibold text-dark-blue">120 dakika</p>
                    </div>
                </div>
                 <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus transition-colors">Şimdi Yenile</button>
                        <button className="bg-dark-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-dark-blue/80 transition-colors">Ödeme Yöntemini Değiştir</button>
                    </div>
                </div>
            </div>
            
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-dark-blue text-center mb-8">Planlarımızı Keşfedin</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {plans.map(plan => (
                        <div key={plan.name} className={`rounded-lg border-2 p-8 flex flex-col ${plan.current ? 'border-primary shadow-2xl shadow-primary/20' : 'border-gray-200 bg-white'}`}>
                            <h4 className="text-xl font-bold text-center text-primary">{plan.name}</h4>
                            <div className="my-5 text-center">
                                <span className="text-4xl font-extrabold text-dark-blue">{plan.price}</span>
                                <span className="text-gray-500">{plan.duration}</span>
                            </div>
                            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
                                {plan.features.map(feature => (
                                     <li key={feature} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${plan.current ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-focus'}`}
                                disabled={plan.current}
                            >
                                {plan.current ? 'Mevcut Plan' : (plan.name === 'Starter' ? 'Plana Geç' : 'Yükselt')}
                            </button>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-8 text-sm text-gray-500">
                    <p>Plan değişikliği anında fark tahsil edilebilir. Plan düşürme bir sonraki yenilemede uygulanır.</p>
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;
