import React, { useState, useMemo, useEffect } from 'react';
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

    // Searchable Dropdown State
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Initialize search text if editing an existing fee
    useEffect(() => {
        if (formData.userId) {
            const user = users.find(u => u.id === formData.userId);
            if (user) {
                setUserSearch(`${user.name} (${user.email})`);
            }
        }
    }, [formData.userId, users]);

    const filteredUsers = useMemo(() => {
        if (!userSearch) return users;
        const lowerQuery = userSearch.toLowerCase();
        // If the search text exactly matches the selected user, show all (or just keep filtering, it's fine)
        // But we want to filter based on input
        return users.filter(u =>
            u.name.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        );
    }, [users, userSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseFloat(value);
        setFormData(prev => ({ ...prev, amount: `$${!isNaN(parsedValue) ? parsedValue.toFixed(2) : '0.00'}` }));
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

                    {/* Searchable User Select */}
                    <div className="relative">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Kullanıcı *</label>
                        <input
                            type="text"
                            placeholder="Kullanıcı ara..."
                            value={userSearch}
                            onChange={(e) => {
                                setUserSearch(e.target.value);
                                setShowUserDropdown(true);
                                // If user types, we might want to clear the selected ID until they select again
                                // But if they are just correcting a typo, maybe not. 
                                // Let's clear it to ensure consistency between text and ID.
                                if (formData.userId) {
                                    setFormData(prev => ({ ...prev, userId: '' }));
                                }
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            // Delay hiding to allow click event on dropdown items to fire
                            onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                            className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-2 rounded-md border border-slate-300 dark:border-slate-600"
                        />
                        {showUserDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(u => (
                                        <div
                                            key={u.id}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer border-b border-slate-100 dark:border-slate-600 last:border-0"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, userId: u.id }));
                                                setUserSearch(`${u.name} (${u.email})`);
                                                setShowUserDropdown(false);
                                            }}
                                        >
                                            <div className="font-medium text-dark-blue dark:text-slate-200">{u.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-slate-500 dark:text-slate-400 text-sm">Kullanıcı bulunamadı.</div>
                                )}
                            </div>
                        )}
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

    // Main page search state
    const [searchQuery, setSearchQuery] = useState('');

    const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

    const filteredFees = useMemo(() => {
        if (!searchQuery) return fees;
        const q = searchQuery.toLowerCase();
        return fees.filter(f => {
            const u = usersMap.get(f.userId);
            return (
                f.item.toLowerCase().includes(q) ||
                f.description?.toLowerCase().includes(q) ||
                f.amount.toLowerCase().includes(q) ||
                u?.name.toLowerCase().includes(q) ||
                u?.email.toLowerCase().includes(q)
            );
        });
    }, [fees, searchQuery, usersMap]);

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
        if (feeToDelete) {
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

                {/* Main Page Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Kullanıcı, kalem veya tutar ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 dark:text-slate-200 p-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
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
                            {filteredFees.length > 0 ? (
                                filteredFees.map(fee => {
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
                                                    <button onClick={() => handleOpenModal(fee)} className="p-2 text-primary hover:bg-primary/10 rounded-md" title="Düzenle"><PencilIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => setFeeToDelete(fee)} className="p-2 text-red-600 hover:bg-red-500/10 rounded-md" title="Sil"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageExtraFeesPage;