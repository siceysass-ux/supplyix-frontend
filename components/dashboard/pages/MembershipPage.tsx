import React, { useState, useMemo } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import PaymentModal from '../shared/PaymentModal';
import PaymentSuccessModal from '../shared/PaymentSuccessModal';
import PaymentFailureModal from '../shared/PaymentFailureModal';
import { Plan } from '../types';

const plans: Plan[] = [
    { name: '1 Ay', price: 10, durationText: '/ aylık', buttonText: 'Plana Geç' },
    { name: '6 Ay', price: 50, durationText: '/ 6 aylık', buttonText: 'Plana Geç' },
    { name: '1 Sene', price: 100, durationText: '/ yıllık', buttonText: 'Plana Geç' },
];

interface MembershipPageProps {
    subscription: {
        planName: string;
        startDate: string;
        endDate: string;
        willRenew: boolean;
    };
    onToggleRenewal: (renew: boolean) => void;
    onUpdatePlan: (plan: Plan) => void;
}

const MembershipPage: React.FC<MembershipPageProps> = ({ subscription, onToggleRenewal, onUpdatePlan }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [planToPurchase, setPlanToPurchase] = useState<Plan | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [failureMessage, setFailureMessage] = useState('');

    // Derived State
    const isExpired = useMemo(() => new Date() > new Date(subscription.endDate), [subscription.endDate]);
    const status: 'Aktif' | 'İptal' | 'Süresi Doldu' = isExpired ? 'Süresi Doldu' : subscription.willRenew ? 'Aktif' : 'İptal';

    const currentPlan = plans.find(p => p.name === subscription.planName) || plans[0];

    // Mock buyer data - in production, this should come from user context/state
    const buyerData = {
        id: 'user-1',
        name: 'Ahmet',
        surname: 'Yılmaz',
        email: 'ahmet@sirket.com',
        gsmNumber: '+905350000000',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
        identityNumber: '11111111111',
        registrationDate: '2024-01-01 12:00:00'
    };

    const handleSelectPlan = (plan: Plan) => {
        const isCurrent = plan.name === subscription.planName && !isExpired;
        if (!isCurrent) {
            setPlanToPurchase(plan);
            setIsPaymentModalOpen(true);
        }
    };

    const handlePaymentSuccess = (paymentId: string) => {
        console.log('Payment successful:', paymentId);
        setIsPaymentModalOpen(false);
        if (planToPurchase) {
            onUpdatePlan(planToPurchase);
        }
        setShowSuccessModal(true);
    };

    const handlePaymentFailure = (error: string) => {
        console.error('Payment failed:', error);
        setIsPaymentModalOpen(false);
        setFailureMessage(error);
        setShowFailureModal(true);
    };

    return (
        <div>
            {isPaymentModalOpen && planToPurchase && (
                <PaymentModal
                    item={{
                        name: planToPurchase.name,
                        price: planToPurchase.price,
                        description: planToPurchase.durationText
                    }}
                    buyer={buyerData}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                />
            )}
            {showSuccessModal && (
                <PaymentSuccessModal
                    title="Ödeme Başarılı!"
                    message={`Yeni '${planToPurchase?.name || ''}' planınız başarıyla etkinleştirildi.`}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
            {showFailureModal && (
                <PaymentFailureModal
                    onClose={() => setShowFailureModal(false)}
                    message={failureMessage}
                />
            )}

            {isExpired ? (
                <PageHeader
                    title="Üyeliğiniz Sona Erdi"
                    subtitle="Hizmetlerimize erişmeye devam etmek için lütfen yeni bir plan seçin."
                />
            ) : (
                <>
                    <PageHeader
                        title="Planlarım"
                        subtitle="Mevcut planınızı yönetin ve diğer seçenekleri keşfedin."
                    />

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
                        <h3 className="text-xl font-semibold text-dark-blue dark:text-slate-100 mb-4">Mevcut Planınız</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Plan</p>
                                <p className="font-semibold text-primary">{subscription.planName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Durum</p>
                                <StatusBadge status={status} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Başlangıç Tarihi</p>
                                <p className="font-semibold text-dark-blue dark:text-slate-200">{new Date(subscription.startDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Bitiş Tarihi</p>
                                <p className="font-semibold text-dark-blue dark:text-slate-200">{new Date(subscription.endDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ödenen Ücret</p>
                                <p className="font-semibold text-dark-blue dark:text-slate-200">${currentPlan.price}{currentPlan.durationText}</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {status === 'Aktif'
                                    ? `Aboneliğiniz ${new Date(subscription.endDate).toLocaleDateString('tr-TR')} tarihinde sona erecek. Yenileme hatırlatıcıları aktif.`
                                    : `Aboneliğiniz ${new Date(subscription.endDate).toLocaleDateString('tr-TR')} tarihinde sona erecek. Yenileme hatırlatıcıları kapalı.`
                                }
                            </p>
                            <button
                                onClick={() => onToggleRenewal(!subscription.willRenew)}
                                className={`font-bold py-2 px-5 rounded-lg text-sm transition-colors whitespace-nowrap ${status === 'Aktif'
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30'
                                    }`}
                            >
                                {status === 'Aktif' ? '🔕 Hatırlatıcıları Kapat' : '🔔 Hatırlatıcıları Aç'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="mt-12">
                <h3 className="text-2xl font-bold text-dark-blue dark:text-slate-100 text-center mb-8">
                    {isExpired ? 'Yeni Plan Seçin' : 'Diğer Planlarımızı Keşfedin'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map(plan => {
                        const isCurrent = plan.name === subscription.planName && !isExpired;
                        return (
                            <div key={plan.name} className={`relative rounded-xl border-2 p-8 flex flex-col text-center ${isCurrent ? 'border-primary shadow-2xl shadow-primary/20 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                                {isCurrent && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MEVCUT PLAN</div>}
                                <h4 className="text-xl font-bold text-primary flex-grow">{plan.name}</h4>
                                <div className="my-5">
                                    <p className="text-4xl font-extrabold text-dark-blue dark:text-slate-100">${plan.price}</p>
                                    <p className="text-md font-medium text-slate-600 dark:text-slate-400 mt-1">{plan.durationText}</p>
                                </div>
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    className={`w-full font-bold py-3 px-6 rounded-lg transition-colors mt-auto ${isCurrent ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-focus'}`}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? 'Mevcut Plan' : (isExpired ? 'Bu Planı Seç' : 'Plana Geç')}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
                    <p>Plan değişikliği bir sonraki fatura döneminizde uygulanır.</p>
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;