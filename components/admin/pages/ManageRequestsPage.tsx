import React, { useState } from 'react';
import { Request, RequestStatus, RequestResult } from '../../dashboard/types';
import StatusBadge from '../../dashboard/shared/StatusBadge';
import { ArrowDownTrayIcon } from '../../dashboard/icons/outline';
import { exportToExcel, formatDateForExcel } from '../utils/excelExport';

interface ResponseModalProps {
    request: Request;
    onClose: () => void;
    onRespond: (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => Promise<void>;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ request, onClose, onRespond }) => {
    const [response, setResponse] = useState(request.response || '');
    const [newResult, setNewResult] = useState<RequestResult>(request.result || 'Başarılı');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        console.log('🔵 handleSubmit called!');
        console.log('  Request ID:', request.id);
        console.log('  Response:', response);
        console.log('  Status:', 'Tamamlandı');
        console.log('  Result:', newResult);

        setIsSubmitting(true);
        try {
            console.log('🔵 Calling onRespond...');
            await onRespond(request.id, response, 'Tamamlandı', newResult);
            console.log('🔵 onRespond completed successfully');
            onClose();
        } catch (error) {
            console.error('🔴 Error submitting response:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">Talebi Yanıtla: {request.id}</h2>
                    <p className="text-sm text-slate-500 mt-1">{request.userName} ({request.userEmail})</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Sonuç</label>
                        <select value={newResult || ''} onChange={(e) => setNewResult(e.target.value as RequestResult)} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200">
                            <option value="Başarılı">Başarılı</option>
                            <option value="Başarısız">Başarısız</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Yanıt / Açıklama</label>
                        <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={4} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200"></textarea>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} disabled={isSubmitting} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg disabled:opacity-50">İptal</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                </div>
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
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-dark-blue">Talep Detayları: {request.id}</h2>
                    <p className="text-sm text-slate-500 mt-1">{request.userName} ({request.userEmail})</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Tür</label>
                        <p className="text-slate-700 mt-1">{request.type}</p>
                    </div>
                    {request.type === 'Danışmanlık' && request.title && (
                        <div>
                            <label className="text-sm font-medium text-slate-700">Konu</label>
                            <p className="text-slate-700 mt-1">{request.title}</p>
                        </div>
                    )}
                    {request.type === 'Tedarik' && request.productName && (
                        <div>
                            <label className="text-sm font-medium text-slate-700">Ürün Adı</label>
                            <p className="text-slate-700 mt-1">{request.productName}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-slate-700">Açıklama</label>
                        <p className="text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded-md border border-slate-200 mt-1">{request.explanation}</p>
                    </div>
                    {request.imageUrls && Array.isArray(request.imageUrls) && request.imageUrls.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-slate-700">Görseller</label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {request.imageUrls.map((url: string, index: number) => (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={url}
                                            alt={`Talep görseli ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg border border-slate-200 hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {request.referenceLink && typeof request.referenceLink === 'string' && request.referenceLink.trim().length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-slate-700">Referans Link</label>
                            <a
                                href={request.referenceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline mt-1 block"
                            >
                                {request.referenceLink}
                            </a>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">Kapat</button>
                </div>
            </div>
        </div>
    );
};


interface ManageRequestsPageProps {
    requests: Request[];
    onRespondToRequest: (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => Promise<void>;
}

const ManageRequestsPage: React.FC<ManageRequestsPageProps> = ({ requests, onRespondToRequest }) => {
    const [requestToRespond, setRequestToRespond] = useState<Request | null>(null);
    const [viewedRequest, setViewedRequest] = useState<Request | null>(null);
    const [statusFilter, setStatusFilter] = useState<'Tümü' | 'Bekliyor' | 'Tamamlandı'>('Tümü');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and search logic
    const filteredRequests = requests.filter(request => {
        // Status filter
        if (statusFilter !== 'Tümü' && request.status !== statusFilter) {
            return false;
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                request.id.toLowerCase().includes(query) ||
                request.userName.toLowerCase().includes(query) ||
                request.userEmail.toLowerCase().includes(query) ||
                request.explanation.toLowerCase().includes(query) ||
                (request.title && request.title.toLowerCase().includes(query)) ||
                (request.productName && request.productName.toLowerCase().includes(query))
            );
        }

        return true;
    });

    const handleExportToExcel = () => {
        const dataToExport = filteredRequests.map(request => ({
            'Talep ID': request.id,
            'Tür': request.type,
            'Müşteri': request.userName,
            'E-posta': request.userEmail,
            'Ürün Adı / Konu': request.type === 'Tedarik' ? (request.productName || '-') : (request.title || '-'),
            'Durum': request.status,
            'Sonuç': request.result || '-',
            'Güncelleme Tarihi': request.updated,
            'Açıklama': request.explanation.substring(0, 100) + (request.explanation.length > 100 ? '...' : ''),
            'Yanıt': request.response || '-'
        }));

        const filename = `talepler_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}`;
        exportToExcel(dataToExport, filename, 'Talepler');
    };

    return (
        <>
            {viewedRequest && <ViewRequestModal request={viewedRequest} onClose={() => setViewedRequest(null)} />}
            {requestToRespond && <ResponseModal request={requestToRespond} onClose={() => setRequestToRespond(null)} onRespond={onRespondToRequest} />}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue mb-6">Talepleri Yönet</h2>

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Talep ID, kullanıcı, açıklama ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('Tümü')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'Tümü'
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Tümü ({requests.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('Bekliyor')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'Bekliyor'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Bekliyor ({requests.filter(r => r.status === 'Bekliyor').length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('Tamamlandı')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'Tamamlandı'
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Tamamlandı ({requests.filter(r => r.status === 'Tamamlandı').length})
                        </button>
                        <button
                            onClick={handleExportToExcel}
                            className="font-semibold text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" /> Excel'e Aktar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Talep ID</th>
                                <th className="px-6 py-3">Tür</th>
                                <th className="px-6 py-3">Müşteri</th>
                                <th className="px-6 py-3">Ürün Adı / Konu</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery || statusFilter !== 'Tümü'
                                            ? 'Arama kriterlerine uygun talep bulunamadı.'
                                            : 'Henüz talep bulunmuyor.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-semibold text-primary">{req.id}</td>
                                        <td className="px-6 py-4">{req.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-dark-blue">{req.userName}</div>
                                            <div className="text-xs text-slate-500">{req.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-dark-blue max-w-xs truncate">
                                            {req.type === 'Tedarik' ? req.productName : req.title}
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => setViewedRequest(req)} className="text-slate-600 hover:text-primary font-medium">Mesaj Gör</button>
                                            <button onClick={() => setRequestToRespond(req)} className="bg-primary text-white px-4 py-1 rounded-lg hover:bg-primary/90 font-medium">Cevapla</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageRequestsPage;