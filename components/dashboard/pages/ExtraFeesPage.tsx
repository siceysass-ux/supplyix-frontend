


import React from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { CurrencyDollarIcon } from '../icons/outline';
import { ExtraFee } from '../types';

interface ExtraFeesPageProps {
    navigate: (path: string) => void;
    fees: ExtraFee[];
}

const ExtraFeesPage: React.FC<ExtraFeesPageProps> = ({ navigate, fees }) => {
    const hasFees = fees.length > 0;
    
    return (
        <div>
            <PageHeader
                title="Ek Ücretler"
                subtitle="Standart paket dışı işlemler için oluşan masraf kalemlerini ve ödeme durumlarını takip edin."
            />
            
            {hasFees ? (
                <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Kalem</th>
                                    <th scope="col" className="px-6 py-3">Tutar</th>
                                    <th scope="col" className="px-6 py-3">Tarih</th>
                                    <th scope="col" className="px-6 py-3">Durum</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {fees.map(fee => (
                                    <tr key={fee.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-dark-blue">{fee.item}</div>
                                            <div className="text-slate-500">{fee.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-dark-blue">{fee.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{fee.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={fee.status as any} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {fee.status === 'Beklemede' && (
                                                <button 
                                                    onClick={() => navigate('/dashboard/payment')} 
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