


import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { DocumentTextIcon, CubeIcon, AcademicCapIcon, EyeIcon } from '../icons/outline';
import { Request, RequestType } from '../types';

interface RequestModalProps {
    type: RequestType;
    onClose: () => void;
    onAddRequest: (request: { type: RequestType; title: string; explanation: string; }) => Promise<void>;
}

const RequestModal: React.FC<RequestModalProps> = ({ type, onClose, onAddRequest }) => {
    const [title, setTitle] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onAddRequest({
            type,
            title,
            explanation
        });
        setIsSubmitting(false);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-dark-blue">{type} İsteği Oluştur</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="text-sm font-medium text-slate-700">{type === 'Tedarik' ? 'Ürün Adı / Referans Link' : 'Konu'} *</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Açıklama *</label>
                            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={4} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" required></textarea>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50">İptal</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:bg-primary/70 disabled:cursor-wait">
                           {isSubmitting ? 'Gönderiliyor...' : 'Talep Gönder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ViewRequestModalProps {
    request: Request;
    onClose: () => void;
}

const ViewRequestModal: React.FC<ViewRequestModalProps> = ({ request, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">Talep Detayı: {request.id}</h2>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Başlık</label>
                        <p className="mt-1 text-slate-900">{request.title}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Açıklama</label>
                        <p className="mt-1 text-slate-600 whitespace-pre-line">{request.explanation}</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
                    <button type="button" onClick={onClose} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Kapat</button>
                </div>
            </div>
        </div>
    );
};


interface RequestsPageProps {
    navigate: (path: string) => void;
    requests: Request[];
    onAddRequest: (request: { type: RequestType; title: string; explanation: string; }) => Promise<void>;
}

const RequestsPage: React.FC<RequestsPageProps> = ({ navigate, requests, onAddRequest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<RequestType | null>(null);
    const [viewedRequest, setViewedRequest] = useState<Request | null>(null);
    const hasRequests = requests.length > 0;

    const openModal = (type: RequestType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div>
            {isModalOpen && modalType && <RequestModal type={modalType} onClose={() => setIsModalOpen(false)} onAddRequest={onAddRequest} />}
            {viewedRequest && <ViewRequestModal request={viewedRequest} onClose={() => setViewedRequest(null)} />}
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
                                    <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {requests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">{req.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-dark-blue font-medium">{req.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 max-w-sm truncate">{req.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {req.result ? <StatusBadge status={req.result} /> : <span className="text-slate-400">-</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button onClick={() => setViewedRequest(req)} className="p-2 text-slate-500 hover:text-primary rounded-md hover:bg-slate-100" aria-label="Detayları Görüntüle">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </td>
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