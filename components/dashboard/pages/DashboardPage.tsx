import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './DashboardLayout';

// Import all the dashboard pages
import DashboardHomePage from './pages/DashboardHomePage';
import MembershipPage from './pages/MembershipPage';
import SourcingPoolPage from './pages/SourcingPoolPage';
import FavoritesPage from './pages/FavoritesPage';
import OrdersPage, { orders as initialOrders } from './pages/OrdersPage';
import RequestsPage, { requests as initialRequests } from './pages/RequestsPage';
import ExtraFeesPage, { fees as initialFees } from './pages/ExtraFeesPage';
import SupportCenterPage, { tickets as initialTickets } from './pages/SupportCenterPage';
import ProfileSecurityPage from './pages/ProfileSecurityPage';
import ProductDetailPage from './pages/ProductDetailPage'; // New import
import { Product, initialProducts, CartItem, Order, Request, ExtraFee, SupportTicket, RequestType, TicketStatus } from './types';


const pageComponents: { [key: string]: React.ComponentType<any> } = {
    '': DashboardHomePage,
    'membership': MembershipPage,
    'sourcing-pool': SourcingPoolPage,
    'favorites': FavoritesPage,
    'orders': OrdersPage,
    'requests': RequestsPage,
    'extra-fees': ExtraFeesPage,
    'support-center': SupportCenterPage,
    'profile-security': ProfileSecurityPage,
};

const pageTitles: { [key: string]: string } = {
    '': 'Panel Ana Sayfa',
    'membership': 'Planlarım',
    'sourcing-pool': 'Tedarik Havuzu',
    'favorites': 'Favorilerim',
    'orders': 'Siparişlerim',
    'requests': 'Taleplerim',
    'extra-fees': 'Ek Ücretler',
    'support-center': 'Destek Merkezi',
    'profile-security': 'Profil & Güvenlik',
    'product': 'Ürün Detayı', // New title
};

const DashboardPage: React.FC = () => {
    const getRouteInfo = () => {
        const hash = window.location.hash.substring(1); // Remove '#'
        const parts = hash.split('/').filter(Boolean); // e.g., ['dashboard', 'product', 'product-name']
        
        if (parts[0] === 'dashboard') {
            if (parts[1] === 'product' && parts[2]) {
                return { page: 'product', param: decodeURIComponent(parts[2]) };
            }
            return { page: parts[1] || '', param: null };
        }
        return { page: '', param: null };
    };

    const [routeInfo, setRouteInfo] = useState(getRouteInfo());
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // --- Centralized State Management ---
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [fees, setFees] = useState<ExtraFee[]>(initialFees);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialTickets);


    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    // --- Handler Functions ---
    const toggleFavorite = (productName: string) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.name === productName ? { ...p, isFavorite: !p.isFavorite } : p
            )
        );
    };
    
    const handleAddToCart = (product: Product, variations: Record<string, string>, quantity: number = 1) => {
        const variationString = Object.entries(variations)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([, value]) => value)
            .join('-');
        const cartItemId = `${product.sku}-${variationString}`;

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === cartItemId);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { id: cartItemId, product, quantity, selectedVariations: variations }];
            }
        });
    };

    const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== cartItemId);
            }
            return prevCart.map(item =>
                item.id === cartItemId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };

    const handleRemoveFromCart = (cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    };
    
    const handleAddRequest = (request: { type: RequestType; title: string; explanation: string; }) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const newRequest: Request = {
                    ...request,
                    id: `#${request.type === 'Tedarik' ? 'T' : 'D'}${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
                    updated: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    status: 'Bekliyor',
                    result: null,
                };
                setRequests(prev => [newRequest, ...prev]);
                resolve();
            }, 1500);
        });
    };

    const handleAddSupportTicket = (ticket: { subject: string; priority: string; description: string; }) => {
        return new Promise<void>((resolve) => {
           setTimeout(() => {
               const newTicket: SupportTicket = {
                   subject: ticket.subject,
                   id: `#D${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
                   updated: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                   status: 'Açık',
               };
               setSupportTickets(prev => [newTicket, ...prev]);
               resolve();
           }, 1500);
       });
   };


    useEffect(() => {
        const handleHashChange = () => {
            setRouteInfo(getRouteInfo());
            setSidebarOpen(false); // Close sidebar on navigation
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const renderActivePage = () => {
        if (routeInfo.page === 'product' && routeInfo.param) {
            const product = products.find(p => p.name === routeInfo.param);
            return (
                <ProductDetailPage
                    product={product}
                    navigate={navigate}
                    toggleFavorite={toggleFavorite}
                    addToCart={handleAddToCart}
                />
            );
        }
        
        const ActivePageComponent = pageComponents[routeInfo.page] || DashboardHomePage;
        
        // Pass relevant state and handlers to each page
        const pageProps: { [key: string]: any } = {
            navigate,
            products,
            toggleFavorite,
            orders,
            requests,
            onAddRequest: handleAddRequest,
            fees,
            supportTickets,
            onAddSupportTicket: handleAddSupportTicket,
        };
        
        return <ActivePageComponent {...pageProps} />;
    };
    
    const pageTitle = pageTitles[routeInfo.page] || 'Panel Ana Sayfa';

    return (
        <DashboardLayout
            pageTitle={pageTitle}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            navigate={navigate}
            cart={cart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
        >
            {renderActivePage()}
        </DashboardLayout>
    );
};

export default DashboardPage;