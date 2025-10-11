import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../DashboardLayout';

// Import all the dashboard pages
import DashboardHomePage from './DashboardHomePage';
import MembershipPage from './MembershipPage';
import SourcingPoolPage from './SourcingPoolPage';
import FavoritesPage from './FavoritesPage';
import OrdersPage from './OrdersPage';
import RequestsPage from './RequestsPage';
import ExtraFeesPage from './ExtraFeesPage';
import SupportCenterPage from './SupportCenterPage';
import ProfileSecurityPage from './ProfileSecurityPage';
import ProductDetailPage from './ProductDetailPage';
import CartPage from './CartPage';
import { 
    Product, CartItem, Order, Request, ExtraFee, Conversation, ProductVariant, FavoriteCategory, 
    initialProducts, initialOrders, initialRequests, initialFees, initialConversations, 
    initialAnnouncements, ShippingAddress, ChatMessage, NavItem
} from '../types';


const pageComponents: { [key: string]: React.ComponentType<any> } = {
    '': DashboardHomePage,
    'dashboard': DashboardHomePage,
    'membership': MembershipPage,
    'sourcing-pool': SourcingPoolPage,
    'favorites': FavoritesPage,
    'cart': CartPage,
    'orders': OrdersPage,
    'requests': RequestsPage,
    'extra-fees': ExtraFeesPage,
    'support-center': SupportCenterPage,
    'profile-security': ProfileSecurityPage,
};

const pageTitles: { [key: string]: string } = {
    '': 'Panel Ana Sayfa',
    'dashboard': 'Panel Ana Sayfa',
    'membership': 'Planlarım',
    'sourcing-pool': 'Tedarik Havuzu',
    'favorites': 'Favorilerim',
    'cart': 'Alışveriş Sepeti',
    'orders': 'Siparişlerim',
    'requests': 'Taleplerim',
    'extra-fees': 'Ek Ücretler',
    'support-center': 'Destek Merkezi',
    'profile-security': 'Profil & Güvenlik',
    'product': 'Ürün Detayı',
};

interface DashboardPageProps {
    onLogout: () => void;
    mainNavItems: NavItem[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, mainNavItems }) => {
    const getRouteInfo = () => {
        const hash = window.location.hash.substring(1); // Remove '#'
        const parts = hash.split('/').filter(Boolean); // e.g., ['dashboard', 'product', 'product-name']
        
        if (parts[0] === 'dashboard') {
            if (parts[1] === 'product' && parts[2]) {
                return { page: 'product', param: decodeURIComponent(parts[2]) };
            }
            return { page: parts[1] || 'dashboard', param: null };
        }
        // Fallback for unexpected hash
        return { page: 'dashboard', param: null };
    };

    const [routeInfo, setRouteInfo] = useState(getRouteInfo());
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // --- Centralized State Management ---
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [fees, setFees] = useState<ExtraFee[]>(initialFees);
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);


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
    
    const handleAddToCart = (product: Product, variant: ProductVariant, destination: 'eu' | 'usa', quantity: number, podFile?: File) => {
        const cartItemId = `${product.sku}-${variant.sku}-${destination}`;

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === cartItemId);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { id: cartItemId, product, variant, quantity, destination, podFile }];
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
    
    const handleUpdatePodFile = (cartItemId: string, file: File | null) => {
        setCart(prevCart => prevCart.map(item =>
            item.id === cartItemId
                ? { ...item, podFile: file || undefined }
                : item
        ));
    };

    const handleRemoveFromCart = (cartItemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };
    
    const handlePlaceOrder = async (selectedItemIds: string[], shippingDetails: ShippingAddress) => {
        const itemsToOrder = cart.filter(item => selectedItemIds.includes(item.id));
    
        const orderProducts = await Promise.all(
            itemsToOrder.map(async (item) => ({
                name: item.product.name,
                variationDetails: Object.values(item.variant.attributes).join(', '),
                quantity: item.quantity,
                price: `$${(item.variant.price * item.quantity).toFixed(2)}`,
                destination: item.destination,
                podFileUrl: item.podFile ? await fileToBase64(item.podFile) : undefined,
                podFileName: item.podFile?.name,
            }))
        );
    
        const newOrder: Order = {
            id: `#S${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
            creationDate: new Date().toISOString().split('T')[0],
            status: 'Beklemede',
            shippingAddress: shippingDetails,
            products: orderProducts,
            subtotal: `$${itemsToOrder.reduce((sum, i) => sum + i.variant.price * i.quantity, 0).toFixed(2)}`,
            shippingTotal: `$${itemsToOrder.reduce((sum, i) => sum + (i.product.shippingInfo.shippingCosts[i.destination] + i.variant.shippingCostModifier) * i.quantity, 0).toFixed(2)}`,
            total: `$${itemsToOrder.reduce((sum, i) => sum + (i.variant.price + i.product.shippingInfo.shippingCosts[i.destination] + i.variant.shippingCostModifier) * i.quantity, 0).toFixed(2)}`,
        };
    
        setOrders(prev => [newOrder, ...prev]);
        setCart(prev => prev.filter(item => !selectedItemIds.includes(item.id)));
    };

    
    const handleAddRequest = (request: any): Promise<void> => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const newRequest: Request = {
                    ...request,
                    id: `#${request.type === 'Tedarik' ? 'T' : 'D'}${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
                    updated: new Date().toLocaleDateString('tr-TR'),
                    status: 'Bekliyor',
                    result: null,
                    userName: 'Ahmet Yılmaz',
                    userEmail: 'ahmet@sirket.com',
                };
                setRequests(prev => [newRequest, ...prev]);
                resolve();
            }, 1000);
        });
    };

    const handleSendMessage = (messageText: string) => {
        const conversation = conversations[0];
        if (conversation) {
            const newMessage: ChatMessage = { sender: 'user' as const, text: messageText, timestamp: new Date().toISOString() };
            const updatedConversation: Conversation = {
                ...conversation,
                messages: [...conversation.messages, newMessage],
                lastMessageTimestamp: newMessage.timestamp,
                isRead: true, // User sent a message, so admin should see it
            };
             setConversations(prev => [updatedConversation, ...prev.filter(c => c.id !== conversation.id)]);
        }
    };
    
    const handleAddCategory = (name: string) => {
        const newCategory: FavoriteCategory = { id: `fav-cat-${Date.now()}`, name, productNames: [] };
        setFavoriteCategories(prev => [...prev, newCategory]);
    };
    
    const handleDeleteCategory = (id: string) => {
        setFavoriteCategories(prev => prev.filter(c => c.id !== id));
    };

    const handleAssignProduct = (productName: string, categoryId: string | null) => {
        setFavoriteCategories(prev => {
            return prev.map(cat => {
                // Remove from old category
                const productNames = cat.productNames.filter(p => p !== productName);
                // Add to new category
                if (cat.id === categoryId) {
                    productNames.push(productName);
                }
                return { ...cat, productNames };
            });
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
        
        const pageProps = {
            navigate,
            products,
            toggleFavorite,
            cart,
            onUpdateCartQuantity: handleUpdateCartQuantity,
            onRemoveFromCart: handleRemoveFromCart,
            onUpdatePodFile: handleUpdatePodFile,
            onPlaceOrder: handlePlaceOrder,
            orders,
            requests,
            onAddRequest: handleAddRequest,
            fees,
            chatHistory: conversations.length > 0 ? conversations[0].messages : [],
            onSendMessage: handleSendMessage,
            announcements: initialAnnouncements,
            favoriteCategories,
            onAddCategory: handleAddCategory,
            onDeleteCategory: handleDeleteCategory,
            onAssignProduct: handleAssignProduct
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
            onLogout={onLogout}
            cart={cart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            mainNavItems={mainNavItems}
        >
            {renderActivePage()}
        </DashboardLayout>
    );
};

export default DashboardPage;