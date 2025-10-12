
import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { CurrencyDollarIcon } from '../icons/outline';
import { ExtraFee } from '../types';
import PaymentModal from '../shared/PaymentModal';
import PaymentSuccessModal from '../shared/PaymentSuccessModal';
import PaymentFailureModal from '../shared/PaymentFailureModal';

interface ExtraFeesPageProps {
    navigate: (path: string) => void;
    fees: ExtraFee[];
    onSaveFee: (fee: ExtraFee) => void;
}

const ExtraFeesPage: React.FC<ExtraFeesPageProps> = ({ navigate, fees, onSaveFee }) => {
    const hasFees = fees.length > 0;
    
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [feeToPay, setFeeToPay] = useState<ExtraFee | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);

    const handlePayClick = (fee: ExtraFee) => {
        setFeeToPay(fee);
        setIsPaymentModalOpen(true);
    };

    const handleSubmitPayment = (cvc: string) => {
        if (!feeToPay) return;
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaymentModalOpen(false);
            if (cvc === '123') { // Simulate success
                onSaveFee({ ...feeToPay, status: 'Ödendi' });
                setShowSuccessModal(true);
            } else { // Simulate failure
                setShowFailureModal(true);
            }
        }, 2000);
    };
    
    return (
        <div>
            {isPaymentModalOpen && feeToPay && (
                <PaymentModal
                    item={{ 
                        name: feeToPay.item,
                        price: parseFloat(feeToPay.amount.replace('$', '')),
                        description: feeToPay.description
                    }}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSubmit={handleSubmitPayment}
                    isProcessing={isProcessing}
                />
            )}
            {showSuccessModal && (
                <PaymentSuccessModal
                    title="Ödeme Başarılı!"
                    message={`'${feeToPay?.item || ''}' ücreti başarıyla ödendi.`}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
            {showFailureModal && <PaymentFailureModal onClose={() => setShowFailureModal(false)} />}
            
            <PageHeader
                title="Ek Ücretler"
                subtitle="Standart paket dışı işlemler için oluşan masraf kalemlerini ve ödeme durumlarını takip edin."
            />
            
            {hasFees ? (
                <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Kalem</th>
                                    <th scope="col" className="px-6 py-3">Tutar</th>
                                    <th scope="col" className="px-6 py-3">Tarih</th>
                                    <th scope="col" className="px-6 py-3">Durum</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {fees.map(fee => (
                                    <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-dark-blue dark:text-slate-100">{fee.item}</div>
                                            <div className="text-slate-500 dark:text-slate-400">{fee.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-dark-blue dark:text-slate-100">{fee.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(fee.date).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={fee.status as any} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {fee.status === 'Beklemede' && (
                                                <button 
                                                    onClick={() => handlePayClick(fee)} 
                                                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm"
                                                >
                                                    Ödeme Yap
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={<CurrencyDollarIcon />}
                    title="Ek ücret kaydınız bulunmuyor"
                    message="Paket dışı bir işlem yaptığınızda oluşan masraflar burada listelenir."
                />
            )}
        </div>
    );
};

export default ExtraFeesPage;