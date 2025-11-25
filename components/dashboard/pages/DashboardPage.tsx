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

import * as api from '../../../src/services/api';

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
    'product': ProductDetailPage,
    'support': SupportCenterPage,
};

const pageTitles: { [key: string]: string } = {
    '': 'Satıcı Paneli Ana Sayfa',
    'dashboard': 'Satıcı Paneli Ana Sayfa',
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
    currentUser: { id: string; plan: string; subscriptionStartDate: string; subscriptionEndDate: string; };
    // All data now comes from props for full integration
    orders: Order[];
    products: Product[];
    requests: Request[];
    announcements: Announcement[];
    extraFees: ExtraFee[];
    supportTickets: SupportTicket[];
    categories: any[];
    // All handlers now come from props
    onAddRequest: (request: any) => Promise<void>;
    onCreateOrder: (order: Order) => void;
    onSaveFee: (fee: ExtraFee) => void;
    onSendMessageToTicket: (ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => void;
    onCreateTicket: (userId: string, subject: string, initialMessage: Pick<ChatMessage, 'text' | 'imageUrls'>) => void;
    onMarkTicketAsRead: (ticketId: string, role: 'admin' | 'user') => void;
    onUploadFile: (file: File) => Promise<string>;
}


const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const {
        onLogout, mainNavItems, currentUser,
        orders, products: productsFromProps, requests, announcements, extraFees, supportTickets, categories,
        onAddRequest, onCreateOrder, onSaveFee, onSendMessageToTicket, onCreateTicket, onMarkTicketAsRead, onUploadFile
    } = props;

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

    // Authentication check - redirect to login if not authenticated
    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.hash = '/login';
        }
    }, []);

    // --- State Management ---
    // Store favorites locally to persist across product updates
    const [favorites, setFavorites] = useState<Product[]>([]);

    // Products state is now managed here to handle favorites locally within the dashboard session
    const [products, setProducts] = useState<Product[]>(productsFromProps);

    // Sync products from props AND merge with local favorites state
    useEffect(() => {
        console.log('🔄 Syncing products from props:', productsFromProps.length);
        setProducts(prevProducts => {
            return productsFromProps.map(p => {
                const isFav = favorites.some(f => f.id === p.id);
                return { ...p, isFavorite: isFav };
            });
        });
    }, [productsFromProps, favorites]);

    // UI-specific state or session-based state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);
    const [subscription, setSubscription] = useState({
        planName: currentUser.plan,
        startDate: currentUser.subscriptionStartDate,
        endDate: currentUser.subscriptionEndDate,
        willRenew: true,
    });

    // Fetch Cart and Favorites on mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser.id) {
                console.log('❌ No currentUser.id, skipping fetch');
                return;
            }

            console.log('🚀 Fetching user data for:', currentUser.id);

            try {
                // Fetch Cart
                const cartData = await api.getCart(currentUser.id);
                console.log('🛒 Cart data fetched:', cartData);

                // Try to restore POD file info from localStorage
                const localCartData = localStorage.getItem(`cart_${currentUser.id}`);
                let localCart: any[] = [];
                if (localCartData) {
                    try {
                        localCart = JSON.parse(localCartData);
                        console.log('💾 Local cart data restored:', localCart);
                    } catch (e) {
                        console.error('Failed to parse local cart:', e);
                    }
                }

                if (Array.isArray(cartData)) {
                    // Merge server cart with local POD file info
                    const mergedCart = cartData.map(item => {
                        const localItem = localCart.find(local => local.id === item.id);
                        if (localItem && (localItem.podFileUrl || localItem.podFileName)) {
                            return {
                                ...item,
                                podFileUrl: localItem.podFileUrl,
                                podFileName: localItem.podFileName
                            };
                        }
                        return item;
                    });
                    setCart(mergedCart);
                }

                // Fetch Favorites
                const favoritesData = await api.getFavorites(currentUser.id);
                console.log('❤️ Favorites data fetched:', favoritesData);

                if (Array.isArray(favoritesData)) {
                    setFavorites(favoritesData); // Update local favorites state

                    // Update products immediately
                    setProducts(prevProducts => {
                        console.log('Current products state before update:', prevProducts.length);
                        const updated = prevProducts.map(p => {
                            const isFav = favoritesData.some((f: Product) => f.id === p.id);
                            if (isFav) console.log(`✅ Marking ${p.name} as favorite`);
                            return { ...p, isFavorite: isFav };
                        });
                        return updated;
                    });
                }

                // Fetch Favorite Categories
                const categoriesData = await api.getFavoriteCategories(currentUser.id);
                console.log('📁 Favorite categories fetched:', categoriesData);
                if (Array.isArray(categoriesData)) {
                    setFavoriteCategories(categoriesData.map((cat: any) => ({
                        id: cat.id,
                        name: cat.name,
                        productNames: JSON.parse(cat.productIds).map((id: string) =>
                            products.find(p => p.id === id)?.name
                        ).filter(Boolean)
                    })));
                }

            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, [currentUser.id]);

    // Check if subscription is expired
    const isSubscriptionExpired = new Date() > new Date(subscription.endDate);

    // Update subscription when currentUser changes (e.g., after admin updates)
    useEffect(() => {
        setSubscription({
            planName: currentUser.plan,
            startDate: currentUser.subscriptionStartDate,
            endDate: currentUser.subscriptionEndDate,
            willRenew: true,
        });
    }, [currentUser.plan, currentUser.subscriptionStartDate, currentUser.subscriptionEndDate]);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    // --- Handler Functions ---
    const toggleFavorite = async (productName: string) => {
        const product = products.find(p => p.name === productName);
        if (!product) return;

        // Optimistic update
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.name === productName ? { ...p, isFavorite: !p.isFavorite } : p
            )
        );

        // Update local favorites state to keep it in sync
        setFavorites(prev => {
            if (product.isFavorite) {
                // Removing
                return prev.filter(f => f.id !== product.id);
            } else {
                // Adding
                return [...prev, product];
            }
        });

        try {
            await api.toggleFavorite(currentUser.id, product.id);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Revert on error
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.name === productName ? { ...p, isFavorite: !p.isFavorite } : p
                )
            );
            // Revert local favorites state
            setFavorites(prev => {
                if (product.isFavorite) {
                    return [...prev, product];
                } else {
                    return prev.filter(f => f.id !== product.id);
                }
            });
        }
    };

    const handleAddToCart = async (product: Product, variant: ProductVariant, destination: 'eu' | 'usa', quantity: number, podFile?: File) => {
        const cartItemId = `${product.sku}-${variant.sku}-${destination}`;

        // Upload POD file first if exists
        let podFileUrl = undefined;
        let podFileName = undefined;
        if (podFile) {
            try {
                const uploadResult = await api.uploadImage(podFile);
                podFileUrl = uploadResult.url;
                podFileName = podFile.name;
            } catch (error) {
                console.error('Failed to upload POD file:', error);
                alert('Baskı dosyası yüklenemedi. Lütfen tekrar deneyin.');
                return;
            }
        }

        // Optimistic update with POD file info
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === cartItemId);
            let newCart;
            if (existingItem) {
                newCart = prevCart.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + quantity, podFileUrl, podFileName }
                        : item
                );
            } else {
                newCart = [...prevCart, {
                    id: cartItemId,
                    product,
                    variant,
                    quantity,
                    destination,
                    podFile,
                    podFileUrl,
                    podFileName
                }];
            }

            // Save to localStorage for persistence
            localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(newCart.map(item => ({
                id: item.id,
                productId: item.product.id,
                variantSku: item.variant.sku,
                quantity: item.quantity,
                destination: item.destination,
                podFileUrl: item.podFileUrl,
                podFileName: item.podFileName
            }))));

            return newCart;
        });

        try {
            await api.addToCart(currentUser.id, product, variant, quantity, destination, podFileUrl);

            // Refresh cart to get server IDs
            const updatedCart = await api.getCart(currentUser.id);
            if (Array.isArray(updatedCart)) {
                setCart(updatedCart);

                // Update localStorage with fresh data
                localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(updatedCart.map(item => ({
                    id: item.id,
                    productId: item.product.id,
                    variantSku: item.variant.sku,
                    quantity: item.quantity,
                    destination: item.destination,
                    podFileUrl: item.podFileUrl,
                    podFileName: item.podFileName
                }))));
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const handleUpdateCartQuantity = async (cartItemId: string, newQuantity: number) => {
        // Optimistic update
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

        try {
            await api.updateCartItem(currentUser.id, cartItemId, newQuantity);
        } catch (error) {
            console.error('Failed to update cart quantity:', error);
        }
    };

    const handleUpdatePodFile = async (cartItemId: string, file: File | null) => {
        try {
            let podFileUrl = null;
            if (file) {
                const uploadResult = await api.uploadImage(file);
                podFileUrl = uploadResult.url;
            }

            await api.updateCartItemPodFile(cartItemId, podFileUrl);

            // Update local state
            setCart(prevCart => prevCart.map(item =>
                item.id === cartItemId
                    ? { ...item, podFileUrl, podFile: file || undefined }
                    : item
            ));
        } catch (error) {
            console.error('Failed to update POD file:', error);
        }
    };

    const handleRemoveFromCart = async (cartItemId: string) => {
        // Optimistic update
        setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));

        try {
            await api.removeFromCart(cartItemId);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
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
                podFileUrl: item.podFileUrl || (item.podFile ? await fileToBase64(item.podFile) : undefined),
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

        // Save order to database via API
        try {
            await api.createOrder({
                id: newOrder.id,
                userId: currentUser.id,
                creationDate: newOrder.creationDate,
                status: newOrder.status,
                shippingAddress: JSON.stringify(newOrder.shippingAddress),
                products: JSON.stringify(newOrder.products),
                subtotal: newOrder.subtotal,
                shippingTotal: newOrder.shippingTotal,
                total: newOrder.total,
                trackingNumber: null,
                shippingCarrier: null
            } as any);
            console.log('✅ Order saved to database');
        } catch (error) {
            console.error('❌ Failed to save order:', error);
        }

        onCreateOrder(newOrder);

        // Clear ordered items from cart locally and on server
        setCart(prev => prev.filter(item => !selectedItemIds.includes(item.id)));

        try {
            await Promise.all(selectedItemIds.map(id =>
                api.removeFromCart(id)
            ));
        } catch (error) {
            console.error('Failed to clear ordered items from cart:', error);
        }
    };

    const handleAddCategory = async (name: string) => {
        try {
            const productIds: string[] = [];
            const newCategory = await api.createFavoriteCategory(currentUser.id, name, productIds);
            setFavoriteCategories(prev => [...prev, {
                id: newCategory.id,
                name: newCategory.name,
                productNames: []
            }]);
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await api.deleteFavoriteCategory(id);
            setFavoriteCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleAssignProduct = async (productName: string, categoryId: string | null) => {
        try {
            // Update local state first
            setFavoriteCategories(prev => {
                return prev.map(cat => {
                    const productNames = cat.productNames.filter(p => p !== productName);
                    if (cat.id === categoryId) {
                        productNames.push(productName);
                    }
                    return { ...cat, productNames };
                });
            });

            // Update backend
            if (categoryId) {
                const category = favoriteCategories.find(c => c.id === categoryId);
                if (category) {
                    const productIds = category.productNames
                        .filter(pn => pn !== productName)
                        .map(pn => products.find(p => p.name === pn)?.id)
                        .filter(Boolean) as string[];

                    const product = products.find(p => p.name === productName);
                    if (product) {
                        productIds.push(product.id);
                    }

                    await api.updateFavoriteCategory(categoryId, category.name, productIds);
                }
            }
        } catch (error) {
            console.error('Failed to assign product:', error);
        }
    };

    const handleToggleRenewal = async (renew: boolean) => {
        try {
            await api.updateAutoRenew(currentUser.id, renew);
            setSubscription(prev => ({ ...prev, willRenew: renew }));
        } catch (error) {
            console.error('Failed to update auto-renew:', error);
        }
    };

    const handleUpdatePlan = async (plan: Plan) => {
        const calculateEndDate = (planName: string) => {
            const date = new Date();
            if (planName.includes('1 Ay')) date.setMonth(date.getMonth() + 1);
            else if (planName.includes('6 Ay')) date.setMonth(date.getMonth() + 6);
            else if (planName.includes('1 Sene')) date.setFullYear(date.getFullYear() + 1);
            else if (planName.includes('7 Gün')) date.setDate(date.getDate() + 7);
            return date.toISOString().split('T')[0];
        };

        const newEndDate = calculateEndDate(plan.name);

        try {
            await api.updateUserPlan(currentUser.id, plan.name, newEndDate);

            setSubscription({
                planName: plan.name,
                startDate: new Date().toISOString().split('T')[0],
                endDate: newEndDate,
                willRenew: true,
            });
        } catch (error) {
            console.error('Failed to update plan:', error);
        }
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
            isSubscriptionExpired, // Pass to pages for access control
            categories, // Pass categories for SourcingPoolPage
            currentUser: { // Pass currentUser with required fields for payment
                id: currentUser.id,
                name: (props.currentUser as any).name || 'User',
                email: (props.currentUser as any).email || '',
                phone: (props.currentUser as any).phone
            },
        };

        if (routeInfo.page === 'support') {
            pageProps.tickets = supportTickets;
            pageProps.onSendMessage = onSendMessageToTicket;
            pageProps.onCreateTicket = (subject: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>) =>
                onCreateTicket(currentUser.id, subject, message);
            pageProps.onMarkTicketAsRead = (ticketId: string) => onMarkTicketAsRead(ticketId, 'user');
            pageProps.onUploadFile = onUploadFile;
        }

        return <ActivePageComponent {...pageProps} />;
    };

    const pageTitle = pageTitles[routeInfo.page] || 'Satıcı Paneli Ana Sayfa';

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
            isSubscriptionExpired={isSubscriptionExpired}
            announcements={announcements}
        >
            {renderActivePage()}
        </DashboardLayout>
    );
};

export default DashboardPage;