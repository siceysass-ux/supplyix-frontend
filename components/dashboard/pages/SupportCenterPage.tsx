import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import { SupportIcon } from '../icons/outline';

const tickets = [
    { id: '#D001', subject: 'Kargo Takip Numarası Sorunu', status: 'Yanıtlandı', updated: '10.10.2025' },
    { id: '#D002', subject: 'Fatura Bilgileri Güncelleme', status: 'Çözüldü', updated: '08.10.2025' },
];

const faqs = [
    { q: 'Tedarik isteği nasıl oluşturulur?', a: 'Taleplerim sayfasından "Yeni Tedarik İste" butonuna tıklayarak formu doldurabilirsiniz.' },
    { q: 'Siparişimi nasıl iptal edebilirim?', a: 'Siparişlerim sayfasından ilgili siparişin detayına giderek "İptal Et" butonunu kullanabilirsiniz. Bu işlem yalnızca sipariş "Hazırlanıyor" aşamasına geçmeden önce yapılabilir.' },
];

const SupportCenterPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tickets');
    
    return (
        <div>
            <PageHeader
                title="Destek Merkezi"
                subtitle="Yardıma mı ihtiyacınız var? SSS bölümüne göz atın veya yeni bir destek talebi oluşturun."
            />
            
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('tickets')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tickets' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Destek Taleplerim
                    </button>
                    <button onClick={() => setActiveTab('faq')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'faq' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Sıkça Sorulan Sorular
                    </button>
                    <button onClick={() => setActiveTab('new')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'new' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Yeni Talep Oluştur
                    </button>
                </nav>
            </div>

            {activeTab === 'tickets' && (
                 <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talep #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Konu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Güncelleme</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td className="px-6 py-4 text-sm font-semibold text-primary">{ticket.id}</td>
                                        <td className="px-6 py-4 text-sm text-dark-blue">{ticket.subject}</td>
                                        <td className="px-6 py-4 text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'Yanıtlandı' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{ticket.status}</span></td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{ticket.updated}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'faq' && (
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-dark-blue">{faq.q}</h3>
                            <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'new' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-dark-blue mb-4">Yeni Destek Talebi Oluştur</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Konu</label>
                            <input type="text" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Öncelik</label>
                            <select className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300">
                                <option>Normal</option>
                                <option>Yüksek</option>
                                <option>Acil</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Açıklama</label>
                            <textarea rows={5} className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300"></textarea>
                        </div>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors">
                            Talep Gönder
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default SupportCenterPage;
