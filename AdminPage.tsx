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
import CreateUserModal from './shared/CreateUserModal'; // Import the modal

import { Conversation, ConversationStatus, Order, OrderStatus, Request, RequestStatus, RequestResult, Product, Announcement, initialRequests } from '../dashboard/types';
import { User, UserStatus, initialUsers, UserRole } from './types';
import { Category, initialCategories } from '../../data/categories';

interface AdminPageProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, messageText: string, sender: 'user' | 'support') => void;
  onSetConversationStatus: (conversationId: string, status: ConversationStatus) => void;
  onToggleReadStatus: (conversationId: string, isRead: boolean) => void;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productName: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateTrackingInfo: (orderId: string, carrier: string, trackingNo: string) => void;
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
};

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const {
        conversations, onSendMessage, onSetConversationStatus, onToggleReadStatus,
        announcements, onAddAnnouncement, onDeleteAnnouncement,
        products, onSaveProduct, onDeleteProduct,
        orders, onUpdateOrderStatus, onUpdateTrackingInfo
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

    // Admin-specific state
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [currentUser] = useState<User | null>(users.find(u => u.role === 'admin') || null);

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
            onAdminReply: handleAdminReply,
            onSetConversationStatus,
            onToggleReadStatus,
            onDeleteProduct: onDeleteProduct,
            onUpdateOrderStatus: onUpdateOrderStatus,
            onUpdateTrackingInfo: onUpdateTrackingInfo,
            onRespondToRequest: handleRespondToRequest,
            onAddAnnouncement: onAddAnnouncement,
            onDeleteAnnouncement: onDeleteAnnouncement,
            onUpdateUserStatus: handleUpdateUserStatus,
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
                onCreateUser={() => setIsCreateUserModalOpen(true)}
                currentUserRole={currentUser?.role || 'member'}
            >
                {renderActivePage()}
            </AdminLayout>
        </>
    );
};

export default AdminPage;