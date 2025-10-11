import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ContactPage from './components/ContactPage';
import DashboardPage from './components/dashboard/DashboardPage';
import AdminPage from './components/admin/AdminPage';
import { initialConversations, Conversation, ChatMessage, ConversationStatus } from './components/dashboard/types';
import FeatureSteps from './components/FeatureSteps';
import MarketplaceMarquee from './components/MarketplaceMarquee';
import CategoriesSection from './components/CategoriesSection';
import FAQSection from './components/FAQSection';
import YouTubeSection from './components/YouTubeSection';


const App: React.FC = () => {
    const getRoute = () => {
        const hash = window.location.hash.substring(1); // Remove '#'
        const [path, query] = hash.split('?');
        const params = new URLSearchParams(query);
        return { path, params };
    };

    const [route, setRoute] = useState(getRoute());
    
    // Centralized state for all conversations
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

    const navigate = useCallback((path: string) => {
        window.location.hash = path;
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(getRoute());
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    // Chat Handlers
    const handleSendMessage = (conversationId: string, messageText: string, sender: 'user' | 'support') => {
        const newMessage: ChatMessage = {
            sender,
            text: messageText,
            timestamp: new Date().toLocaleString('tr-TR')
        };
        setConversations(prev => prev.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    messages: [...convo.messages, newMessage],
                    lastMessageTimestamp: new Date().toISOString(),
                    isRead: sender === 'support', // Admin reply marks it as read for admin
                    status: 'active', // Move from spam/archive back to active on new message
                };
            }
            return convo;
        }));
    };

    const handleSetConversationStatus = (conversationId: string, status: ConversationStatus) => {
        setConversations(prev => prev.map(convo =>
            convo.id === conversationId ? { ...convo, status } : convo
        ));
    };

    const handleToggleReadStatus = (conversationId: string, isRead: boolean) => {
        setConversations(prev => prev.map(convo =>
            convo.id === conversationId ? { ...convo, isRead } : convo
        ));
    };

    const renderPage = () => {
        const { path, params } = route;
        
        if (path.startsWith('/dashboard')) {
            return (
              <DashboardPage
                conversations={conversations}
                onSendMessage={handleSendMessage}
              />
            );
        }
        if (path.startsWith('/admin')) {
             return (
              <AdminPage
                conversations={conversations}
                onSendMessage={handleSendMessage}
                onSetConversationStatus={handleSetConversationStatus}
                onToggleReadStatus={handleToggleReadStatus}
              />
            );
        }

        switch (path) {
            case '/login':
                return <LoginPage navigate={navigate} />;
            case '/signup':
                return <SignupPage navigate={navigate} plan={params.get('plan')} price={params.get('price')} />;
            case '/forgot-password':
                return <ForgotPasswordPage navigate={navigate} />;
            case '/contact':
                return <ContactPage navigate={navigate} />;
            default:
                return (
                    <>
                        <Header navigate={navigate} />
                        <main>
                            <HeroSection navigate={navigate} />
                            <MarketplaceMarquee />
                            <FeatureSteps />
                            <CategoriesSection />
                            <LiveDemoSection />
                            <PricingSection navigate={navigate} />
                            <YouTubeSection />
                            <FAQSection />
                        </main>
                        <Footer />
                    </>
                );
        }
    };

    return (
        <ThemeProvider>
            <div className="bg-white text-gray-800 font-sans">
                {renderPage()}
            </div>
        </ThemeProvider>
    );
};

export default App;