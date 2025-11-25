import React, { useState, useMemo } from 'react';
import { User, UserStatus } from '../types';
import StatusBadge from '../../dashboard/shared/StatusBadge';
import { ArrowDownTrayIcon } from '../../dashboard/icons/outline';
import CreateUserModal from '../modals/CreateUserModal';
import { exportToExcel, formatDateForExcel } from '../utils/excelExport';

interface ManageUsersPageProps {
    users: User[];
    navigate: (path: string) => void;
    onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
}

const ManageUsersPage: React.FC<ManageUsersPageProps> = ({ users, navigate, onUpdateUserStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
    const [endDateStart, setEndDateStart] = useState('');
    const [endDateEnd, setEndDateEnd] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm.trim() === '' ||
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                (user.phone && user.phone.includes(searchTerm)) ||
                (user.tcKimlik && user.tcKimlik.includes(searchTerm)) ||
                (user.vergiKimlik && user.vergiKimlik.includes(searchTerm)) ||
                (user.referans && user.referans.toLowerCase().includes(searchLower));

            const matchesPlan = planFilter === 'all' || user.plan === planFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            const matchesEndDate = (!endDateStart || new Date(user.subscriptionEndDate) >= new Date(endDateStart)) &&
                (!endDateEnd || new Date(user.subscriptionEndDate) <= new Date(endDateEnd));

            return matchesSearch && matchesPlan && matchesStatus && matchesRole && matchesEndDate;
        });
    }, [users, searchTerm, planFilter, statusFilter, roleFilter, endDateStart, endDateEnd]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setPlanFilter('all');
        setStatusFilter('all');
        setRoleFilter('all');
        setEndDateStart('');
        setEndDateEnd('');
    };

    const handleViewDetails = (userId: string) => {
        navigate(`/admin/user-detail/${userId}`);
    };

    const handleExportToExcel = () => {
        // Export filtered users, not all users
        const dataToExport = filteredUsers.map(user => ({
            'ID': user.id,
            'Ad Soyad': user.name,
            'E-posta': user.email,
            'Telefon': user.phone || '-',
            'T.C. Kimlik No': user.tcKimlik || '-',
            'Vergi Kimlik No': user.vergiKimlik || '-',
            'Referans Kodu': user.referans || '-',
            'Plan': user.plan,
            'Rol': user.role === 'admin' ? 'Admin' : user.role === 'product_admin' ? 'Ürün Yöneticisi' : user.role === 'support_admin' ? 'Destek Yöneticisi' : 'Kullanıcı',
            'Durum': user.status,
            'Kayıt Tarihi': formatDateForExcel(user.registrationDate),
            'Abonelik Başlangıcı': formatDateForExcel(user.subscriptionStartDate),
            'Abonelik Bitişi': formatDateForExcel(user.subscriptionEndDate),
            'Toplam Harcama': user.totalSpent
        }));

        const filename = `kullanicilar_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}`;
        exportToExcel(dataToExport, filename, 'Kullanıcılar');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-dark-blue">Kullanıcıları Yönet</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowCreateModal(true)} className="font-semibold text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-focus">
                        + Kullanıcı Ekle
                    </button>
                    <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="font-semibold text-sm bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50">
                        {isFilterVisible ? 'Filtreyi Gizle' : 'Filtrele'}
                    </button>
                    <button onClick={handleExportToExcel} className="font-semibold text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-4 h-4" /> Excel'e Aktar
                    </button>
                </div>
            </div>

            {isFilterVisible && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="lg:col-span-2">
                            <label className="text-xs font-semibold text-slate-500">Genel Arama</label>
                            <input type="text" placeholder="İsim, e-posta, telefon, kimlik no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 p-2 mt-1 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Plan</label>
                            <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} className="w-full bg-slate-100 p-2 mt-1 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary">
                                <option value="all">Tüm Planlar</option>
                                <option value="7 Günlük Deneme">7 Günlük Deneme</option>
                                <option value="1 Ay">1 Ay</option>
                                <option value="6 Ay">6 Ay</option>
                                <option value="1 Sene">1 Sene</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Durum</label>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full bg-slate-100 p-2 mt-1 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary">
                                <option value="all">Tüm Durumlar</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Askıya Alındı">Askıya Alındı</option>
                                <option value="İnceleniyor">İnceleniyor</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Rol</label>
                            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full bg-slate-100 p-2 mt-1 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary">
                                <option value="all">Tüm Roller</option>
                                <option value="member">Kullanıcı</option>
                                <option value="admin">Admin</option>
                                <option value="product_admin">Ürün Yöneticisi</option>
                                <option value="support_admin">Destek Yöneticisi</option>
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="text-xs font-semibold text-slate-500">Abonelik Bitiş Tarihi Aralığı</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input type="date" value={endDateStart} onChange={e => setEndDateStart(e.target.value)} className="w-full bg-slate-100 p-2 rounded-md border border-slate-200 text-sm text-slate-500 focus:ring-primary focus:border-primary" />
                                <span className="text-slate-500">-</span>
                                <input type="date" value={endDateEnd} onChange={e => setEndDateEnd(e.target.value)} className="w-full bg-slate-100 p-2 rounded-md border border-slate-200 text-sm text-slate-500 focus:ring-primary focus:border-primary" />
                            </div>
                        </div>
                        <div className="lg:col-span-2 flex items-end">
                            <button onClick={handleClearFilters} className="bg-dark-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-dark-blue/90 text-sm w-full">Filtreleri Temizle</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-3">Kullanıcı</th>
                            <th className="px-4 py-3">İletişim</th>
                            <th className="px-4 py-3">Kimlik Bilgileri</th>
                            <th className="px-4 py-3">Referans Kodu</th>
                            <th className="px-4 py-3">Rol</th>
                            <th className="px-4 py-3">Abonelik Başlangıcı</th>
                            <th className="px-4 py-3">Abonelik Bitişi</th>
                            <th className="px-4 py-3">Durum</th>
                            <th className="px-4 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-dark-blue dark:text-slate-100">{user.name}</div>
                                    <div className="text-xs">{user.email}</div>
                                </td>
                                <td className="px-4 py-3">{user.phone || '-'}</td>
                                <td className="px-4 py-3">
                                    <div className="text-xs">TC: {user.tcKimlik || '-'}</div>
                                    <div className="text-xs">Vergi: {user.vergiKimlik || '-'}</div>
                                </td>
                                <td className="px-4 py-3">{user.referans || '-'}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                        user.role === 'product_admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                            user.role === 'support_admin' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                        {user.role === 'admin' ? 'Admin' :
                                            user.role === 'product_admin' ? 'Ürün Yöneticisi' :
                                                user.role === 'support_admin' ? 'Destek Yöneticisi' :
                                                    'Kullanıcı'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{new Date(user.subscriptionStartDate).toLocaleDateString('tr-TR')}</td>
                                <td className="px-4 py-3">{new Date(user.subscriptionEndDate).toLocaleDateString('tr-TR')}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={user.status as any} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => handleViewDetails(user.id)} className="font-medium text-primary hover:underline">
                                        Profili Görüntüle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onUserCreated={() => window.location.reload()}
                />
            )}
        </div>
    );
};

export default ManageUsersPage;
