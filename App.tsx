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
    initialConversations, initialAnnouncements, EventPopup as EventPopupType, 
    Product, Order, Request, ExtraFee, Conversation, Announcement, NavItem, 
    initialPlans, initialEventPopup, initialInfluencerCodes, InfluencerCode, 
    initialMainNavItems, initialAdminNavItems
} from './components/dashboard/types';
import YouTubeSection from './components/YouTubeSection';
import MarketplaceMarquee from './components/MarketplaceMarquee';
import FeatureSteps from './components/FeatureSteps';
import EventPopup from './components/EventPopup';
import LogoutAnimation from './components/LogoutAnimation';
import { User } from './components/admin/types';


const App: React.FC = () => {
    // A simple hash-based router
    const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || '/');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Centralized state
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [extraFees, setExtraFees] = useState<ExtraFee[]>(initialFees);

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
    
    // --- Settings Handlers ---
    const handleUpdatePlans = (updatedPlans: Plan[]) => setPlans(updatedPlans);
    const handleUpdateEventPopup = (updatedPopup: EventPopupType) => setEventPopup(updatedPopup);
    const handleUpdateInfluencerCodes = (updatedCodes: InfluencerCode[]) => setInfluencerCodes(updatedCodes);
    const handleUpdateMainNavItems = (updatedItems: NavItem[]) => setMainNavItems(updatedItems);
    const handleUpdateAdminNavItems = (updatedItems: NavItem[]) => setAdminNavItems(updatedItems);


    const renderPage = () => {
        if (isLoggingOut) {
            return <LogoutAnimation />;
        }
        
        const urlParams = new URLSearchParams(currentPath.split('?')[1]);

        if (currentPath.startsWith('/dashboard')) {
            return <DashboardPage 
                onLogout={handleLogout} 
                mainNavItems={mainNavItems}
            />;
        }
        if (currentPath.startsWith('/admin')) {
            return <AdminPage
                // Data
                conversations={conversations}
                announcements={announcements}
                products={products}
                orders={orders}
                plans={plans}
                eventPopup={eventPopup}
                influencerCodes={influencerCodes}
                mainNavItems={mainNavItems}
                adminNavItems={adminNavItems}
                extraFees={extraFees}
                // Handlers
                onSendMessage={(convoId, text, sender) => {
                    setConversations(prev => prev.map(c => c.id === convoId ? {...c, messages: [...c.messages, { sender, text, timestamp: new Date().toISOString() }]} : c));
                }}
                onSetConversationStatus={(convoId, status) => {
                     setConversations(prev => prev.map(c => c.id === convoId ? {...c, status} : c));
                }}
                onToggleReadStatus={(convoId, isRead) => {
                     setConversations(prev => prev.map(c => c.id === convoId ? {...c, isRead} : c));
                }}
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
            />;
        }

        switch (currentPath.split('?')[0]) {
            case '/login':
                return <LoginPage navigate={navigate} />;
            case '/signup':
                return <SignupPage navigate={navigate} plan={urlParams.get('plan')} price={urlParams.get('price')} />;
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