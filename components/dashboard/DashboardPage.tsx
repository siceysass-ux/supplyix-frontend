import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './DashboardLayout';

// Import all the dashboard pages
import DashboardHomePage from './pages/DashboardHomePage';
import MembershipPage from './pages/MembershipPage';
import SourcingPoolPage from './pages/SourcingPoolPage';
import FavoritesPage from './pages/FavoritesPage';
import OrdersPage from './pages/OrdersPage';
import RequestsPage from './pages/RequestsPage';
import ExtraFeesPage from './pages/ExtraFeesPage';
import SupportCenterPage from './pages/SupportCenterPage';
import ProfileSecurityPage from './pages/ProfileSecurityPage';
import ProductDetailPage from './pages/ProductDetailPage'; // New import
import { Product, initialProducts } from './types';


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
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    const toggleFavorite = (productName: string) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.name === productName ? { ...p, isFavorite: !p.isFavorite } : p
            )
        );
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
                />
            );
        }
        
        const ActivePageComponent = pageComponents[routeInfo.page] || DashboardHomePage;
        return (
            <ActivePageComponent
                navigate={navigate}
                products={products}
                toggleFavorite={toggleFavorite}
            />
        );
    };
    
    const pageTitle = pageTitles[routeInfo.page] || 'Panel Ana Sayfa';

    return (
        <DashboardLayout
            pageTitle={pageTitle}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            navigate={navigate}
        >
            {renderActivePage()}
        </DashboardLayout>
    );
};

export default DashboardPage;