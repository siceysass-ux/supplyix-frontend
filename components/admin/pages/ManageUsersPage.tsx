

import React, { useState, useMemo } from 'react';
import { User } from '../types';
import StatusBadge from '../../dashboard/shared/StatusBadge';
import { ChevronDownIcon } from '../../dashboard/icons/outline';

interface ManageUsersPageProps {
    users: User[];
    navigate: (path: string) => void;
}

const ManageUsersPage: React.FC<ManageUsersPageProps> = ({ users, navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dark-blue">Kullanıcıları Yönet</h2>
                <input
                    type="text"
                    placeholder="İsim veya E-posta Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Kullanıcı</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3">Kayıt Tarihi</th>
                            <th className="px-6 py-3">Toplam Harcama</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <div className="font-medium text-dark-blue">{user.name}</div>
                                        <div className="text-slate-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{user.plan}</td>
                                <td className="px-6 py-4"><StatusBadge status={user.status as any} /></td>
                                <td className="px-6 py-4">{new Date(user.registrationDate).toLocaleDateString('tr-TR')}</td>
                                <td className="px-6 py-4 font-semibold">${user.totalSpent.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => navigate(`/admin/user-detail/${user.id}`)}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Detayları Gör
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;