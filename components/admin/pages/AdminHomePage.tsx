
import React from 'react';
import StatCard from '../shared/StatCard';
import { Order, Request } from '../../dashboard/types';
import { User } from '../types';
import { ShoppingCartIcon, UsersIcon, DocumentTextIcon } from '../../dashboard/icons/outline';
import StatusBadge from '../../dashboard/shared/StatusBadge';
import LiveVisitorCounter from '../shared/LiveVisitorCounter';

interface AdminHomePageProps {
    users: User[];
    orders: Order[];
    requests: Request[];
}

const AdminHomePage: React.FC<AdminHomePageProps> = ({ users, orders, requests }) => {
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Toplam Kullanıcı" value={users.length.toString()} icon={<UsersIcon />} color="blue" />
                <StatCard title="Toplam Sipariş" value={orders.length.toString()} icon={<ShoppingCartIcon />} color="green" />
                <StatCard title="Bekleyen Talepler" value={requests.filter(r => r.status === 'Bekliyor').length.toString()} icon={<DocumentTextIcon />} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100 mb-4">Son Siparişler</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Sipariş ID</th>
                                    <th className="px-4 py-2 text-left">Müşteri</th>
                                    <th className="px-4 py-2 text-left">Tutar</th>
                                    <th className="px-4 py-2 text-left">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-3 font-semibold text-primary">{order.id}</td>
                                        <td className="px-4 py-3 text-dark-blue dark:text-slate-200">{order.shippingAddress.consignee}</td>
                                        <td className="px-4 py-3 font-bold">{order.total}</td>
                                        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Site Activity */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                         <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100 mb-4">Site Aktivitesi</h3>
                         <LiveVisitorCounter />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
