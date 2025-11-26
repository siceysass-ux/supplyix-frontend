import React, { useState, useEffect, useCallback } from 'react';
import './src/sentry'; // Initialize Sentry
import { ThemeProvider } from './contexts/ThemeContext';
// Import page components
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import YouTubeSection from './components/YouTubeSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import EventPopup from './components/EventPopup';
import ContactPage from './components/ContactPage';
import TestimonialsSection from './components/TestimonialsSection';
import DashboardPage from './components/dashboard/pages/DashboardPage'; // This is a main entry for dashboard
import AdminPage from './components/admin/AdminPage'; // This is a main entry for admin
import {
    Plan, initialProducts, initialOrders, initialRequests, initialFees,
    initialAnnouncements, EventPopup as EventPopupType,
    Product, Order, Request, ExtraFee, Announcement, NavItem,
    initialPlans, initialEventPopup, initialInfluencerCodes, InfluencerCode,
    initialMainNavItems, initialAdminNavItems, SupportTicket, TicketStatus,
    initialSupportTickets, ChatMessage, RequestStatus, RequestResult
} from './components/dashboard/types';
import MarketplaceMarquee from './components/MarketplaceMarquee';
import FeatureSteps from './components/FeatureSteps';
import CategoriesSection from './components/CategoriesSection';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import EmailVerificationPage from './components/EmailVerificationPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import SalesAgreementPage from './components/SalesAgreementPage';
import DeliveryReturnsPage from './components/DeliveryReturnsPage';
import BlogListPage from './components/BlogListPage';
import BlogPostPage from './components/BlogPostPage';
import LogoutAnimation from './components/LogoutAnimation';
import { User, UserStatus, initialUsers, UserRole } from './components/admin/types';
import * as api from './src/services/api';
// SEO imports
import SEOHead from './components/shared/SEOHead';
import { getSEOConfig, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA, FAQ_SCHEMA, generateBreadcrumbSchema } from './src/seo-config';
import "./src/libs/globals.ts";



const App: React.FC = () => {
    // A simple hash-based router
    const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || '/');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Centralized state - ALL from database now
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [extraFees, setExtraFees] = useState<ExtraFee[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Session timeout - 30 minutes of inactivity
    useEffect(() => {
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
        let timeoutId: NodeJS.Timeout;

        const resetTimeout = () => {
            clearTimeout(timeoutId);
            const currentUser = localStorage.getItem('currentUser');

            if (currentUser) {
                // Update last activity timestamp
                localStorage.setItem('lastActivity', Date.now().toString());

                // Set new timeout
                timeoutId = setTimeout(() => {
                    // Auto logout after 30 minutes of inactivity
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('lastActivity');
                    window.location.hash = '/';
                    window.location.reload();
                }, SESSION_TIMEOUT);
            }
        };

        // Check on mount if session expired
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity) {
            const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
            if (timeSinceLastActivity > SESSION_TIMEOUT) {
                // Session expired
                localStorage.removeItem('currentUser');
                localStorage.removeItem('lastActivity');
                if (currentPath !== '/' && !currentPath.startsWith('/login') && !currentPath.startsWith('/signup')) {
                    window.location.hash = '/';
                    window.location.reload();
                }
            }
        }

        // Track user activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimeout));

        resetTimeout(); // Initialize

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimeout));
        };
    }, [currentPath]);

    // --- Heartbeat Logic for Real-Time Tracking ---
    useEffect(() => {
        // Generate or retrieve a unique session ID for this tab/browser
        let sessionId = sessionStorage.getItem('supplyix_session_id');
        if (!sessionId) {
            sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
            sessionStorage.setItem('supplyix_session_id', sessionId);
        }

        const sendHeartbeat = async () => {
            try {
                // Determine user type based on current path
                const type = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin')
                    ? 'dashboard'
                    : 'landing';

                await fetch('http://localhost:3002/api/heartbeat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, socketId: sessionId })
                });
            } catch (error) {
                // Silent fail for heartbeat
            }
        };

        // Send immediately on mount/path change
        sendHeartbeat();

        // Then every 10 seconds
        const interval = setInterval(sendHeartbeat, 10000);

        return () => clearInterval(interval);
    }, [currentPath]);

    // Site Settings State - from database
    const [plans, setPlans] = useState<Plan[]>(initialPlans); // Will be fetched from DB later
    const [eventPopup, setEventPopup] = useState<EventPopupType>(initialEventPopup); // Will be fetched from DB later
    const [influencerCodes, setInfluencerCodes] = useState<InfluencerCode[]>(initialInfluencerCodes); // Will be fetched from DB later
    const [mainNavItems, setMainNavItems] = useState<NavItem[]>(initialMainNavItems);
    const [adminNavItems, setAdminNavItems] = useState<NavItem[]>(initialAdminNavItems);


    // Fetch initial data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    fetchedProducts,
                    fetchedOrders,
                    fetchedUsers,
                    fetchedRequests,
                    fetchedExtraFees,
                    fetchedAnnouncements,
                    fetchedSupportTickets,
                    fetchedPlans,
                    fetchedEventPopup,
                    fetchedInfluencerCodes,
                    fetchedCategories
                ] = await Promise.all([
                    api.getProducts().catch(e => { console.error('Products failed:', e); return []; }),
                    api.getOrders().catch(e => { console.error('Orders failed:', e); return []; }),
                    api.getUsers().catch(e => { console.error('Users failed:', e); return []; }),
                    api.getRequests().catch(e => { console.error('Requests failed:', e); return []; }),
                    api.getExtraFees().catch(e => { console.error('ExtraFees failed:', e); return []; }),
                    api.getAnnouncements().catch(e => { console.error('Announcements failed:', e); return []; }),
                    api.getSupportTickets().catch(e => { console.error('SupportTickets failed:', e); return []; }),
                    api.getPlans().catch(e => { console.error('Plans failed:', e); return []; }),
                    api.getEventPopup().catch(e => { console.error('EventPopup failed:', e); return null; }),
                    api.getInfluencerCodes().catch(e => { console.error('InfluencerCodes failed:', e); return []; }),
                    api.getCategories().catch(e => { console.error('Categories failed:', e); return []; })
                ]);


                setProducts(fetchedProducts);
                setOrders(fetchedOrders);
                setUsers(fetchedUsers);
                setRequests(fetchedRequests);
                setExtraFees(fetchedExtraFees);
                setAnnouncements(fetchedAnnouncements);
                setSupportTickets(fetchedSupportTickets);
                setCategories(fetchedCategories);

                // Settings
                if (fetchedPlans && fetchedPlans.length > 0) {
                    setPlans(fetchedPlans);
                }
                if (fetchedEventPopup) {
                    setEventPopup(fetchedEventPopup);
                }
                if (fetchedInfluencerCodes && fetchedInfluencerCodes.length > 0) {
                    setInfluencerCodes(fetchedInfluencerCodes);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash.substring(1) || '/');
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Refetch user data when navigating to dashboard to get latest subscription info
    useEffect(() => {
        const refetchUsers = async () => {
            if (currentPath.startsWith('/dashboard')) {
                try {
                    const fetchedUsers = await api.getUsers();
                    setUsers(fetchedUsers);
                } catch (error) {
                    console.error("Failed to refetch users:", error);
                }
            }
        };
        refetchUsers();
    }, [currentPath]);

    const navigate = (path: string) => {
        window.location.hash = path;
    };

    const handleLogout = () => {
        // Clear all session data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('rememberedEmail'); // Optional: keep this if you want "remember me" to persist

        setIsLoggingOut(true);
        setTimeout(() => {
            setIsLoggingOut(false);
            window.location.hash = '/';
            window.location.reload(); // Force reload to clear state
        }, 2500); // Animation duration
    };

    // --- Product Handlers ---
    const handleSaveProduct = async (productToSave: Product) => {
        try {
            // Convert category/subcategory names to IDs
            const categoryObj = categories.find(c => c.name === productToSave.category);
            const subcategoryObj = categoryObj?.subcategories.find((sc: any) => sc.name === productToSave.subcategory);

            const productData = {
                ...productToSave,
                categoryId: categoryObj?.id || null,
                subcategoryId: subcategoryObj?.id || null,
            };

            // Remove old string fields
            delete (productData as any).category;
            delete (productData as any).subcategory;

            const exists = products.some(p => p.id === productToSave.id);
            let savedProduct;
            if (exists) {
                savedProduct = await api.updateProduct(productToSave.id, productData);
                setProducts(prev => prev.map(p => p.id === productToSave.id ? savedProduct : p));
            } else {
                const { id, ...rest } = productData;
                savedProduct = await api.createProduct(rest as any);
                setProducts(prev => [...prev, savedProduct]);
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Ürün kaydedilemedi! Lütfen tüm alanları doldurun ve tekrar deneyin.");
        }
    };
    const handleDeleteProduct = async (productId: string) => {
        try {
            await api.deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    // --- Order Handlers ---
    const handleCreateOrder = async (newOrder: Order) => {
        try {
            const { id, ...rest } = newOrder;
            const createdOrder = await api.createOrder(rest as Order);
            setOrders(prev => [createdOrder, ...prev]);
        } catch (error) {
            console.error("Failed to create order:", error);
        }
    };
    const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };
    const handleUpdateTrackingInfo = async (orderId: string, trackingNo: string) => {
        try {
            // Auto-set status to "Kargoda" when tracking number is added
            const updatedOrder = await api.updateTrackingInfo(orderId, '17PACK', trackingNo);
            // Also update status to Kargoda
            await api.updateOrderStatus(orderId, 'Kargoda');
            setOrders(prev => prev.map(o => o.id === orderId ? { ...updatedOrder, status: 'Kargoda' } : o));
        } catch (error) {
            console.error("Failed to update tracking info:", error);
        }
    };

    // --- Fee Handlers ---
    const handleSaveFee = async (feeToSave: ExtraFee) => {
        try {
            const exists = extraFees.some(f => f.id === feeToSave.id);
            if (exists) {
                const updatedFee = await api.updateExtraFee(feeToSave.id, feeToSave);
                setExtraFees(prev => prev.map(f => f.id === feeToSave.id ? updatedFee : f));
            } else {
                const { id, ...rest } = feeToSave;
                const createdFee = await api.createExtraFee(rest as any);
                setExtraFees(prev => [createdFee, ...prev]);
            }
        } catch (error) {
            console.error("Failed to save fee:", error);
        }
    };

    const handleDeleteFee = async (feeId: string) => {
        try {
            await api.deleteExtraFee(feeId);
            setExtraFees(prev => prev.filter(f => f.id !== feeId));
        } catch (error) {
            console.error("Failed to delete fee:", error);
        }
    };

    // --- Request Handlers ---
    const handleAddRequest = useCallback(async (request: Omit<Request, 'id' | 'updated' | 'status' | 'result' | 'userName' | 'userEmail'>): Promise<void> => {
        try {
            // Get current user ID (for demo, using first user)
            const currentUserId = users[0]?.id || 'user-1';

            const newRequest = await api.createRequest({
                type: request.type,
                userId: currentUserId,
                explanation: request.explanation,
                title: request.title,
                productName: request.productName,
                imageUrls: request.imageUrls,
                referenceLink: request.referenceLink,
            });

            setRequests(prev => [newRequest, ...prev]);
        } catch (error) {
            console.error("Failed to create request:", error);
        }
    }, [users]);

    const handleRespondToRequest = useCallback(async (requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => {
        try {
            const updatedRequest = await api.respondToRequest(requestId, response, newStatus, newResult);
            setRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
        } catch (error) {
            console.error("Failed to respond to request:", error);
        }
    }, []);


    // --- Support Ticket Handlers ---
    const handleCreateTicket = useCallback(async (userId: string, subject: string, initialMessage: Pick<ChatMessage, 'text' | 'imageUrls'>) => {
        try {
            const user = users.find(u => u.id === userId);
            const newTicket = await api.createSupportTicket({
                userId,
                userName: user?.name || 'Unknown User',
                userEmail: user?.email || 'unknown@email.com',
                subject,
                messages: [{
                    ...initialMessage,
                    sender: 'user',
                    timestamp: 'Şimdi',
                }]
            });
            setSupportTickets(prev => [newTicket, ...prev]);
        } catch (error) {
            console.error("Failed to create ticket:", error);
        }
    }, [users]);

    const handleSendMessageToTicket = useCallback(async (ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => {
        try {
            const ticket = supportTickets.find(t => t.id === ticketId);
            if (!ticket) return;

            const newMessage: ChatMessage = {
                ...message,
                sender,
                timestamp: 'Şimdi',
            };
            const newStatus = sender === 'user' ? 'Açık' : 'Yanıt Bekleniyor';
            const updatedMessages = [...ticket.messages, newMessage];

            const updates: any = {
                status: newStatus,
                messages: updatedMessages
            };

            if (sender === 'support') {
                updates.isReadByAdmin = true;
                updates.isReadByUser = false;
            } else {
                updates.isReadByAdmin = false;
                updates.isReadByUser = true;
            }

            const updatedTicket = await api.updateSupportTicket(ticketId, updates);

            setSupportTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [supportTickets]);

    const handleChangeTicketStatus = useCallback(async (ticketId: string, status: TicketStatus) => {
        try {
            const updatedTicket = await api.updateSupportTicket(ticketId, { status });
            setSupportTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        } catch (error) {
            console.error("Failed to change ticket status:", error);
        }
    }, []);

    const handleMarkTicketAsRead = useCallback(async (ticketId: string, role: 'admin' | 'user' = 'admin') => {
        try {
            const updatedTicket = await api.markTicketAsRead(ticketId, role);
            setSupportTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        } catch (error) {
            console.error("Failed to mark ticket as read:", error);
        }
    }, []);

    // --- Settings Handlers ---
    const handleUpdatePlans = async (updatedPlans: Plan[]) => {
        try {
            await api.updatePlans(updatedPlans);
            setPlans(updatedPlans);
        } catch (error) {
            console.error("Failed to update plans:", error);
        }
    };

    const handleUpdateEventPopup = async (updatedPopup: EventPopupType) => {
        try {
            await api.updateEventPopup(updatedPopup);
            setEventPopup(updatedPopup);
        } catch (error) {
            console.error("Failed to update event popup:", error);
        }
    };

    const handleUpdateInfluencerCodes = async (updatedCodes: InfluencerCode[]) => {
        try {
            await api.updateInfluencerCodes(updatedCodes);
            setInfluencerCodes(updatedCodes);
        } catch (error) {
            console.error("Failed to update influencer codes:", error);
        }
    };

    const handleUpdateMainNavItems = (updatedItems: NavItem[]) => setMainNavItems(updatedItems);
    const handleUpdateAdminNavItems = (updatedItems: NavItem[]) => setAdminNavItems(updatedItems);

    // --- Category Handlers ---
    const handleSaveCategory = async (category: any) => {
        try {
            if (category.id && categories.some(c => c.id === category.id)) {
                // Update existing
                const updated = await api.updateCategory(category.id, {
                    name: category.name,
                    subcategories: category.subcategories.map((sc: any) => ({ name: sc.name }))
                });
                setCategories(prev => prev.map(c => c.id === category.id ? updated : c));
            } else {
                // Create new
                const created = await api.createCategory({
                    name: category.name,
                    subcategories: category.subcategories.map((sc: any) => ({ name: sc.name }))
                });
                setCategories(prev => [...prev, created]);
            }
        } catch (error) {
            console.error("Failed to save category:", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await api.deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    // --- User Handlers ---
    const handleUpdateUserStatus = async (userId: string, newStatus: UserStatus) => {
        try {
            const updatedUser = await api.updateUserStatus(userId, newStatus);
            setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        } catch (error) {
            console.error("Failed to update user status:", error);
        }
    };

    const handleUpdateSubscriptionEndDate = async (userId: string, newEndDate: string) => {
        try {
            const updatedUser = await api.updateSubscription(userId, newEndDate);
            setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        } catch (error) {
            console.error("Failed to update subscription:", error);
        }
    };

    const handleCreateAdminUser = async (newUser: { email: string; password?: string; role: UserRole; }) => {
        try {
            console.log('📝 Frontend: Creating admin user:', newUser);

            const requestBody = {
                name: newUser.email.split('@')[0],
                email: newUser.email,
                password: newUser.password || 'defaultPassword123',  // Should require password
                role: newUser.role,
                plan: '1 Ay',
                status: 'Aktif',
                registrationDate: new Date().toISOString().split('T')[0],
                subscriptionStartDate: new Date().toISOString().split('T')[0],
                subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                totalSpent: 0,
                lastLogin: new Date().toISOString(),
                platforms: [],  // Empty array for admin users
                phone: null,
                tcKimlik: null,
                vergiKimlik: null,
                referralCode: null,
            };

            console.log('📤 Frontend: Sending admin user to backend:', requestBody);

            const response = await fetch('http://localhost:3002/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }));
                console.error('❌ Frontend: Backend error:', errorData);
                throw new Error(errorData.details || errorData.error || 'Admin kullanıcı oluşturulamadı');
            }

            const createdUser = await response.json();
            console.log('✅ Frontend: Admin; ' + newUser.role + ' user created successfully:', createdUser);

            setUsers(prev => [createdUser, ...prev]);

            alert('Admin kullanıcı başarıyla oluşturuldu!');
        } catch (error: any) {
            console.error('❌ Frontend: Failed to create admin user:', error);
            alert(`Admin kullanıcı oluşturulamadı: ${error.message}`);
        }
    };

    const calculateEndDate = (planName: string) => {
        const date = new Date();
        if (planName.includes('1 Ay')) date.setMonth(date.getMonth() + 1);
        else if (planName.includes('6 Ay')) date.setMonth(date.getMonth() + 6);
        else if (planName.includes('1 Sene')) date.setFullYear(date.getFullYear() + 1);
        else if (planName.includes('7 Gün')) date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    const handleCreateUser = async (userData: {
        fullName: string;
        email: string;
        password: string;
        phone: string;
        tcKimlik: string;
        vergiKimlik: string;
        referans: string;
        platforms: string[];
        plan: string;
        price: number;
    }) => {
        try {
            console.log('📝 Frontend: Starting user registration...');
            console.log('📝 Frontend: User data:', userData);

            const requestBody = {
                name: userData.fullName,
                email: userData.email,
                password: userData.password,
                phone: userData.phone || null,
                tcKimlik: userData.tcKimlik || null,
                vergiKimlik: userData.vergiKimlik || null,
                referralCode: userData.referans || null,  // FIXED: This is the referral code FROM another user
                platforms: userData.platforms,
                plan: userData.plan || null,
                role: 'member',
                status: 'Aktif',
                registrationDate: new Date().toISOString().split('T')[0],
                subscriptionStartDate: new Date().toISOString().split('T')[0],
                subscriptionEndDate: calculateEndDate(userData.plan),
                totalSpent: userData.price || 0,
                lastLogin: new Date().toISOString(),
            };

            console.log('📤 Frontend: Sending request to backend:', requestBody);

            // Call backend to register user
            const response = await fetch('http://localhost:3002/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 Frontend: Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }));
                console.error('❌ Frontend: Backend error:', errorData);
                throw new Error(errorData.details || errorData.error || 'Kayıt başarısız oldu');
            }

            const createdUser = await response.json();
            console.log('✅ Frontend: User created successfully:', createdUser);

            // Update local state with the created user
            setUsers(prev => [createdUser, ...prev].sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()));

            console.log('✅ Frontend: Registration completed successfully!');
            alert('Kayıt başarılı! Lütfen email adresinizi doğrulayın.');
        } catch (error: any) {
            console.error('❌ Frontend: Failed to create user:', error);
            console.error('❌ Frontend: Error message:', error.message);
            alert(`Kullanıcı kaydedilemedi: ${error.message}\n\nLütfen console'u kontrol edin.`);
        }
    };

    const handleUploadFile = useCallback(async (file: File): Promise<string> => {
        try {
            const result = await api.uploadImage(file);
            return result.url;
        } catch (error) {
            console.error("Failed to upload file:", error);
            throw error;
        }
    }, []);

    const renderPage = () => {
        if (isLoggingOut) {
            return <LogoutAnimation />;
        }

        const urlParams = new URLSearchParams(currentPath.split('?')[1]);

        if (currentPath.startsWith('/dashboard')) {
            const seoConfig = getSEOConfig('/dashboard');
            // Get the logged-in user from users state (not localStorage)
            let currentUser: any;
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    const storedUserData = JSON.parse(storedUser);
                    // Find the actual user from users state to get latest data
                    // If ID doesn't match (e.g. db reset), try matching by email
                    currentUser = users.find(u => u.id === storedUserData.id) ||
                        users.find(u => u.email === storedUserData.email) ||
                        storedUserData;

                    // If we found the user by email but ID was different, update localStorage
                    if (currentUser.id !== storedUserData.id) {
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    }
                } else {
                    // Fallback: use first user
                    currentUser = users.find(u => u.email === 'user@supplyix.com') || users[0] || {
                        id: 'demo-user',
                        plan: '1 Ay',
                        subscriptionStartDate: '2025-10-10',
                        subscriptionEndDate: '2025-11-10'
                    };
                }
            } catch (error) {
                console.error('Error reading currentUser from localStorage:', error);
                currentUser = users[0] || {
                    id: 'demo-user',
                    plan: '1 Ay',
                    subscriptionStartDate: '2025-10-10',
                    subscriptionEndDate: '2025-11-10'
                };
            }

            return (
                <>
                    <SEOHead {...seoConfig} />
                    <DashboardPage
                        onLogout={handleLogout}
                        mainNavItems={mainNavItems}
                        currentUser={currentUser}
                        // Pass all relevant central state to dashboard
                        orders={orders}
                        products={products}
                        requests={requests}
                        announcements={announcements}
                        extraFees={(() => {
                            const userFees = extraFees.filter(f => f.userId === currentUser.id);

                            return userFees;
                        })()}
                        supportTickets={supportTickets.filter(t => t.userId === currentUser.id)}
                        categories={categories}
                        // Pass all relevant handlers to dashboard
                        onAddRequest={handleAddRequest}
                        onCreateOrder={handleCreateOrder}
                        onSaveFee={handleSaveFee}
                        onSendMessageToTicket={handleSendMessageToTicket}
                        onCreateTicket={handleCreateTicket}
                        onUploadFile={handleUploadFile}
                        onMarkTicketAsRead={handleMarkTicketAsRead}
                    />
                </>
            );
        }
        if (currentPath.startsWith('/admin')) {
            const seoConfig = getSEOConfig('/admin');
            return (
                <>
                    <SEOHead {...seoConfig} />
                    <AdminPage
                        // Data
                        announcements={announcements}
                        products={products}
                        orders={orders}
                        plans={plans}
                        eventPopup={eventPopup}
                        influencerCodes={influencerCodes}
                        mainNavItems={mainNavItems}
                        adminNavItems={adminNavItems}
                        extraFees={extraFees}
                        supportTickets={supportTickets}
                        users={users}
                        requests={requests}
                        categories={categories}
                        // Handlers
                        onAddAnnouncement={async (ann) => {
                            try {
                                const newAnnouncement = await api.createAnnouncement(ann);
                                setAnnouncements(prev => [newAnnouncement, ...prev]);
                            } catch (error) {
                                console.error("Failed to add announcement:", error);
                            }
                        }}
                        onDeleteAnnouncement={async (id) => {
                            try {
                                await api.deleteAnnouncement(id);
                                setAnnouncements(prev => prev.filter(a => a.id !== id));
                            } catch (error) {
                                console.error("Failed to delete announcement:", error);
                            }
                        }}
                        onSaveProduct={handleSaveProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onUpdateOrderStatus={handleUpdateOrderStatus}
                        onUpdateTrackingInfo={handleUpdateTrackingInfo}
                        onLogout={handleLogout}
                        onUpdatePlans={handleUpdatePlans}
                        onUpdateEventPopup={handleUpdateEventPopup}
                        onUpdateInfluencerCodes={handleUpdateInfluencerCodes}
                        onUpdateMainNavItems={handleUpdateMainNavItems}
                        onUpdateAdminNavItems={handleUpdateAdminNavItems}
                        onSaveFee={handleSaveFee}
                        onDeleteFee={handleDeleteFee}
                        onSendMessageToTicket={handleSendMessageToTicket}
                        onChangeTicketStatus={handleChangeTicketStatus}
                        onMarkTicketAsRead={handleMarkTicketAsRead}
                        onCreateAdminUser={handleCreateAdminUser}
                        onUpdateUserStatus={handleUpdateUserStatus}
                        onUpdateSubscriptionEndDate={handleUpdateSubscriptionEndDate}
                        onRespondToRequest={handleRespondToRequest}
                        onSaveCategory={handleSaveCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onUploadFile={handleUploadFile}
                    />
                </>
            );
        }

        // Handle blog post detail pages
        if (currentPath.startsWith('/blog/') && currentPath !== '/blog') {
            const slug = currentPath.replace('/blog/', '');
            return (
                <>
                    <Header navigate={navigate} />
                    <BlogPostPage slug={slug} navigate={navigate} />
                    <Footer navigate={navigate} />
                </>
            );
        }

        switch (currentPath.split('?')[0]) {
            case '/giris': {
                const seoConfig = getSEOConfig('/giris');
                return (
                    <>
                        <SEOHead {...seoConfig} />
                        <LoginPage navigate={navigate} users={users} />
                    </>
                );
            }
            case '/kayit-ol': {
                const seoConfig = getSEOConfig('/kayit-ol');
                return (
                    <>
                        <SEOHead {...seoConfig} />
                        <SignupPage navigate={navigate} plan={urlParams.get('plan')} price={urlParams.get('price')} influencerCodes={influencerCodes} onCreateUser={handleCreateUser} />
                    </>
                );
            }
            case '/forgot-password': {
                return <ForgotPasswordPage navigate={navigate} />;
            }
            case '/reset-password': {
                const token = urlParams.get('token') || '';
                return <ResetPasswordPage navigate={navigate} token={token} />;
            }
            case '/verify-email': {
                const token = urlParams.get('token') || '';
                return <EmailVerificationPage navigate={navigate} token={token} />;
            }
            case '/iletisim': {
                const seoConfig = getSEOConfig('/iletisim');
                return (
                    <>
                        <SEOHead {...seoConfig} structuredData={generateBreadcrumbSchema('/iletisim')} />
                        <Header navigate={navigate} />
                        <ContactPage navigate={navigate} />
                        <Footer navigate={navigate} />
                    </>
                );
            }
            case '/privacy-policy': {
                return (
                    <>
                        <Header navigate={navigate} />
                        <PrivacyPolicyPage navigate={navigate} />
                        <Footer navigate={navigate} />
                    </>
                );
            }
            case '/sales-agreement': {
                return (
                    <>
                        <Header navigate={navigate} />
                        <SalesAgreementPage navigate={navigate} />
                        <Footer navigate={navigate} />
                    </>
                );
            }
            case '/delivery-returns': {
                return (
                    <>
                        <Header navigate={navigate} />
                        <DeliveryReturnsPage navigate={navigate} />
                        <Footer navigate={navigate} />
                    </>
                );
            }
            case '/blog': {
                return (
                    <>
                        <Header navigate={navigate} />
                        <BlogListPage navigate={navigate} />
                        <Footer navigate={navigate} />
                    </>
                );
            }
            case '/':
            default:
                // Landing page with full SEO
                const seoConfig = getSEOConfig('/');
                const structuredData = [
                    ORGANIZATION_SCHEMA,
                    WEBSITE_SCHEMA,
                    LOCAL_BUSINESS_SCHEMA,
                    FAQ_SCHEMA,
                ];

                return (
                    <>
                        <SEOHead {...seoConfig} structuredData={structuredData} />
                        <EventPopup popup={eventPopup as any} />
                        <Header navigate={navigate} />
                        <main>
                            <HeroSection navigate={navigate} />
                            <MarketplaceMarquee />
                            <FeatureSteps />
                            <CategoriesSection />
                            <LiveDemoSection />
                            <TestimonialsSection />
                            <PricingSection navigate={navigate} plans={plans} />
                            <YouTubeSection />
                            <FAQSection />
                        </main>
                        <Footer navigate={navigate} />
                    </>
                );
        }
    };

    // Landing page should always be in light mode
    const isLandingPage = !currentPath.startsWith('/dashboard') && !currentPath.startsWith('/admin');

    // Force remove dark mode class from HTML when on landing page
    useEffect(() => {
        if (isLandingPage) {
            document.documentElement.classList.remove('dark');
        }
    }, [isLandingPage]);

    if (isLandingPage) {
        return (
            <div className="bg-white text-slate-800 min-h-screen font-sans">
                {renderPage()}
            </div>
        );
    }

    return (
        <ThemeProvider>
            <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen font-sans">
                {renderPage()}
            </div>
        </ThemeProvider>
    );
};

export default App;