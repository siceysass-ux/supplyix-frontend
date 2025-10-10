import React from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { CurrencyDollarIcon } from '../icons/outline';


const fees = [
    { item: 'Özel Paketleme', description: 'Kırılacak ürünler için ek koruma', amount: '₺150.00', date: '08.10.2025', relatedId: '#S002', status: 'Ödendi' },
    { item: 'Acil Tedarik', description: 'Tedarik süresinin hızlandırılması', amount: '₺400.00', date: '05.10.2025', relatedId: '#T003', status: 'Ödendi' },
    { item: 'Logo Baskı', description: 'T-shirt ürünlerine logo basımı', amount: '₺750.00', date: '10.10.2025', relatedId: '#T001', status: 'Beklemede' },
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
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kalem</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlişkili #</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {fees.map(fee => (
                                    <tr key={fee.item}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-dark-blue">{fee.item}</div>
                                            <div className="text-sm text-gray-500">{fee.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark-blue">{fee.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-semibold">{fee.relatedId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <StatusBadge status={fee.status as any} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {fee.status === 'Beklemede' ? (
                                                <a href="#" className="text-primary hover:text-primary-focus">Ödeme Yap</a>
                                            ) : (
                                                <a href="#" className="text-primary hover:text-primary-focus">Detay</a>
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
                    icon={<CurrencyDollarIcon className="h-12 w-12 text-gray-400" />}
                    title="Ek ücret kaydınız bulunmuyor"
                    message="Paket dışı bir işlem yaptığınızda oluşan masraflar burada listelenir."
                />
            )}
        </div>
    );
};

export default ExtraFeesPage;
