import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, OrderProduct } from '../../dashboard/types';
import StatusBadge from '../../dashboard/shared/StatusBadge';
import { PencilIcon, EyeIcon, ArrowDownTrayIcon, UserCircleIcon, MapPinIcon, TruckIcon } from '../../dashboard/icons/outline';

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    const { shippingAddress } = order;
    const fullAddress = [
        shippingAddress.address,
        shippingAddress.address2,
        `${shippingAddress.city}, ${shippingAddress.province || ''} ${shippingAddress.postcode}`,
        shippingAddress.country
    ].filter(Boolean).join(', ');

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Sipariş Detayı: {order.id}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(order.creationDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-md">Müşteri Bilgileri</h3>
                        <div className="text-sm bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                                <UserCircleIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-600 dark:text-slate-300">Alıcı</p>
                                    <p className="text-slate-800 dark:text-slate-100">{shippingAddress.consignee}</p>
                                    {shippingAddress.email && <p className="text-xs text-slate-500 dark:text-slate-400">{shippingAddress.email}</p>}
                                    {shippingAddress.phone && <p className="text-xs text-slate-500 dark:text-slate-400">{shippingAddress.phone}</p>}
                                </div>
                            </div>
                             <div className="flex items-start gap-2">
                                <MapPinIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-600 dark:text-slate-300">Teslimat Adresi</p>
                                    <p className="text-slate-800 dark:text-slate-100">{fullAddress}</p>
                                </div>
                            </div>
                             {order.shippingCarrier && (
                                 <div className="flex items-center justify-between col-span-1 md:col-span-2">
                                     <div className="flex items-start gap-2">
                                        <TruckIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-slate-600 dark:text-slate-300">Kargo Bilgisi</p>
                                            <p className="text-slate-800 dark:text-slate-100">{order.shippingCarrier} - <span className="font-mono text-primary">{order.trackingNumber}</span></p>
                                        </div>
                                    </div>
                                    <a href={`https://t.17track.net/en#nums=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors" title="Kargoyu 17track üzerinden takip et">
                                        <img src="/17pack.png" alt="17track" className="w-4 h-4" />
                                        <span>Takip Et</span>
                                    </a>
                                </div>
                             )}
                        </div>
                    </div>
                    {/* Products */}
                    <div>
                        <h3 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-md">Sipariş İçeriği</h3>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-600 dark:text-slate-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Ürün</th>
                                        <th className="px-4 py-2 text-left">Adet</th>
                                        <th className="px-4 py-2 text-left">Hedef</th>
                                        <th className="px-4 py-2 text-right">Tutar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {order.products.map((p, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-dark-blue dark:text-slate-100">{p.name}</p>
                                                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">SKU: {p.sku}</p>
                                                {p.variationDetails && <p className="text-xs text-slate-500 dark:text-slate-400">{p.variationDetails}</p>}
                                                {p.podFileUrl && (
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <a href={p.podFileUrl} target="_blank" rel="noopener noreferrer">
                                                            <img src={p.podFileUrl} alt="Baskı önizlemesi" className="w-12 h-12 object-cover rounded border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform" />
                                                        </a>
                                                        <div>
                                                            <a
                                                                href={p.podFileUrl}
                                                                download={p.podFileName}
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                            >
                                                                <ArrowDownTrayIcon className="w-3 h-3" /> Baskı Dosyasını İndir
                                                            </a>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{p.podFileName}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-800 dark:text-slate-100">{p.quantity}</td>
                                            <td className="px-4 py-3 uppercase text-slate-800 dark:text-slate-100">{p.destination}</td>
                                            <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-100">{p.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Totals */}
                     <div>
                        <h3 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-md">Maliyet Dökümü</h3>
                        <div className="text-sm space-y-2 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                             <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-600 dark:text-slate-300">Ara Toplam</span>
                                <span className="font-semibold text-dark-blue dark:text-slate-100">{order.subtotal}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-600 dark:text-slate-300">Kargo Toplamı</span>
                                <span className="font-semibold text-dark-blue dark:text-slate-100">{order.shippingTotal}</span>
                            </div>
                             <div className="flex justify-between items-center text-base font-bold text-primary mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span>Genel Toplam</span>
                                <span>{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus">Kapat</button>
                </div>
            </div>
        </div>
    );
};

interface TrackingInfoModalProps {
    order: Order;
    onClose: () => void;
    onSave: (carrier: string, trackingNo: string) => void;
}

const TrackingInfoModal: React.FC<TrackingInfoModalProps> = ({ order, onClose, onSave }) => {
    const [carrier, setCarrier] = useState(order.shippingCarrier || '');
    const [trackingNo, setTrackingNo] = useState(order.trackingNumber || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (carrier.trim() && trackingNo.trim()) {
            setIsSaving(true);
            // Simulate network delay for better UX feedback
            setTimeout(() => {
                onSave(carrier, trackingNo);
                // No need to set isSaving back to false, as the component will unmount on success
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Kargo Bilgilerini Düzenle</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sipariş ID: {order.id}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kargo Firması *</label>
                        <input
                            type="text"
                            value={carrier}
                            onChange={e => setCarrier(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kargo Takip Numarası *</label>
                        <input
                            type="text"
                            value={trackingNo}
                            onChange={e => setTrackingNo(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600"
                            required
                        />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} disabled={isSaving} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50">İptal</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:bg-primary/70 disabled:cursor-wait">
                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};


interface ManageOrdersPageProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
    onUpdateTrackingInfo: (orderId: string, carrier: string, trackingNo: string) => void;
}

const ManageOrdersPage: React.FC<ManageOrdersPageProps> = ({ orders, onUpdateOrderStatus, onUpdateTrackingInfo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = searchTerm.trim() === '' ||
                order.id.toLowerCase().includes(searchLower) ||
                order.shippingAddress.consignee.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [orders, searchTerm, statusFilter]);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        onUpdateOrderStatus(orderId, newStatus);
    };

    return (
        <>
        {viewingOrder && <OrderDetailModal order={viewingOrder} onClose={() => setViewingOrder(null)} />}
        {editingOrder && (
            <TrackingInfoModal
                order={editingOrder}
                onClose={() => setEditingOrder(null)}
                onSave={(carrier, trackingNo) => {
                    onUpdateTrackingInfo(editingOrder.id, carrier, trackingNo);
                    setEditingOrder(null);
                }}
            />
        )}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100 mb-6">Siparişleri Yönet</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Sipariş ID veya Müşteri Adı..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-sm focus:ring-primary focus:border-primary"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md border border-slate-200 dark:border-slate-600 text-sm focus:ring-primary focus:border-primary"
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="Beklemede">Beklemede</option>
                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                    <option value="Kargoda">Kargoda</option>
                    <option value="Teslim Edildi">Teslim Edildi</option>
                    <option value="İptal">İptal</option>
                </select>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3">Sipariş ID</th>
                            <th className="px-6 py-3">Müşteri</th>
                            <th className="px-6 py-3">Tutar</th>
                            <th className="px-6 py-3">Kargo Bilgisi</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 font-semibold text-primary">{order.id}</td>
                                <td className="px-6 py-4 font-medium text-dark-blue dark:text-slate-100">{order.shippingAddress.consignee}</td>
                                <td className="px-6 py-4 font-bold text-dark-blue dark:text-slate-100">{order.total}</td>
                                <td className="px-6 py-4">
                                    {order.shippingCarrier && order.trackingNumber ? (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-dark-blue dark:text-slate-200">{order.shippingCarrier}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{order.trackingNumber}</div>
                                            </div>
                                            <a href={`https://t.17track.net/en#nums=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-primary rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Kargoyu 17track üzerinden takip et">
                                                <img src="/17pack.png" alt="17track" className="w-5 h-5" />
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">Girilmedi</span>
                                    )}
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => setViewingOrder(order)} className="p-2 text-slate-500 hover:text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10" title="Detayları Gör">
                                            <EyeIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => setEditingOrder(order)} className="p-2 text-slate-500 hover:text-primary rounded-md hover:bg-primary/10" title="Kargo Bilgisi Ekle/Düzenle">
                                            <PencilIcon className="w-5 h-5"/>
                                        </button>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-xs focus:ring-primary focus:border-primary"
                                        >
                                            <option>Beklemede</option>
                                            <option>Hazırlanıyor</option>
                                            <option>Kargoda</option>
                                            <option>Teslim Edildi</option>
                                            <option>İptal</option>
                                        </select>
                                    </div>
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

export default ManageOrdersPage;