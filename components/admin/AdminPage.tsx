import React, { useState, useCallback, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import ManageUsersPage from './pages/ManageUsersPage';
import UserDetailPage from './pages/UserDetailPage';
import ManageProductsPage from './pages/ManageProductsPage';
import ProductEditPage from './pages/ProductEditPage';
import ManageOrdersPage from './pages/ManageOrdersPage';
import ManageRequestsPage from './pages/ManageRequestsPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import CreateUserModal from './shared/CreateUserModal';
import SettingsPage from './pages/SettingsPage';
import AdminMenuSettingsPage from './pages/AdminMenuSettingsPage'; // New
import ManageExtraFeesPage from './pages/ManageExtraFeesPage'; // New
import ManageSupportPage from './pages/ManageSupportPage'; // New

import { 
    Order, OrderStatus, Request, RequestStatus, 
    RequestResult, Product, Announcement, Plan, EventPopup, InfluencerCode, NavItem, 
    ExtraFee, SupportTicket, TicketStatus, ChatMessage
} from '../dashboard/types';
import { User, UserStatus, UserRole } from './types';
import { Category, initialCategories } from '../../data/categories';

interface AdminPageProps {
  // Data props
  announcements: Announcement[];
  products: Product[];
  orders: Order[];
  plans: Plan[];
  eventPopup: EventPopup;
  influencerCodes: InfluencerCode[];
  mainNavItems: NavItem[];
  adminNavItems: NavItem[];
  extraFees: ExtraFee[];
  supportTickets: SupportTicket[];
  users: User[];
  requests: Request[];

  // Handler props
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
  onSendMessageToTicket: (ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => void;
  onChangeTicketStatus: (ticketId: string, status: TicketStatus) => void;
  onMarkTicketAsRead: (ticketId: string) => void;
  onCreateAdminUser: (newUser: { email: string; password?: string; role: UserRole; }) => void;
  onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
  onUpdateSubscriptionEndDate: (userId: string, newEndDate: string) => void;
  onRespondToRequest: (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => void;
}

const pageComponents: { [key: string]: React.ComponentType<any> } = {
    'home': AdminHomePage,
    'users': ManageUsersPage,
    'products': ManageProductsPage,
    'orders': ManageOrdersPage,
    'requests': ManageRequestsPage,
    'categories': ManageCategoriesPage,
    'announcements': AnnouncementsPage,
    'settings': SettingsPage,
    'menu-settings': AdminMenuSettingsPage,
    'extra-fees': ManageExtraFeesPage, 
    'support': ManageSupportPage,
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
    'categories': 'Kategorileri Yönet',
    'announcements': 'Duyuruları Yönet',
    'settings': 'Site Ayarları',
    'menu-settings': 'Admin Menü Yönetimi',
    'extra-fees': 'Ek Ücret Yönetimi',
    'support': 'Destek Yönetimi',
};

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const {
        announcements, onAddAnnouncement, onDeleteAnnouncement,
        products, onSaveProduct, onDeleteProduct,
        orders, onUpdateOrderStatus, onUpdateTrackingInfo,
        onLogout, plans, eventPopup, influencerCodes, mainNavItems, adminNavItems,
        onUpdatePlans, onUpdateEventPopup, onUpdateInfluencerCodes, onUpdateMainNavItems, onUpdateAdminNavItems,
        extraFees, onSaveFee, onDeleteFee,
        supportTickets, onSendMessageToTicket, onChangeTicketStatus, onMarkTicketAsRead,
        users, onCreateAdminUser, onUpdateUserStatus, onUpdateSubscriptionEndDate,
        requests, onRespondToRequest,
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
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [currentUser] = useState<User | null>(users.find(u => u.email === 'admin@gmail.com') || null);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);
    
    const handleSaveProductAndNavigate = (product: Product) => {
        onSaveProduct(product);
        navigate('/admin/products');
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
            return <UserDetailPage user={user} navigate={navigate} onUpdateUserStatus={onUpdateUserStatus} onUpdateSubscriptionEndDate={onUpdateSubscriptionEndDate} />;
        }
        if (page === 'product-edit' && param) {
            const product = products.find(p => p.name === param);
            return <ProductEditPage product={product} onSave={handleSaveProductAndNavigate} navigate={navigate} />;
        }
        if (page === 'product-add') {
            return <ProductEditPage onSave={handleSaveProductAndNavigate} navigate={navigate} />;
        }

        const ActivePageComponent = pageComponents[page] || AdminHomePage;
        
        const pageProps: any = {
            navigate, users, products, orders, requests, announcements, categories,
            fees: extraFees,
            onDeleteProduct,
            onUpdateOrderStatus,
            onUpdateTrackingInfo,
            onRespondToRequest: onRespondToRequest,
            onAddAnnouncement,
            onDeleteAnnouncement,
            onUpdateUserStatus: onUpdateUserStatus,
            // Settings props
            plans, onUpdatePlans,
            eventPopup, onUpdateEventPopup,
            influencerCodes, onUpdateInfluencerCodes,
            mainNavItems, onUpdateMainNavItems,
            adminNavItems, onUpdateAdminNavItems,
            // Fee props
            onSaveFee,
            onDeleteFee,
            // Support props
            supportTickets,
            onSendMessageToTicket,
            onChangeTicketStatus,
            onMarkTicketAsRead
        };
        
        return <ActivePageComponent {...pageProps} />;
    };

    const pageTitle = pageTitles[routeInfo.page] || 'Admin Paneli';
    
    return (
        <>
            {isCreateUserModalOpen && <CreateUserModal onClose={() => setIsCreateUserModalOpen(false)} onSave={onCreateAdminUser} />}
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