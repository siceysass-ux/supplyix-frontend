
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

import Pagination from '../shared/Pagination';

// ... existing imports

const ExtraFeesPage: React.FC<ExtraFeesPageProps> = ({ navigate, fees, onSaveFee }) => {
    const hasFees = fees.length > 0;

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [feeToPay, setFeeToPay] = useState<ExtraFee | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [failureMessage, setFailureMessage] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Pagination Logic
    const totalPages = Math.ceil(fees.length / itemsPerPage);
    const currentFees = fees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    const handlePayClick = (fee: ExtraFee) => {
        setFeeToPay(fee);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = (paymentId: string) => {
        console.log('Payment successful:', paymentId);
        if (!feeToPay) return;
        setIsPaymentModalOpen(false);
        onSaveFee({ ...feeToPay, status: 'Ödendi' });
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
            {isPaymentModalOpen && feeToPay && (
                <PaymentModal
                    item={{
                        name: feeToPay.item,
                        price: parseFloat(feeToPay.amount.replace('$', '')),
                        description: feeToPay.description
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
                    message={`'${feeToPay?.item || ''}' ücreti başarıyla ödendi.`}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
            {showFailureModal && (
                <PaymentFailureModal
                    onClose={() => setShowFailureModal(false)}
                    message={failureMessage}
                />
            )}

            <PageHeader
                title="Ek Ücretler"
                subtitle="Standart paket dışı işlemler için oluşan masraf kalemlerini ve ödeme durumlarını takip edin."
            />

            {hasFees ? (
                <>
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
                                    {currentFees.map(fee => (
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
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
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