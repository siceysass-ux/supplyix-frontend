import React, { useState, useMemo } from 'react';
import { ExtraFee } from '../../dashboard/types';
import { User } from '../types';
import StatusBadge from '../../dashboard/shared/StatusBadge';
import { PencilIcon, TrashIcon, PlusIcon } from '../../dashboard/icons/outline';
import ConfirmationModal from '../shared/ConfirmationModal';

// Modal for Adding/Editing Fees
interface FeeModalProps {
    fee?: ExtraFee | null;
    users: User[];
    onClose: () => void;
    onSave: (fee: ExtraFee) => void;
}

const FeeModal: React.FC<FeeModalProps> = ({ fee, users, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<ExtraFee>>(
        fee || { userId: '', item: '', description: '', amount: '$0.00', status: 'Beklemede' }
    );
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseFloat(value);
        setFormData(prev => ({...prev, amount: `$${!isNaN(parsedValue) ? parsedValue.toFixed(2) : '0.00'}`}));
    };
    
    const handleSave = () => {
        if (!formData.userId || !formData.item || !formData.amount) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        const feeToSave: ExtraFee = {
            id: formData.id || `fee-${Date.now()}`,
            date: formData.date || new Date().toISOString().split('T')[0],
            ...formData
        } as ExtraFee;

        onSave(feeToSave);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">{fee ? 'Ücreti Düzenle' : 'Yeni Ücret Ekle'}</h2>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                    <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Kullanıcı *</label>
                        <select name="userId" value={formData.userId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-2 rounded-md border border-slate-300 dark:border-slate-600">
                            <option value="">Kullanıcı Seçin</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Kalem *</label>
                        <input name="item" value={formData.item} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-2 rounded-md border border-slate-300 dark:border-slate-600" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Açıklama</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-2 rounded-md border border-slate-300 dark:border-slate-600"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Tutar ($) *</label>
                            <input type="number" step="0.01" value={formData.amount?.replace('$', '')} onChange={handleAmountChange} className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-2 rounded-md border border-slate-300 dark:border-slate-600" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Durum *</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-2 rounded-md border border-slate-300 dark:border-slate-600">
                                <option value="Beklemede">Beklemede</option>
                                <option value="Ödendi">Ödendi</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg">İptal</button>
                    <button onClick={handleSave} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">Kaydet</button>
                </div>
            </div>
        </div>
    );
};


interface ManageExtraFeesPageProps {
    fees: ExtraFee[];
    users: User[];
    onSaveFee: (fee: ExtraFee) => void;
    onDeleteFee: (feeId: string) => void;
}

const ManageExtraFeesPage: React.FC<ManageExtraFeesPageProps> = ({ fees, users, onSaveFee, onDeleteFee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState<ExtraFee | null>(null);
    const [feeToDelete, setFeeToDelete] = useState<ExtraFee | null>(null);
    
    const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

    const handleOpenModal = (fee: ExtraFee | null = null) => {
        setEditingFee(fee);
        setIsModalOpen(true);
    };

    const handleSave = (fee: ExtraFee) => {
        onSaveFee(fee);
        setIsModalOpen(false);
        setEditingFee(null);
    };

    const handleConfirmDelete = () => {
        if(feeToDelete) {
            onDeleteFee(feeToDelete.id);
            setFeeToDelete(null);
        }
    };

    return (
        <>
            {isModalOpen && <FeeModal fee={editingFee} users={users} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
            {feeToDelete && <ConfirmationModal title="Ücreti Sil" message={`Bu ücret kalemini kalıcı olarak silmek istediğinizden emin misiniz?`} onConfirm={handleConfirmDelete} onCancel={() => setFeeToDelete(null)} confirmText="Sil" />}
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Ek Ücretleri Yönet</h2>
                    <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus inline-flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" /> Yeni Ücret Ekle
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3">Kullanıcı</th>
                                <th className="px-6 py-3">Kalem</th>
                                <th className="px-6 py-3">Tutar</th>
                                <th className="px-6 py-3">Tarih</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {fees.map(fee => {
                                const user = usersMap.get(fee.userId);
                                return (
                                    <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            {user ? (
                                                <div>
                                                    <div className="font-medium text-dark-blue dark:text-slate-100">{user.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-500">Bilinmeyen Kullanıcı</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-dark-blue dark:text-slate-100">{fee.item}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">{fee.description}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-dark-blue dark:text-slate-100">{fee.amount}</td>
                                        <td className="px-6 py-4">{new Date(fee.date).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-4"><StatusBadge status={fee.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(fee)} className="p-2 text-primary hover:bg-primary/10 rounded-md" title="Düzenle"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => setFeeToDelete(fee)} className="p-2 text-red-600 hover:bg-red-500/10 rounded-md" title="Sil"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageExtraFeesPage;