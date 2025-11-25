import React, { useState, useMemo } from 'react';
import PageHeader from '../shared/PageHeader';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import Pagination from '../shared/Pagination';
import { normalizeText } from '../shared/utils';
import { ShoppingCartIcon, ChevronDownIcon, SearchIcon, CalendarDaysIcon, UserCircleIcon, MapPinIcon, TruckIcon } from '../icons/outline';
import { Order, Product } from '../types';

interface OrderCardProps {
    order: Order;
    isExpanded: boolean;
    onToggleDetails: (orderId: string) => void;
    productImages: Map<string, string>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggleDetails, productImages }) => {
    // Parse JSON strings
    const products = typeof order.products === 'string' ? JSON.parse(order.products) : order.products;
    const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;

    const firstProductInfo = products[0];
    const imageUrl = productImages.get(firstProductInfo.name);

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
                        <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400" />
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
                        {products.length > 1 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ve {products.length - 1} diğer ürün</p>}
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mt-2">
                            <UserCircleIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span className="truncate">{shippingAddress.consignee}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-dark-blue dark:text-slate-100">{order.total}</p>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 space-y-4 max-h-96 overflow-y-auto">
                    <div>
                        <h4 className="font-semibold text-dark-blue dark:text-slate-200 mb-2 text-sm">Sipariş İçeriği</h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            {products.map((p, i) => (
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
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start text-slate-600 dark:text-slate-300">
                                <UserCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                                <p><span className="font-medium">Alıcı:</span> {shippingAddress.consignee}</p>
                            </div>
                            <div className="flex items-start text-slate-600 dark:text-slate-300">
                                <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                                <p>{fullAddress}</p>
                            </div>
                            {shippingAddress.phone && (
                                <div className="flex items-start text-slate-600 dark:text-slate-300">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <p><span className="font-medium">Telefon:</span> {shippingAddress.phone}</p>
                                </div>
                            )}
                            {shippingAddress.email && (
                                <div className="flex items-start text-slate-600 dark:text-slate-300">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <p><span className="font-medium">E-posta:</span> {shippingAddress.email}</p>
                                </div>
                            )}
                            <div className="flex items-start text-slate-600 dark:text-slate-300">
                                <TruckIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                                <p><span className="font-medium">Hedef:</span> <span className="font-semibold uppercase">{products[0].destination}</span></p>
                            </div>
                        </div>
                    </div>
                    {order.trackingNumber && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-600">
                                        <img src="/17pack.png" alt="17track" className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">KARGO FİRMASI: 17PACK</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Kargo Takip Numarası</p>
                                        <a
                                            href={`https://t.17track.net/en#nums=${order.trackingNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-bold text-dark-blue dark:text-slate-100 hover:text-primary transition-colors font-mono tracking-tight"
                                        >
                                            {order.trackingNumber}
                                        </a>
                                    </div>
                                </div>
                                <a
                                    href={`https://t.17track.net/en#nums=${order.trackingNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-focus transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span>Sorgula</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
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
    isSubscriptionExpired?: boolean;
    currentUser?: { id: string };
}


const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, orders, products, isSubscriptionExpired = false, currentUser }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tüm Durumlar');
    const [dateFilter, setDateFilter] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const productImages = useMemo(() => {
        const map = new Map<string, string>();
        products.forEach(p => map.set(p.name, p.images[0]));
        return map;
    }, [products]);

    // Filter orders by current user
    const userOrders = useMemo(() => {
        if (!currentUser) return orders;
        return orders.filter(order => (order as any).userId === currentUser.id);
    }, [orders, currentUser]);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    const filteredOrders = useMemo(() => {
        return userOrders.filter(order => {
            const normalizedSearch = normalizeText(searchTerm);

            // Safely get consignee name handling both object and JSON string formats
            let consigneeName = '';
            try {
                const address = typeof order.shippingAddress === 'string'
                    ? JSON.parse(order.shippingAddress)
                    : order.shippingAddress;
                consigneeName = address?.consignee || '';
            } catch (e) {
                console.error('Error parsing shipping address for order:', order.id, e);
            }

            const matchesSearch = normalizedSearch === '' ||
                normalizeText(order.id).includes(normalizedSearch) ||
                normalizeText(consigneeName).includes(normalizedSearch);

            const matchesStatus = statusFilter === 'Tüm Durumlar' || order.status === statusFilter;

            const matchesDate = dateFilter === '' || order.creationDate === dateFilter;

            return matchesSearch && matchesStatus && matchesDate;
        }).sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [userOrders, searchTerm, statusFilter, dateFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleToggleDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const hasOrders = userOrders.length > 0;
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
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                {currentOrders.map(order => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        isExpanded={expandedOrderId === order.id}
                                        onToggleDetails={handleToggleDetails}
                                        productImages={productImages}
                                    />
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-dark-blue dark:text-slate-100">Filtreyle Eşleşen Sipariş Bulunamadı</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState
                    icon={<img src="/cart-icon.png" alt="Sepet" className="w-16 h-16 mx-auto" />}
                    title="Henüz siparişiniz yok"
                    message="İlk siparişiniz geldiğinde burada görünecektir. Tedarik Havuzu'na göz atın."
                    actionButton={
                        <div className="relative group">
                            <button
                                onClick={() => !isSubscriptionExpired && navigate('/dashboard/sourcing-pool')}
                                disabled={isSubscriptionExpired}
                                className={`font-bold py-2 px-4 rounded-lg transition-colors text-sm ${isSubscriptionExpired
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary-focus'
                                    }`}
                            >
                                Ürünleri Keşfet
                            </button>
                            {isSubscriptionExpired && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    Aboneliğiniz sona erdi
                                </div>
                            )}
                        </div>
                    }
                />
            )}
        </div>
    );
};

export default OrdersPage;