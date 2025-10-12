import React, { useState, useMemo } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { ShoppingCartIcon, ChevronDownIcon, SearchIcon, CalendarDaysIcon, UserCircleIcon, MapPinIcon, TruckIcon } from '../icons/outline';
import { Order, Product } from '../types';

interface OrderCardProps {
    order: Order;
    isExpanded: boolean;
    onToggleDetails: (orderId: string) => void;
    productImages: Map<string, string>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggleDetails, productImages }) => {
    const firstProductInfo = order.products[0];
    const imageUrl = productImages.get(firstProductInfo.name);
    
    const { shippingAddress } = order;
    const fullAddress = [
        shippingAddress.address,
        shippingAddress.address2,
        `${shippingAddress.city}, ${shippingAddress.province || ''} ${shippingAddress.postcode}`,
        shippingAddress.country
    ].filter(Boolean).join(', ');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 dark:border-slate-700 gap-2">
                <div>
                    <h3 className="font-bold text-lg text-primary">{order.id}</h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400"/>
                        <span>{new Date(order.creationDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Main content */}
            <div className="p-4">
                <div className="flex items-start space-x-4">
                    {imageUrl ? (
                        <img src={imageUrl} alt={firstProductInfo.name} className="h-20 w-20 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700" />
                    ) : (
                        <div className="h-20 w-20 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
                            <ShoppingCartIcon className="h-8 w-8 text-slate-400" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-dark-blue dark:text-slate-100 truncate">{firstProductInfo.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{firstProductInfo.variationDetails}</p>
                        {order.products.length > 1 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ve {order.products.length - 1} diğer ürün</p>}
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mt-2">
                            <UserCircleIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span className="truncate">{order.shippingAddress.consignee}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-dark-blue dark:text-slate-100">{order.total}</p>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                        <h4 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-sm">Sipariş İçeriği</h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            {order.products.map((p, i) => (
                                <li key={i} className="flex justify-between">
                                    <span>{p.quantity} x {p.name} <span className="text-slate-500 dark:text-slate-400">({p.variationDetails})</span></span>
                                    <span className="font-medium">{p.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-sm">Maliyet Dökümü</h4>
                        <div className="text-sm space-y-1">
                             <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-600 dark:text-slate-300">Ara Toplam</span>
                                <span className="font-semibold text-dark-blue dark:text-slate-100">{order.subtotal}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-600 dark:text-slate-300">Kargo Toplamı</span>
                                <span className="font-semibold text-dark-blue dark:text-slate-100">{order.shippingTotal}</span>
                            </div>
                             <div className="flex justify-between items-center text-base font-bold text-primary mt-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span>Genel Toplam</span>
                                <span>{order.total}</span>
                            </div>
                        </div>
                    </div>
                     <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-sm">Teslimat Bilgileri</h4>
                        <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                            <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                            <p>{fullAddress}</p>
                        </div>
                         <div className="flex items-start text-sm text-slate-600 dark:text-slate-300 mt-2">
                            <TruckIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                            <p>Hedef: <span className="font-semibold uppercase">{order.products[0].destination}</span></p>
                        </div>
                    </div>
                    {order.trackingNumber && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-sm">Kargo Takip</h4>
                            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-start">
                                    <TruckIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-slate-500 dark:text-slate-400">{order.shippingCarrier}</p>
                                        <p className="font-mono text-dark-blue dark:text-slate-100 font-semibold">{order.trackingNumber}</p>
                                    </div>
                                </div>
                                <a href={`https://t.17track.net/en#nums=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors" title="Kargoyu 17track üzerinden takip et">
                                    <img src="/17pack.png" alt="17track" className="w-4 h-4" />
                                    <span>Takip Et</span>
                                </a>
                           </div>
                       </div>
                    )}
                </div>
            </div>
            
            {/* Footer */}
            <button onClick={() => onToggleDetails(order.id)} className="w-full text-center p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <div className="text-primary hover:text-primary-focus font-semibold inline-flex items-center text-sm">
                    <span>{isExpanded ? 'Detayları Gizle' : 'Detayları Gör'}</span>
                    <ChevronDownIcon className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
        </div>
    );
}

interface OrdersPageProps {
    navigate: (path: string) => void;
    orders: Order[];
    products: Product[];
}

const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, orders, products }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tüm Durumlar');
    const [dateFilter, setDateFilter] = useState('');
    
    const productImages = useMemo(() => {
        const map = new Map<string, string>();
        products.forEach(p => map.set(p.name, p.images[0]));
        return map;
    }, [products]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = searchTerm.trim() === '' ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.shippingAddress.consignee.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'Tüm Durumlar' || order.status === statusFilter;

            const matchesDate = dateFilter === '' || order.creationDate === dateFilter;

            return matchesSearch && matchesStatus && matchesDate;
        }).sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [orders, searchTerm, statusFilter, dateFilter]);


    const handleToggleDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const hasOrders = orders.length > 0;
    const hasFilteredOrders = filteredOrders.length > 0;

    return (
        <div>
            <PageHeader
                title="Siparişlerim"
                subtitle="Tüm siparişlerinizi görüntüleyin ve yönetin."
            />
            
            {hasOrders ? (
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="relative">
                             <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ara</label>
                             <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 pt-5 flex items-center">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="text" placeholder="Sipariş #, Müşteri Adı..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 p-2 pl-10 mt-1 rounded-md border border-slate-200 dark:border-slate-600 text-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                             <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Durum</label>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 p-2 mt-1 rounded-md border border-slate-200 dark:border-slate-600 text-sm focus:ring-primary focus:border-primary">
                                <option>Tüm Durumlar</option>
                                <option>Beklemede</option>
                                <option>Hazırlanıyor</option>
                                <option>Kargoda</option>
                                <option>Teslim Edildi</option>
                                <option>İptal</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tarih</label>
                            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 p-2 mt-1 rounded-md border border-slate-200 dark:border-slate-600 text-sm text-slate-500 focus:ring-primary focus:border-primary" />
                        </div>
                        <button onClick={() => { setSearchTerm(''); setStatusFilter('Tüm Durumlar'); setDateFilter(''); }} className="bg-dark-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-dark-blue/90 text-sm h-9">Filtreyi Temizle</button>
                    </div>
                    
                    <hr className="my-6 border-slate-200 dark:border-slate-700" />
                    
                    {/* Orders List */}
                    {hasFilteredOrders ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    isExpanded={expandedOrderId === order.id}
                                    onToggleDetails={handleToggleDetails}
                                    productImages={productImages}
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-dark-blue dark:text-slate-100">Filtreyle Eşleşen Sipariş Bulunamadı</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                         </div>
                    )}
                </div>
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