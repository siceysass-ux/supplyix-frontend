import React, { useState, useEffect, useCallback } from 'react';
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
import MotivationalModal from './shared/MotivationalModal';

import { Product, initialProducts, Order, initialOrders, Request, initialRequests, OrderStatus, RequestStatus, RequestResult, Conversation, ConversationStatus } from '../dashboard/types';
import { User, initialUsers } from './types';
import { Category, initialCategories } from '../../data/categories';

const pageTitles: { [key: string]: string } = {
    '': 'Admin Paneli',
    'users': 'Kullanıcıları Yönet',
    'user-detail': 'Kullanıcı Detayları',
    'products': 'Ürünleri Yönet',
    'product-add': 'Yeni Ürün Ekle',
    'product-edit': 'Ürünü Düzenle',
    'orders': 'Siparişleri Yönet',
    'requests': 'Talepleri Yönet',
    'support': 'Destek Talepleri',
    'categories': 'Kategorileri Yönet',
};

interface AdminPageProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, messageText: string, sender: 'user' | 'support') => void;
  onSetConversationStatus: (conversationId: string, status: ConversationStatus) => void;
  onToggleReadStatus: (conversationId: string, isRead: boolean) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ conversations, onSendMessage, onSetConversationStatus, onToggleReadStatus }) => {
    const getRouteInfo = () => {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('/').filter(Boolean);
        
        if (parts[0] === 'admin') {
            if (parts.length > 2) {
                return { page: parts[1], param: decodeURIComponent(parts[2]) };
            }
            return { page: parts[1] || '', param: null };
        }
        return { page: '', param: null };
    };

    const [routeInfo, setRouteInfo] = useState(getRouteInfo());
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showMotivation, setShowMotivation] = useState(false);

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    useEffect(() => {
        const lastLogin = localStorage.getItem('lastAdminLogin');
        const today = new Date().toDateString();
        if (lastLogin !== today) {
            setShowMotivation(true);
            localStorage.setItem('lastAdminLogin', today);
        }
    }, []);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setRouteInfo(getRouteInfo());
            setSidebarOpen(false);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleRespondToRequest = (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus, result: newResult, response } : r));
    };
    
    const handleAdminReply = (conversationId: string, message: string) => {
        onSendMessage(conversationId, message, 'support');
    };
    
     const handleDeleteProduct = (productName: string) => {
        setProducts(prev => prev.filter(p => p.name !== productName));
    };

    const handleSaveProduct = (productToSave: Product) => {
        setProducts(prev => {
            const exists = prev.some(p => p.name === productToSave.name);
            if (exists) {
                return prev.map(p => p.name === productToSave.name ? productToSave : p);
            } else {
                return [...prev, productToSave];
            }
        });
        navigate('/admin/products');
    };

    const renderActivePage = () => {
        const { page, param } = routeInfo;

        switch (page) {
            case '':
                return <AdminHomePage users={users} orders={orders} requests={requests} />;
            case 'users':
                return <ManageUsersPage users={users} navigate={navigate} />;
            case 'user-detail':
                 const user = users.find(u => u.id === param);
                 return <UserDetailPage user={user} orders={orders.filter(o => o.customer === user?.name)} navigate={navigate} />;
            case 'products':
                return <ManageProductsPage products={products} navigate={navigate} onDeleteProduct={handleDeleteProduct} />;
            case 'product-add':
                return <ProductEditPage onSave={handleSaveProduct} navigate={navigate} />;
            case 'product-edit':
                 const product = products.find(p => p.name === param);
                 return <ProductEditPage product={product} onSave={handleSaveProduct} navigate={navigate} />;
            case 'orders':
                return <ManageOrdersPage orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />;
            case 'requests':
                return <ManageRequestsPage requests={requests} onRespondToRequest={handleRespondToRequest} />;
            case 'support':
                return (
                    <ManageSupportPage 
                        conversations={conversations} 
                        onAdminReply={handleAdminReply}
                        onSetConversationStatus={onSetConversationStatus}
                        // Fix: Pass the 'onToggleReadStatus' prop correctly instead of an undefined variable.
                        onToggleReadStatus={onToggleReadStatus}
                    />
                );
            case 'categories':
                return <ManageCategoriesPage categories={categories} />;
            default:
                return <div>Sayfa bulunamadı</div>;
        }
    };
    
    const pageTitle = pageTitles[routeInfo.page] || 'Admin Paneli';

    return (
        <>
            {showMotivation && <MotivationalModal onClose={() => setShowMotivation(false)} />}
            <AdminLayout
                pageTitle={pageTitle}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                navigate={navigate}
            >
                {renderActivePage()}
            </AdminLayout>
        </>
    );
};

export default AdminPage;