

import React, { useState } from 'react';
import { Request, RequestStatus, RequestResult } from '../../dashboard/types';
import StatusBadge from '../../dashboard/shared/StatusBadge';

interface ResponseModalProps {
    request: Request;
    onClose: () => void;
    onRespond: (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ request, onClose, onRespond }) => {
    const [response, setResponse] = useState(request.response || '');
    const [newResult, setNewResult] = useState<RequestResult>(request.result || 'Başarılı');

    const handleSubmit = () => {
        onRespond(request.id, response, 'Tamamlandı', newResult);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">Talebi Yanıtla: {request.id}</h2>
                    <p className="text-sm text-slate-500 mt-1">{request.title}</p>
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
                    <button onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg">İptal</button>
                    <button onClick={handleSubmit} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">Gönder</button>
                </div>
            </div>
        </div>
    );
};


interface ManageRequestsPageProps {
    requests: Request[];
    onRespondToRequest: (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => void;
}

const ManageRequestsPage: React.FC<ManageRequestsPageProps> = ({ requests, onRespondToRequest }) => {
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

    return (
        <>
            {selectedRequest && <ResponseModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onRespond={onRespondToRequest} />}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue mb-6">Talepleri Yönet</h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Talep ID</th>
                                <th className="px-6 py-3">Tür</th>
                                <th className="px-6 py-3">Başlık</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3">Sonuç</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {requests.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-semibold text-primary">{req.id}</td>
                                    <td className="px-6 py-4">{req.type}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{req.title}</td>
                                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                    <td className="px-6 py-4">{req.result ? <StatusBadge status={req.result} /> : '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedRequest(req)} className="font-medium text-primary hover:underline">
                                            {req.status === 'Bekliyor' ? 'Yanıtla' : 'Görüntüle'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageRequestsPage;