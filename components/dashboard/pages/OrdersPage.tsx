import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { ShoppingCartIcon, ChevronDownIcon } from '../icons/outline';

const orders = [
    { 
        id: '#S001', 
        customer: 'Ahmet Yılmaz', 
        total: '$85.00', 
        status: 'Kargoda' as const, 
        creationDate: '09.10.2025',
        updateDate: '10.10.2025',
        address: 'Örnek Mah. Test Sk. No:1 D:2, 34000, Beşiktaş/İstanbul',
        products: [
            { name: 'Akıllı Saat Pro X', quantity: 1, price: '$85.00' }
        ]
    },
    { 
        id: '#S002', 
        customer: 'Ayşe Kaya', 
        total: '$45.50', 
        status: 'Teslim Edildi' as const, 
        creationDate: '07.10.2025',
        updateDate: '08.10.2025',
        address: 'Deneme Cd. Yazılım Apt. No:15, 06500, Çankaya/Ankara',
        products: [
            { name: 'Kablosuz Bluetooth Kulaklık', quantity: 1, price: '$45.50' }
        ]
    },
    { 
        id: '#S003', 
        customer: 'Mehmet Çelik', 
        total: '$25.00', 
        status: 'Hazırlanıyor' as const, 
        creationDate: '10.10.2025',
        updateDate: '10.10.2025',
        address: 'Geliştirici Sk. Kod Blok No:42, 35000, Bornova/İzmir',
        products: [
            { name: 'Yoga ve Pilates Matı', quantity: 1, price: '$25.00' }
        ]
    },
    { 
        id: '#S004', 
        customer: 'Fatma Demir', 
        total: '$120.00', 
        status: 'Beklemede' as const, 
        creationDate: '11.10.2025',
        updateDate: '11.10.2025',
        address: 'Sanat Cd. Tasarım Apt. No:8, 16000, Osmangazi/Bursa',
        products: [
            { name: '4K Aksiyon Kamerası', quantity: 1, price: '$120.00' }
        ]
    },
    { 
        id: '#S005', 
        customer: 'Ali Vural', 
        total: '$15.75', 
        status: 'İptal' as const, 
        creationDate: '06.10.2025',
        updateDate: '07.10.2025',
        address: 'Ticaret Mah. İhracat Sk. No:3, 34500, Fatih/İstanbul',
        products: [
            { name: 'Dijital Mutfak Terazisi', quantity: 1, price: '$15.75' }
        ]
    },
];


const OrdersPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const hasOrders = orders.length > 0;

    const handleToggleDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <div>
            <PageHeader
                title="Siparişlerim"
                subtitle="Tüm siparişlerinizi görüntüleyin ve yönetin."
            />
            
            {hasOrders ? (
                <>
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input type="text" placeholder="Sipariş # veya Müşteri Adı..." className="w-full bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary" />
                            <select className="w-full bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary">
                                <option>Tüm Durumlar</option>
                                <option>Beklemede</option>
                                <option>Hazırlanıyor</option>
                                <option>Kargoda</option>
                                <option>Teslim Edildi</option>
                                <option>İptal</option>
                            </select>
                            <input type="date" className="w-full bg-slate-100 p-2 rounded-md border border-slate-200 text-sm text-slate-500 focus:ring-primary focus:border-primary" />
                            <button className="bg-dark-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-dark-blue/90 text-sm">Filtrele</button>
                        </div>
                    </div>
                    {/* Orders Table */}
                    <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Sipariş #</th>
                                        <th scope="col" className="px-6 py-3">Müşteri</th>
                                        <th scope="col" className="px-6 py-3">Tutar</th>
                                        <th scope="col" className="px-6 py-3">Durum</th>
                                        <th scope="col" className="px-6 py-3">Sipariş Tarihi</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Detay</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <React.Fragment key={order.id}>
                                            <tr className="hover:bg-slate-50 border-b border-slate-200 last:border-b-0">
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-dark-blue font-medium">{order.customer}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{order.creationDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleToggleDetails(order.id)} className="text-primary hover:text-primary-focus font-semibold inline-flex items-center">
                                                        Detay
                                                        <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedOrderId === order.id && (
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                                            <div className="md:col-span-2">
                                                                <h4 className="font-semibold text-dark-blue mb-2">Sipariş İçeriği</h4>
                                                                <ul className="list-disc pl-5 text-slate-600 space-y-1">
                                                                    {order.products.map((p, i) => (
                                                                        <li key={i}>{p.quantity} x {p.name} ({p.price})</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-dark-blue mb-2">Müşteri Adresi</h4>
                                                                <p className="text-slate-600">{order.address}</p>
                                                                <h4 className="font-semibold text-dark-blue mt-4 mb-2">Son Güncelleme</h4>
                                                                <p className="text-slate-600">{order.updateDate}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState 
                    icon={<ShoppingCartIcon />}
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