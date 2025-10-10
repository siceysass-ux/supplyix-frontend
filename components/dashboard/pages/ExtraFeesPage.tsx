import React from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { CurrencyDollarIcon } from '../icons/outline';


const fees = [
    { item: 'Özel Paketleme', description: 'Kırılacak ürünler için ek koruma', amount: '$15.00', date: '08.10.2025', relatedId: '#S002', status: 'Ödendi' },
    { item: 'Acil Tedarik', description: 'Tedarik süresinin hızlandırılması', amount: '$40.00', date: '05.10.2025', relatedId: '#T003', status: 'Ödendi' },
    { item: 'Logo Baskı', description: 'T-shirt ürünlerine logo basımı', amount: '$75.00', date: '10.10.2025', relatedId: '#T001', status: 'Beklemede' },
];

const ExtraFeesPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
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
                                    <th scope="col" className="px-6 py-3">İlişkili #</th>
                                    <th scope="col" className="px-6 py-3">Durum</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {fees.map(fee => (
                                    <tr key={fee.item} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-dark-blue">{fee.item}</div>
                                            <div className="text-slate-500">{fee.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-dark-blue">{fee.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{fee.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">{fee.relatedId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={fee.status as any} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {fee.status === 'Beklemede' ? (
                                                <a href="#" className="text-primary hover:text-primary-focus font-semibold">Ödeme Yap</a>
                                            ) : (
                                                <a href="#" className="text-primary hover:text-primary-focus font-semibold">Detay</a>
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