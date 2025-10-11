

import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../dashboard/types';
import StatusBadge from '../../dashboard/shared/StatusBadge';

interface ManageOrdersPageProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const ManageOrdersPage: React.FC<ManageOrdersPageProps> = ({ orders, onUpdateOrderStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        return orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [orders, searchTerm]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dark-blue">Siparişleri Yönet</h2>
                <input 
                    type="text" 
                    placeholder="Sipariş ID veya Müşteri Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                />
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Sipariş ID</th>
                            <th className="px-6 py-3">Müşteri</th>
                            <th className="px-6 py-3">Tarih</th>
                            <th className="px-6 py-3">Toplam</th>
                            <th className="px-6 py-3">Mevcut Durum</th>
                            <th className="px-6 py-3">Durumu Değiştir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-semibold text-primary">{order.id}</td>
                                <td className="px-6 py-4 text-dark-blue font-medium">{order.customer}</td>
                                <td className="px-6 py-4">{new Date(order.creationDate).toLocaleDateString('tr-TR')}</td>
                                <td className="px-6 py-4 font-bold">{order.total}</td>
                                <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                        className="bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                                    >
                                        <option>Beklemede</option>
                                        <option>Hazırlanıyor</option>
                                        <option>Kargoda</option>
                                        <option>Teslim Edildi</option>
                                        <option>İptal</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrdersPage;