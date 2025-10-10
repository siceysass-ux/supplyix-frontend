import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { DocumentTextIcon, CubeIcon } from '../icons/outline';

const requests = [
    { id: '#T001', type: 'Tedarik', title: 'Özel tasarım t-shirt (100 adet)', status: 'Teklif Verildi', updated: '09.10.2025' },
    { id: '#T002', type: 'Ürün', title: 'Yeni model drone (DJI Mini 4 Pro)', status: 'Çalışılıyor', updated: '10.10.2025' },
    { id: '#T003', type: 'Tedarik', title: 'Ahşap telefon standı', status: 'Tamamlandı', updated: '05.10.2025' },
    { id: '#T004', type: 'Ürün', title: 'Belirli bir alibaba linki', status: 'Reddedildi', updated: '02.10.2025' },
];

const RequestsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const [activeTab, setActiveTab] = useState('Tedarik');
    const hasRequests = requests.length > 0;

    return (
        <div>
            <PageHeader
                title="Taleplerim"
                subtitle="Yeni ürün veya tedarik talepleri oluşturun ve mevcut taleplerinizi yönetin."
            >
                <div className="flex space-x-3">
                    <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm inline-flex items-center">
                        <CubeIcon className="w-5 h-5 mr-2" />
                        Yeni Tedarik İste
                    </button>
                     <button className="bg-dark-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-dark-blue/90 transition-colors text-sm inline-flex items-center">
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        Yeni Ürün İste
                    </button>
                </div>
            </PageHeader>
            
            {hasRequests ? (
                <>
                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('Tedarik')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Tedarik' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Tedarik İstekleri
                            </button>
                            <button
                                onClick={() => setActiveTab('Ürün')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Ürün' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Ürün İstekleri
                            </button>
                        </nav>
                    </div>

                    {/* Requests Table */}
                     <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talep #</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Güncelleme</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map(req => (
                                        <tr key={req.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{req.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-blue">{req.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{req.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={req.status as any} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.updated}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-primary hover:text-primary-focus">Detay</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState
                    icon={<DocumentTextIcon className="h-12 w-12 text-gray-400" />}
                    title="Henüz talep oluşturmadınız"
                    message="Aradığınız ürün veya tedarikçi havuzda yoksa, hemen bir talep oluşturun."
                     actionButton={
                        <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm">
                           Yeni Talep Oluştur
                        </button>
                    }
                />
            )}
        </div>
    );
};

export default RequestsPage;
