import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { DocumentTextIcon, CubeIcon, AcademicCapIcon } from '../icons/outline';

const requests = [
    { id: '#T001', type: 'Tedarik', title: 'Özel tasarım t-shirt', status: 'Tamamlandı', result: 'Başarılı', explanation: 'Uygun tedarikçi bulundu ve teklif iletildi.', updated: '09.10.2025' },
    { id: '#D001', type: 'Danışmanlık', title: 'Reklam Stratejileri', status: 'Tamamlandı', result: 'Başarılı', explanation: 'Görüşme tamamlandı, özet mail olarak gönderildi.', updated: '10.10.2025' },
    { id: '#T002', type: 'Tedarik', title: 'Belirli bir alibaba linki', status: 'Tamamlandı', result: 'Başarısız', explanation: 'Ürünün gümrük işlemleriyle ilgili sorunlar nedeniyle tedarik edilemiyor.', updated: '02.10.2025' },
    { id: '#T003', type: 'Tedarik', title: 'Ahşap telefon standı', status: 'Çalışılıyor', result: null, explanation: 'Tedarikçi araştırması devam ediyor.', updated: '11.10.2025' },
    { id: '#D002', type: 'Danışmanlık', title: 'Pazaryeri Entegrasyonu', status: 'Alındı', result: null, explanation: 'Randevu tarihi ve saati için e-posta gönderilecek.', updated: '12.10.2025' },
];

interface RequestModalProps {
    type: 'Tedarik' | 'Danışmanlık';
    onClose: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ type, onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle form submission
        console.log(`Submitting ${type} request...`);
        onClose();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-dark-blue">{type} İsteği Oluştur</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {type === 'Tedarik' ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Ürün Adı / Açıklaması *</label>
                                    <input type="text" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Referans Link *</label>
                                    <input type="url" placeholder="https://..." className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Görsel Yükle (Opsiyonel)</label>
                                    {selectedFile ? (
                                        <div className="mt-2 flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-slate-800 font-medium truncate" title={selectedFile.name}>
                                                    {selectedFile.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFile(null)}
                                                className="text-slate-500 hover:text-red-600 transition-colors p-1 rounded-full -mr-1 flex-shrink-0"
                                                aria-label="Dosyayı kaldır"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-1">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-white hover:border-primary transition-colors"
                                            >
                                                <div className="space-y-1 text-center">
                                                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="flex text-sm text-slate-600">
                                                        <span className="font-medium text-primary">Dosya Seç</span>
                                                        <p className="pl-1">veya sürükleyip bırakın</p>
                                                    </div>
                                                    <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP</p>
                                                </div>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={handleFileChange}
                                                    accept="image/png, image/jpeg, image/gif, image/webp"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Mesajınız (Opsiyonel)</label>
                                    <textarea rows={3} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary"></textarea>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Konu *</label>
                                    <input type="text" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Mesajınız *</label>
                                    <textarea rows={4} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" required></textarea>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300">İptal</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Talep Gönder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const RequestsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'Tedarik' | 'Danışmanlık' | null>(null);
    const hasRequests = requests.length > 0;

    const openModal = (type: 'Tedarik' | 'Danışmanlık') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div>
            {isModalOpen && modalType && <RequestModal type={modalType} onClose={() => setIsModalOpen(false)} />}
            <PageHeader
                title="Taleplerim"
                subtitle="Yeni ürün veya danışmanlık talepleri oluşturun ve mevcut taleplerinizi yönetin."
            >
                <div className="flex space-x-3">
                    <button onClick={() => openModal('Tedarik')} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm inline-flex items-center">
                        <CubeIcon className="w-5 h-5 mr-2" />
                        Tedarik İste
                    </button>
                     <button onClick={() => openModal('Danışmanlık')} className="bg-dark-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-dark-blue/90 transition-colors text-sm inline-flex items-center">
                        <AcademicCapIcon className="w-5 h-5 mr-2" />
                        Danışmanlık İste
                    </button>
                </div>
            </PageHeader>
            
            {hasRequests ? (
                 <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Talep #</th>
                                    <th scope="col" className="px-6 py-3">Tür</th>
                                    <th scope="col" className="px-6 py-3">Başlık</th>
                                    <th scope="col" className="px-6 py-3">Durum</th>
                                    <th scope="col" className="px-6 py-3">Sonuç</th>
                                    <th scope="col" className="px-6 py-3">Açıklama</th>
                                    <th scope="col" className="px-6 py-3">Son Güncelleme</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {requests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">{req.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-dark-blue font-medium">{req.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 max-w-xs truncate">{req.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={req.status as any} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {req.result ? <StatusBadge status={req.result as any} /> : <span className="text-slate-400">-</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{req.explanation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{req.updated}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={<DocumentTextIcon />}
                    title="Henüz talep oluşturmadınız"
                    message="Aradığınız ürün veya danışmanlık için hemen bir talep oluşturun."
                />
            )}
        </div>
    );
};

export default RequestsPage;
