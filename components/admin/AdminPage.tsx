import React, { useState, useCallback, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import ManageUsersPage from './pages/ManageUsersPage';
import UserDetailPage from './pages/UserDetailPage';
import ManageProductsPage from './pages/ManageProductsPage';
import ProductEditPage from './pages/ProductEditPage';
import ManageOrdersPage from './pages/ManageOrdersPage';
import ManageRequestsPage from './pages/ManageRequestsPage';
import ManageSupportPage from './pages/ManageSupportPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import CreateUserModal from './shared/CreateUserModal';
import SettingsPage from './pages/SettingsPage';
import AdminMenuSettingsPage from './pages/AdminMenuSettingsPage'; // New
import ManageExtraFeesPage from './pages/ManageExtraFeesPage'; // New

import { 
    Conversation, ConversationStatus, Order, OrderStatus, Request, RequestStatus, 
    RequestResult, Product, Announcement, Plan, EventPopup, InfluencerCode, NavItem, 
    // FIX: Added initialRequests to the import to resolve the undefined error.
    initialRequests,
    ExtraFee
} from '../dashboard/types';
import { User, UserStatus, initialUsers, UserRole } from './types';
import { Category, initialCategories } from '../../data/categories';

interface AdminPageProps {
  // Data props
  conversations: Conversation[];
  announcements: Announcement[];
  products: Product[];
  orders: Order[];
  plans: Plan[];
  eventPopup: EventPopup;
  influencerCodes: InfluencerCode[];
  mainNavItems: NavItem[];
  adminNavItems: NavItem[];
  extraFees: ExtraFee[];

  // Handler props
  onSendMessage: (conversationId: string, messageText: string, sender: 'user' | 'support') => void;
  onSetConversationStatus: (conversationId: string, status: ConversationStatus) => void;
  onToggleReadStatus: (conversationId: string, isRead: boolean) => void;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productName: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateTrackingInfo: (orderId: string, carrier: string, trackingNo: string) => void;
  onLogout: () => void;
  onUpdatePlans: (plans: Plan[]) => void;
  onUpdateEventPopup: (popup: EventPopup) => void;
  onUpdateInfluencerCodes: (codes: InfluencerCode[]) => void;
  onUpdateMainNavItems: (items: NavItem[]) => void;
  onUpdateAdminNavItems: (items: NavItem[]) => void;
  onSaveFee: (fee: ExtraFee) => void;
  onDeleteFee: (feeId: string) => void;
}

const pageComponents: { [key: string]: React.ComponentType<any> } = {
    'home': AdminHomePage,
    'users': ManageUsersPage,
    'products': ManageProductsPage,
    'orders': ManageOrdersPage,
    'requests': ManageRequestsPage,
    'support': ManageSupportPage,
    'categories': ManageCategoriesPage,
    'announcements': AnnouncementsPage,
    'settings': SettingsPage,
    'menu-settings': AdminMenuSettingsPage,
    'extra-fees': ManageExtraFeesPage, 
};

const pageTitles: { [key: string]: string } = {
    'home': 'Admin Paneli',
    'users': 'Kullanıcıları Yönet',
    'user-detail': 'Kullanıcı Detayları',
    'products': 'Ürünleri Yönet',
    'product-add': 'Yeni Ürün Ekle',
    'product-edit': 'Ürünü Düzenle',
    'orders': 'Siparişleri Yönet',
    'requests': 'Talepleri Yönet',
    'support': 'Destek Yönetimi',
    'categories': 'Kategorileri Yönet',
    'announcements': 'Duyuruları Yönet',
    'settings': 'Site Ayarları',
    'menu-settings': 'Admin Menü Yönetimi',
    'extra-fees': 'Ek Ücret Yönetimi',
};

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const {
        conversations, onSendMessage, onSetConversationStatus, onToggleReadStatus,
        announcements, onAddAnnouncement, onDeleteAnnouncement,
        products, onSaveProduct, onDeleteProduct,
        orders, onUpdateOrderStatus, onUpdateTrackingInfo,
        onLogout, plans, eventPopup, influencerCodes, mainNavItems, adminNavItems,
        onUpdatePlans, onUpdateEventPopup, onUpdateInfluencerCodes, onUpdateMainNavItems, onUpdateAdminNavItems,
        extraFees, onSaveFee, onDeleteFee
    } = props;
    
    const getRouteInfo = () => {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('/').filter(Boolean);
        if (parts[0] === 'admin') {
            return { page: parts[1] || 'home', param: parts[2] ? decodeURIComponent(parts[2]) : null };
        }
        return { page: 'home', param: null };
    };

    const [routeInfo, setRouteInfo] = useState(getRouteInfo());
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Admin-specific state (could be lifted to App.tsx if needed)
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [currentUser] = useState<User | null>(users.find(u => u.email === 'admin@gmail.com') || null);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);
    
    // Handlers
    const handleAdminReply = (conversationId: string, messageText: string) => {
        onSendMessage(conversationId, messageText, 'support');
    };

    const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    };

    const handleUpdateSubscriptionEndDate = (userId: string, newEndDate: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscriptionEndDate: newEndDate } : u));
    };
    
    const handleCreateUser = (newUser: { email: string; password?: string; role: UserRole; }) => {
        setUsers(prev => {
            const finalUser: User = {
                id: `user-${Date.now()}`,
                name: newUser.email.split('@')[0],
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                plan: '1 Ay',
                status: 'Aktif',
                totalSpent: 0,
                lastLogin: new Date().toISOString(),
                registrationDate: new Date().toISOString().split('T')[0],
                subscriptionStartDate: new Date().toISOString().split('T')[0],
                subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                platforms: [],
            };
            return [...prev, finalUser];
        });
        setIsCreateUserModalOpen(false);
    };

    const handleSaveProductAndNavigate = (product: Product) => {
        onSaveProduct(product);
        navigate('/admin/products');
    };
    
    const handleRespondToRequest = (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, response, status: newStatus, result: newResult } : r));
    };


    useEffect(() => {
        const handleHashChange = () => setRouteInfo(getRouteInfo());
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderActivePage = () => {
        const page = routeInfo.page;
        const param = routeInfo.param;
        
        // Handle routes with params first
        if (page === 'user-detail' && param) {
            const user = users.find(u => u.id === param);
            return <UserDetailPage user={user} navigate={navigate} onUpdateUserStatus={handleUpdateUserStatus} onUpdateSubscriptionEndDate={handleUpdateSubscriptionEndDate} />;
        }
        if (page === 'product-edit' && param) {
            const product = products.find(p => p.name === param);
            return <ProductEditPage product={product} onSave={handleSaveProductAndNavigate} navigate={navigate} />;
        }
        if (page === 'product-add') {
            return <ProductEditPage onSave={handleSaveProductAndNavigate} navigate={navigate} />;
        }

        const ActivePageComponent = pageComponents[page] || AdminHomePage;
        
        const pageProps = {
            navigate, users, products, orders, requests, conversations, announcements, categories,
            fees: extraFees,
            onAdminReply: handleAdminReply,
            onSetConversationStatus,
            onToggleReadStatus,
            onDeleteProduct,
            onUpdateOrderStatus,
            onUpdateTrackingInfo,
            // FIX: Passed the correct handler function `handleRespondToRequest` to the prop.
            onRespondToRequest: handleRespondToRequest,
            onAddAnnouncement,
            onDeleteAnnouncement,
            // FIX: Passed the correct handler function `handleUpdateUserStatus` to the prop.
            onUpdateUserStatus: handleUpdateUserStatus,
            // Settings props
            plans, onUpdatePlans,
            eventPopup, onUpdateEventPopup,
            influencerCodes, onUpdateInfluencerCodes,
            mainNavItems, onUpdateMainNavItems,
            adminNavItems, onUpdateAdminNavItems,
            // Fee props
            onSaveFee,
            onDeleteFee
        };
        
        return <ActivePageComponent {...pageProps} />;
    };

    const pageTitle = pageTitles[routeInfo.page] || 'Admin Paneli';
    
    return (
        <>
            {isCreateUserModalOpen && <CreateUserModal onClose={() => setIsCreateUserModalOpen(false)} onSave={handleCreateUser} />}
            <AdminLayout
                pageTitle={pageTitle}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                navigate={navigate}
                onLogout={onLogout}
                onCreateUser={() => setIsCreateUserModalOpen(true)}
                currentUserRole={currentUser?.role || 'member'}
                adminNavItems={adminNavItems}
            >
                {renderActivePage()}
            </AdminLayout>
        </>
    );
};

export default AdminPage;