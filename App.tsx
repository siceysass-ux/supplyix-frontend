import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
// Import page components
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import PricingSection from './components/PricingSection';
import CategoriesSection from './components/CategoriesSection';
import FAQSection from './components/FAQSection';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
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
import YouTubeSection from './components/YouTubeSection';
import MarketplaceMarquee from './components/MarketplaceMarquee';
import FeatureSteps from './components/FeatureSteps';
import EventPopup from './components/EventPopup';
import LogoutAnimation from './components/LogoutAnimation';
import { User, UserStatus, initialUsers, UserRole } from './components/admin/types';


const App: React.FC = () => {
    // A simple hash-based router
    const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || '/');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Centralized state
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [extraFees, setExtraFees] = useState<ExtraFee[]>(initialFees);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
    const [users, setUsers] = useState<User[]>(initialUsers);

    // Site Settings State
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [eventPopup, setEventPopup] = useState<EventPopupType>(initialEventPopup);
    const [influencerCodes, setInfluencerCodes] = useState<InfluencerCode[]>(initialInfluencerCodes);
    const [mainNavItems, setMainNavItems] = useState<NavItem[]>(initialMainNavItems);
    const [adminNavItems, setAdminNavItems] = useState<NavItem[]>(initialAdminNavItems);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash.substring(1) || '/');
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (path: string) => {
        window.location.hash = path;
    };

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            setIsLoggingOut(false);
            navigate('/');
        }, 2500); // Animation duration
    };

    // --- Product Handlers ---
    const handleSaveProduct = (productToSave: Product) => {
        setProducts(prev => {
            const exists = prev.some(p => p.name === productToSave.name);
            if (exists) {
                return prev.map(p => p.name === productToSave.name ? productToSave : p);
            }
            return [...prev, productToSave];
        });
    };
    const handleDeleteProduct = (productName: string) => {
        setProducts(prev => prev.filter(p => p.name !== productName));
    };

    // --- Order Handlers ---
    const handleCreateOrder = (newOrder: Order) => {
        setOrders(prev => [newOrder, ...prev].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()));
    };
    const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };
    const handleUpdateTrackingInfo = (orderId: string, carrier: string, trackingNo: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, shippingCarrier: carrier, trackingNumber: trackingNo, status: 'Kargoda' } : o));
    };
    
    // --- Fee Handlers ---
    const handleSaveFee = (feeToSave: ExtraFee) => {
        setExtraFees(prev => {
            const exists = prev.some(f => f.id === feeToSave.id);
            if (exists) {
                return prev.map(f => f.id === feeToSave.id ? feeToSave : f);
            }
            return [feeToSave, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    };
    const handleDeleteFee = (feeId: string) => {
        setExtraFees(prev => prev.filter(f => f.id !== feeId));
    };

    // --- Request Handlers ---
    const handleAddRequest = useCallback((request: Omit<Request, 'id' | 'updated' | 'status' | 'result' | 'userName' | 'userEmail'>): Promise<void> => {
        return new Promise((resolve) => {
            const newRequest: Request = {
                ...request,
                id: `#${request.type === 'Tedarik' ? 'T' : 'D'}${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
                updated: new Date().toLocaleDateString('tr-TR'),
                status: 'Bekliyor',
                result: null,
                userName: 'Ahmet Yılmaz', // Hardcoded for demo
                userEmail: 'ahmet@sirket.com', // Hardcoded for demo
            };
            setRequests(prev => [newRequest, ...prev].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()));
            resolve();
        });
    }, []);

    const handleRespondToRequest = useCallback((requestId: string, response: string, newStatus: RequestStatus, newResult: RequestResult) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, response, status: newStatus, result: newResult, updated: new Date().toLocaleDateString('tr-TR') } : r));
    }, []);

    // --- Support Ticket Handlers ---
    const handleCreateTicket = useCallback((userId: string, subject: string, initialMessage: Pick<ChatMessage, 'text' | 'imageUrls'>) => {
        const newTicket: SupportTicket = {
            id: `DSTK-${String(Date.now()).slice(-4)}`,
            userId,
            userName: 'Ahmet Yılmaz', // Assuming we know the user
            userEmail: 'ahmet@sirket.com',
            subject,
            status: 'Açık',
            isReadByAdmin: false,
            lastUpdate: new Date().toISOString(),
            messages: [
                {
                    ...initialMessage,
                    sender: 'user',
                    timestamp: 'Şimdi',
                }
            ]
        };
        setSupportTickets(prev => [newTicket, ...prev]);
    }, []);

    const handleSendMessageToTicket = useCallback((ticketId: string, message: Pick<ChatMessage, 'text' | 'imageUrls'>, sender: 'user' | 'support') => {
        setSupportTickets(prevTickets =>
            prevTickets.map(ticket => {
                if (ticket.id === ticketId) {
                    const newMessage: ChatMessage = {
                        ...message,
                        sender,
                        timestamp: 'Şimdi',
                    };
                    const newStatus = sender === 'user' ? 'Açık' : 'Yanıt Bekleniyor';
                    return {
                        ...ticket,
                        messages: [...ticket.messages, newMessage],
                        status: newStatus,
                        isReadByAdmin: sender === 'support',
                        lastUpdate: new Date().toISOString(),
                    };
                }
                return ticket;
            })
        );
    }, []);

    const handleChangeTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
        setSupportTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId ? { ...ticket, status, lastUpdate: new Date().toISOString() } : ticket
            )
        );
    }, []);

    const handleMarkTicketAsRead = useCallback((ticketId: string) => {
        setSupportTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId ? { ...ticket, isReadByAdmin: true } : ticket
            )
        );
    }, []);
    
    // --- Settings Handlers ---
    const handleUpdatePlans = (updatedPlans: Plan[]) => setPlans(updatedPlans);
    const handleUpdateEventPopup = (updatedPopup: EventPopupType) => setEventPopup(updatedPopup);
    const handleUpdateInfluencerCodes = (updatedCodes: InfluencerCode[]) => setInfluencerCodes(updatedCodes);
    const handleUpdateMainNavItems = (updatedItems: NavItem[]) => setMainNavItems(updatedItems);
    const handleUpdateAdminNavItems = (updatedItems: NavItem[]) => setAdminNavItems(updatedItems);

    // --- User Handlers ---
    const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    };

    const handleUpdateSubscriptionEndDate = (userId: string, newEndDate: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscriptionEndDate: newEndDate } : u));
    };

    const handleCreateAdminUser = (newUser: { email: string; password?: string; role: UserRole; }) => {
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
        setUsers(prev => [finalUser, ...prev]);
    };
    
    const calculateEndDate = (planName: string) => {
        const date = new Date();
        if (planName.includes('1 Ay')) date.setMonth(date.getMonth() + 1);
        else if (planName.includes('6 Ay')) date.setMonth(date.getMonth() + 6);
        else if (planName.includes('1 Sene')) date.setFullYear(date.getFullYear() + 1);
        else if (planName.includes('7 Gün')) date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    const handleCreateUser = (userData: {
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
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: userData.fullName,
            email: userData.email,
            password: userData.password,
            role: 'member',
            phone: userData.phone,
            tcKimlik: userData.tcKimlik,
            vergiKimlik: userData.vergiKimlik,
            referans: userData.referans,
            plan: userData.plan as User['plan'],
            status: 'Aktif',
            registrationDate: new Date().toISOString().split('T')[0],
            subscriptionStartDate: new Date().toISOString().split('T')[0],
            subscriptionEndDate: calculateEndDate(userData.plan),
            totalSpent: userData.price,
            platforms: userData.platforms,
            lastLogin: new Date().toISOString(),
        };
        setUsers(prev => [newUser, ...prev].sort((a,b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()));
    };

    const renderPage = () => {
        if (isLoggingOut) {
            return <LogoutAnimation />;
        }
        
        const urlParams = new URLSearchParams(currentPath.split('?')[1]);

        if (currentPath.startsWith('/dashboard')) {
            return <DashboardPage 
                onLogout={handleLogout} 
                mainNavItems={mainNavItems}
                // Pass all relevant central state to dashboard
                orders={orders}
                products={products}
                requests={requests}
                announcements={announcements}
                extraFees={extraFees.filter(f => f.userId === 'user-1')} // Assuming one user for now
                supportTickets={supportTickets.filter(t => t.userId === 'user-1')} // Assuming one user for now
                // Pass all relevant handlers to dashboard
                onAddRequest={handleAddRequest}
                onCreateOrder={handleCreateOrder}
                onSaveFee={handleSaveFee}
                onSendMessageToTicket={handleSendMessageToTicket}
                onCreateTicket={handleCreateTicket}
            />;
        }
        if (currentPath.startsWith('/admin')) {
            return <AdminPage
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
                // Handlers
                onAddAnnouncement={(ann) => {
                    setAnnouncements(prev => [{...ann, id: `ann-${Date.now()}`, date: new Date().toLocaleDateString('tr-TR')}, ...prev]);
                }}
                onDeleteAnnouncement={(id) => {
                    setAnnouncements(prev => prev.filter(a => a.id !== id));
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
            />;
        }

        switch (currentPath.split('?')[0]) {
            case '/login':
                return <LoginPage navigate={navigate} users={users} />;
            case '/signup':
                return <SignupPage navigate={navigate} plan={urlParams.get('plan')} price={urlParams.get('price')} influencerCodes={influencerCodes} onCreateUser={handleCreateUser} />;
            case '/forgot-password':
                return <ForgotPasswordPage navigate={navigate} />;
            case '/contact':
                return (
                    <>
                        <Header navigate={navigate} />
                        <ContactPage navigate={navigate} />
                        <Footer />
                    </>
                );
            case '/':
            default:
                return (
                    <>
                        <EventPopup popup={eventPopup} />
                        <Header navigate={navigate} />
                        <main>
                            <HeroSection navigate={navigate} />
                            <MarketplaceMarquee />
                            <FeatureSteps />
                            <CategoriesSection />
                            <LiveDemoSection />
                            <YouTubeSection />
                            <PricingSection navigate={navigate} plans={plans} />
                            <FAQSection />
                        </main>
                        <Footer />
                    </>
                );
        }
    };

    return (
        <ThemeProvider>
            <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen font-sans">
                {renderPage()}
            </div>
        </ThemeProvider>
    );
};

export default App;