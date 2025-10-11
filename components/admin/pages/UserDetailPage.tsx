

import React from 'react';
import { User } from '../types';
import { Order } from '../../dashboard/types';
import StatusBadge from '../../dashboard/shared/StatusBadge';

interface UserDetailPageProps {
    user?: User;
    orders: Order[];
    navigate: (path: string) => void;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ user, orders, navigate }) => {
    if (!user) {
        return (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-dark-blue">Kullanıcı Bulunamadı</h2>
                <button onClick={() => navigate('/admin/users')} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg">
                    Kullanıcı Listesine Geri Dön
                </button>
            </div>
        );
    }

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-6">
            <button onClick={() => navigate('/admin/users')} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tüm Kullanıcılara Geri Dön
            </button>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-dark-blue">{user.name}</h1>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                            <StatusBadge status={user.status as any} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200 text-sm">
                            <div>
                                <p className="text-slate-500">Plan</p>
                                <p className="font-semibold text-primary">{user.plan}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Toplam Harcama</p>
                                <p className="font-semibold text-dark-blue">${user.totalSpent.toFixed(2)}</p>
                            </div>
                             <div>
                                <p className="text-slate-500">Kayıt Tarihi</p>
                                <p className="font-semibold text-dark-blue">{new Date(user.registrationDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Son Giriş</p>
                                <p className="font-semibold text-dark-blue">{new Date(user.lastLogin).toLocaleString('tr-TR')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-dark-blue mb-4">Kullanıcının Son Siparişleri</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Sipariş ID</th>
                                <th className="px-6 py-3">Tarih</th>
                                <th className="px-6 py-3">Tutar</th>
                                <th className="px-6 py-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {recentOrders.length > 0 ? recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 font-semibold text-primary">{order.id}</td>
                                    <td className="px-6 py-4">{new Date(order.creationDate).toLocaleDateString('tr-TR')}</td>
                                    <td className="px-6 py-4 font-bold">{order.total}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-slate-500">Bu kullanıcının siparişi bulunmuyor.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;