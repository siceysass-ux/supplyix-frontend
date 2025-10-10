import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from './DashboardLayout';

// Import all the new dashboard pages
import DashboardHomePage from './pages/DashboardHomePage';
import MembershipPage from './pages/MembershipPage';
import SourcingPoolPage from './pages/SourcingPoolPage';
import FavoritesPage from './pages/FavoritesPage';
import OrdersPage from './pages/OrdersPage';
import RequestsPage from './pages/RequestsPage';
import ConsultingPage from './pages/ConsultingPage';
import ExtraFeesPage from './pages/ExtraFeesPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportCenterPage from './pages/SupportCenterPage';
import ProfileSecurityPage from './pages/ProfileSecurityPage';

const pageComponents: { [key: string]: React.ComponentType<any> } = {
    '': DashboardHomePage,
    'membership': MembershipPage,
    'sourcing-pool': SourcingPoolPage,
    'favorites': FavoritesPage,
    'orders': OrdersPage,
    'requests': RequestsPage,
    'consulting': ConsultingPage,
    'extra-fees': ExtraFeesPage,
    'notifications': NotificationsPage,
    'support-center': SupportCenterPage,
    'profile-security': ProfileSecurityPage,
};

const pageTitles: { [key: string]: string } = {
    '': 'Panel Ana Sayfa',
    'membership': 'Üyeliğim',
    'sourcing-pool': 'Tedarik Havuzu',
    'favorites': 'Favorilerim',
    'orders': 'Siparişlerim',
    'requests': 'Taleplerim',
    'consulting': 'Danışmanlık',
    'extra-fees': 'Ek Ücretler',
    'notifications': 'Bildirimler',
    'support-center': 'Destek Merkezi',
    'profile-security': 'Profil & Güvenlik',
};

const DashboardPage: React.FC = () => {
    const getSubRoute = () => window.location.hash.split('/dashboard/')[1] || '';
    const [subPage, setSubPage] = useState(getSubRoute());
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setSubPage(getSubRoute());
            setSidebarOpen(false); // Close sidebar on navigation
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const ActivePageComponent = pageComponents[subPage] || DashboardHomePage; // Fallback to dashboard home
    const pageTitle = pageTitles[subPage] || 'Panel Ana Sayfa';

    return (
        <DashboardLayout
            pageTitle={pageTitle}
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            navigate={navigate}
        >
            <ActivePageComponent navigate={navigate} />
        </DashboardLayout>
    );
};

export default DashboardPage;
