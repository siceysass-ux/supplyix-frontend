import React from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { ShoppingCartIcon } from '../icons/outline';

const orders = [
    { id: '#S001', customer: 'Ahmet Yılmaz', total: '₺850.00', status: 'Kargoda', date: '10.10.2025' },
    { id: '#S002', customer: 'Ayşe Kaya', total: '₺450.50', status: 'Teslim Edildi', date: '08.10.2025' },
    { id: '#S003', customer: 'Mehmet Çelik', total: '₺250.00', status: 'Hazırlanıyor', date: '10.10.2025' },
    { id: '#S004', customer: 'Fatma Demir', total: '₺1,200.00', status: 'Beklemede', date: '11.10.2025' },
    { id: '#S005', customer: 'Ali Vural', total: '₺150.75', status: 'İptal', date: '07.10.2025' },
];


const OrdersPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const hasOrders = orders.length > 0;

    return (
        <div>
            <PageHeader
                title="Siparişlerim"
                subtitle="Tüm siparişlerinizi görüntüleyin ve yönetin."
            />
            
            {hasOrders ? (
                <>
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input type="text" placeholder="Sipariş # veya Müşteri Adı..." className="w-full bg-neutral p-2 rounded-md border border-gray-300 text-sm" />
                            <select className="w-full bg-neutral p-2 rounded-md border border-gray-300 text-sm">
                                <option>Tüm Durumlar</option>
                                <option>Beklemede</option>
                                <option>Hazırlanıyor</option>
                                <option>Kargoda</option>
                                <option>Teslim Edildi</option>
                                <option>İptal</option>
                            </select>
                            <input type="date" className="w-full bg-neutral p-2 rounded-md border border-gray-300 text-sm text-gray-500" />
                            <button className="bg-dark-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-dark-blue/90 text-sm">Filtrele</button>
                        </div>
                    </div>
                    {/* Orders Table */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş #</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Güncelleme</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Detay</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-blue">{order.customer}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <StatusBadge status={order.status as any} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-primary hover:text-primary-focus">Detay</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState 
                    icon={<ShoppingCartIcon className="h-12 w-12 text-gray-400" />}
                    title="Henüz siparişiniz yok"
                    message="İlk siparişiniz geldiğinde burada görünecektir. Tedarik Havuzu'na göz atın."
                    actionButton={
                        <button 
                            onClick={() => navigate('/dashboard/sourcing-pool')}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm"
                        >
                            Ürünleri Keşfet
                        </button>
                    }
                />
            )}
        </div>
    );
};

export default OrdersPage;
