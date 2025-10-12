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
import ProfileSecurityPage from './ProfileSecurityPage';
import ProductDetailPage from './ProductDetailPage';
import CartPage from './CartPage';
import SupportCenterPage from './SupportCenterPage';
import { 
    Product, CartItem, Order, Request, ExtraFee, ProductVariant, FavoriteCategory, 
    initialAnnouncements, ShippingAddress, NavItem, SupportTicket, ChatMessage, Plan, Announcement
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
    'profile-security': ProfileSecurityPage,
    'support': SupportCenterPage,
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
    'profile-security': 'Profil & Güvenlik',
    'product': 'Ürün Detayı',
    'support': 'Destek Merkezi',
};

interface DashboardPageProps {
    onLogout: () => void;
    mainNavItems: NavItem[];
    // All data now comes from props for full integration
    orders: Order[];
    products: Product[];
    requests: Request[];
    announcements: Announcement[];
    extraFees: ExtraFee[];
    supportTickets: SupportTicket[];
    // All handlers now come from props
    onAddRequest: (request: any) => Promise<void>;
    onCreateOrder: (order: Order) => void;
    onSaveFee: (fee: ExtraFee) => void;
    onSendMessageToTicket: (ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => void;
    onCreateTicket: (userId: string, subject: string, initialMessage: Pick<ChatMessage, 'text' | 'imageUrls'>) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
    onLogout, 
    mainNavItems,
    orders,
    products: productsFromProps,
    requests,
    announcements,
    extraFees,
    supportTickets,
    onAddRequest,
    onCreateOrder,
    onSaveFee,
    onSendMessageToTicket,
    onCreateTicket,
}) => {
    const getRouteInfo = () => {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('/').filter(Boolean);
        
        if (parts[0] === 'dashboard') {
            if (parts[1] === 'product' && parts[2]) {
                return { page: 'product', param: decodeURIComponent(parts[2]) };
            }
            return { page: parts[1] || 'dashboard', param: null };
        }
        return { page: 'dashboard', param: null };
    };

    const [routeInfo, setRouteInfo] = useState(getRouteInfo());
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // --- State Management ---
    // Products state is now managed here to handle favorites locally within the dashboard session
    const [products, setProducts] = useState<Product[]>(productsFromProps);
    useEffect(() => { setProducts(productsFromProps) }, [productsFromProps]);
    
    // UI-specific state or session-based state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);
    const [subscription, setSubscription] = useState({
        planName: '1 Ay',
        startDate: '2025-10-10',
        endDate: '2025-11-10',
        willRenew: true,
    });


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
                sku: item.variant.sku,
                variationDetails: Object.values(item.variant.attributes).join(', '),
                quantity: item.quantity,
                price: `$${(item.variant.price * item.quantity).toFixed(2)}`,
                destination: item.destination,
                podFileUrl: item.podFile ? await fileToBase64(item.podFile) : undefined,
                podFileName: item.podFile?.name,
            }))
        );
        
        const subtotal = itemsToOrder.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
        const shippingTotal = itemsToOrder.reduce((sum, i) => sum + (i.product.shippingInfo.shippingCosts[i.destination] + i.variant.shippingCostModifier) * i.quantity, 0);
        const total = subtotal + shippingTotal;
    
        const newOrder: Order = {
            id: `#S${String(Date.now()).slice(-4)}`,
            creationDate: new Date().toISOString().split('T')[0],
            status: 'Beklemede',
            shippingAddress: shippingDetails,
            products: orderProducts,
            subtotal: `$${subtotal.toFixed(2)}`,
            shippingTotal: `$${shippingTotal.toFixed(2)}`,
            total: `$${total.toFixed(2)}`,
        };
    
        onCreateOrder(newOrder);
        setCart(prev => prev.filter(item => !selectedItemIds.includes(item.id)));
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
                const productNames = cat.productNames.filter(p => p !== productName);
                if (cat.id === categoryId) {
                    productNames.push(productName);
                }
                return { ...cat, productNames };
            });
        });
    };
    
    const handleToggleRenewal = (renew: boolean) => {
        setSubscription(prev => ({ ...prev, willRenew: renew }));
    };
    
    const handleUpdatePlan = (plan: Plan) => {
        const calculateEndDate = (planName: string) => {
            const date = new Date();
            if (planName.includes('1 Ay')) date.setMonth(date.getMonth() + 1);
            else if (planName.includes('6 Ay')) date.setMonth(date.getMonth() + 6);
            else if (planName.includes('1 Sene')) date.setFullYear(date.getFullYear() + 1);
            else if (planName.includes('7 Gün')) date.setDate(date.getDate() + 7);
            return date.toISOString().split('T')[0];
        };

        setSubscription({
            planName: plan.name,
            startDate: new Date().toISOString().split('T')[0],
            endDate: calculateEndDate(plan.name),
            willRenew: true,
        });
    };


    useEffect(() => {
        const handleHashChange = () => {
            setRouteInfo(getRouteInfo());
            setSidebarOpen(false);
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
        
        const pageProps: any = {
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
            onAddRequest,
            fees: extraFees, // Pass down from props
            onSaveFee: onSaveFee, // Pass down from props
            announcements,
            favoriteCategories,
            onAddCategory: handleAddCategory,
            onDeleteCategory: handleDeleteCategory,
            onAssignProduct: handleAssignProduct,
            subscription,
            onToggleRenewal: handleToggleRenewal,
            onUpdatePlan: handleUpdatePlan,
        };

        if (routeInfo.page === 'support') {
            pageProps.tickets = supportTickets;
            pageProps.onSendMessage = onSendMessageToTicket;
            pageProps.onCreateTicket = (subject: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>) => 
                onCreateTicket('user-1', subject, message); // Hardcoded userId for demo
        }
        
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