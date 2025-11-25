
import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { DocumentTextIcon, CubeIcon, AcademicCapIcon, EyeIcon, CameraIcon, XMarkIcon } from '../icons/outline';
import { Request, RequestType } from '../types';

type AddRequestPayload =
    | { type: 'Danışmanlık'; title: string; explanation: string; }
    | { type: 'Tedarik'; productName: string; imageUrls: string[]; referenceLink: string; explanation: string; };

interface RequestModalProps {
    type: RequestType;
    onClose: () => void;
    onAddRequest: (request: AddRequestPayload) => Promise<void>;
}

const RequestModal: React.FC<RequestModalProps> = ({ type, onClose, onAddRequest }) => {
    // Common fields
    const [explanation, setExplanation] = useState('');

    // 'Danışmanlık' specific
    const [title, setTitle] = useState('');

    // 'Tedarik' specific
    const [productName, setProductName] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [referenceLink, setReferenceLink] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (type === 'Tedarik') {
            if (!productName.trim() || imageFiles.length === 0 || !referenceLink.trim() || !explanation.trim()) {
                setError('Lütfen tüm zorunlu alanları doldurun.');
                return;
            }
            setIsSubmitting(true);

            try {
                // Upload images to R2
                const { uploadImages } = await import('../../../src/services/api');
                const result = await uploadImages(imageFiles);
                const uploadedUrls = result.files.map((f: any) => f.url);

                await onAddRequest({
                    type,
                    productName,
                    imageUrls: uploadedUrls,
                    referenceLink,
                    explanation
                });

                setIsSubmitting(false);
                onClose();
            } catch (error) {
                console.error('Image upload failed:', error);
                setError('Görseller yüklenemedi. Lütfen tekrar deneyin.');
                setIsSubmitting(false);
            }
        } else { // Danışmanlık
            if (!title.trim() || !explanation.trim()) {
                setError('Lütfen tüm zorunlu alanları doldurun.');
                return;
            }
            setIsSubmitting(true);
            await onAddRequest({
                type,
                title,
                explanation
            });
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">{type} İsteği Oluştur</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                        {type === 'Tedarik' ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ürün Adı *</label>
                                    <input value={productName} onChange={(e) => setProductName(e.target.value)} type="text" className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Görsel Yükle *</label>
                                    <label htmlFor="file-upload" className="mt-1 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer hover:border-primary bg-slate-50 dark:bg-slate-700/50">
                                        <div className="space-y-1 text-center">
                                            <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                                            <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                                <p className="pl-1">Görselleri buraya sürükleyin veya <span className="font-semibold text-primary">dosya seçin</span></p>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF (Birden fazla seçilebilir)</p>
                                        </div>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    {imageFiles.length > 0 && (
                                        <div className="mt-2 grid grid-cols-4 gap-2">
                                            {imageFiles.map((file, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <img src={URL.createObjectURL(file)} alt="Önizleme" className="w-full h-full object-cover rounded-md" />
                                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80">
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Referans Link (Ürünün bulunduğu sayfa) *</label>
                                    <input value={referenceLink} onChange={(e) => setReferenceLink(e.target.value)} type="url" placeholder="https://..." className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mesajınız *</label>
                                    <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={4} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary"></textarea>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Konu *</label>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Açıklama *</label>
                                    <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={4} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" required></textarea>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 flex justify-end space-x-3 rounded-b-xl">
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Talep Detayı: {request.id}</h2>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {request.type === 'Tedarik' ? (
                        <>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ürün Adı</label>
                                <p className="mt-1 text-slate-900 dark:text-slate-100">{request.productName}</p>
                            </div>
                            {request.imageUrls && request.imageUrls.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Yüklenen Görseller</label>
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {request.imageUrls.map((url, index) => (
                                            <a href={url} key={index} target="_blank" rel="noopener noreferrer">
                                                <img src={url} alt={`Tedarik talebi görseli ${index + 1}`} className="w-full h-full object-cover rounded-md border border-slate-200 dark:border-slate-700 hover:opacity-80" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {request.referenceLink && (
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Referans Link</label>
                                    <a href={request.referenceLink} target="_blank" rel="noopener noreferrer" className="mt-1 text-primary hover:underline block truncate">{request.referenceLink}</a>
                                </div>
                            )}
                        </>
                    ) : (
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Konu</label>
                            <p className="mt-1 text-slate-900 dark:text-slate-100">{request.title}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mesaj</label>
                        <p className="mt-1 text-slate-600 dark:text-slate-400 whitespace-pre-line">{request.explanation}</p>
                    </div>
                    {request.response && (
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin Yanıtı</label>
                            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{request.response}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 flex justify-end space-x-3 rounded-b-xl">
                    <button type="button" onClick={onClose} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Kapat</button>
                </div>
            </div>
        </div>
    );
};


interface RequestsPageProps {
    navigate: (path: string) => void;
    requests: Request[];
    onAddRequest: (request: AddRequestPayload) => Promise<void>;
    isSubscriptionExpired?: boolean;
}

import Pagination from '../shared/Pagination';

// ... existing imports

const RequestsPage: React.FC<RequestsPageProps> = ({ navigate, requests, onAddRequest, isSubscriptionExpired = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<RequestType | null>(null);
    const [viewedRequest, setViewedRequest] = useState<Request | null>(null);
    const hasRequests = requests.length > 0;

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Pagination Logic
    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const currentRequests = requests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (type: RequestType) => {
        if (isSubscriptionExpired) return; // Prevent opening modal if expired
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
                    <div className="relative group">
                        <button
                            onClick={() => openModal('Tedarik')}
                            disabled={isSubscriptionExpired}
                            className={`font-bold py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center ${isSubscriptionExpired
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-focus'
                                }`}
                        >
                            <CubeIcon className="w-5 h-5 mr-2" />
                            Tedarik İste
                        </button>
                        {isSubscriptionExpired && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                Aboneliğiniz sona erdi. Yeni talep oluşturamazsınız.
                            </div>
                        )}
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() => openModal('Danışmanlık')}
                            disabled={isSubscriptionExpired}
                            className={`font-bold py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center ${isSubscriptionExpired
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-dark-blue text-white hover:bg-dark-blue/90'
                                }`}
                        >
                            <AcademicCapIcon className="w-5 h-5 mr-2" />
                            Danışmanlık İste
                        </button>
                        {isSubscriptionExpired && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                Aboneliğiniz sona erdi. Yeni talep oluşturamazsınız.
                            </div>
                        )}
                    </div>
                </div>
            </PageHeader>

            {hasRequests ? (
                <>
                    <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Talep #</th>
                                        <th scope="col" className="px-6 py-3">Tür</th>
                                        <th scope="col" className="px-6 py-3">Konu / Ürün</th>
                                        <th scope="col" className="px-6 py-3">Durum</th>
                                        <th scope="col" className="px-6 py-3">Sonuç</th>
                                        <th scope="col" className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {currentRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">{req.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-dark-blue dark:text-slate-100">{req.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-200 max-w-sm truncate">
                                                {req.type === 'Tedarik' ? req.productName : req.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {req.result ? <StatusBadge status={req.result} /> : <span className="text-slate-400 dark:text-slate-500">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button onClick={() => setViewedRequest(req)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Detayları Görüntüle">
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
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
                    icon={<DocumentTextIcon />}
                    title="Henüz talep oluşturmadınız"
                    message="Aradığınız ürün veya danışmanlık için hemen bir talep oluşturun."
                />
            )}
        </div>
    );
};

export default RequestsPage;
