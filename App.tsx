import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LiveDemoSection from './components/LiveDemoSection';
import CategoriesSection from './components/CategoriesSection';
import PricingSection from './components/PricingSection';
import FeatureSteps from './components/FeatureSteps';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import SignupPage from './components/SignupPage';
import DashboardPage from './components/dashboard/DashboardPage'; // Updated import
import YouTubeSection from './components/YouTubeSection';
import MarketplaceMarquee from './components/MarketplaceMarquee';
import FAQSection from './components/FAQSection';

const HomePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <main>
      <HeroSection navigate={navigate} />
      <FeatureSteps />
      <LiveDemoSection />
      <CategoriesSection />
      <MarketplaceMarquee />
      <PricingSection navigate={navigate} />
      <YouTubeSection />
      <FAQSection />
    </main>
  );
};

const App: React.FC = () => {
  const getCurrentRoute = () => window.location.hash.slice(1) || '/';
  const [currentPage, setCurrentPage] = useState(getCurrentRoute());

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    setCurrentPage(path); // Immediately update state on navigation
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    // Set initial page on load
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    const route = currentPage.split('?')[0];
    const urlParams = new URLSearchParams(currentPage.split('?')[1] || '');
    const plan = urlParams.get('plan');
    const price = urlParams.get('price');

    if (route.startsWith('/dashboard')) {
        return <DashboardPage />;
    }

    switch (route) {
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/signup':
        return <SignupPage navigate={navigate} plan={plan} price={price} />;
      case '/forgot-password':
        return <ForgotPasswordPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };
  
  const isDashboard = currentPage.startsWith('/dashboard');
  const showHeaderFooter = !['/login', '/signup', '/forgot-password'].includes(currentPage.split('?')[0]) && !isDashboard;
  
  return (
    <div className="min-h-screen bg-base-100 font-sans leading-normal tracking-normal flex flex-col">
      {showHeaderFooter && <Header navigate={navigate} />}
      <div className="flex-grow">
        {renderPage()}
      </div>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default App;