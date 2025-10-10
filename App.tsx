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
import DashboardPage from './components/DashboardPage';
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
      <PricingSection navigate={navigate} />
      <YouTubeSection />
      <MarketplaceMarquee />
      <FAQSection />
    </main>
  );
};

const App: React.FC = () => {
  const getCurrentRoute = () => window.location.hash.slice(1) || '/';
  const [currentPage, setCurrentPage] = useState(getCurrentRoute());

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    const route = currentPage.split('?')[0];
    const urlParams = new URLSearchParams(currentPage.split('?')[1] || '');
    const plan = urlParams.get('plan');
    const price = urlParams.get('price');

    switch (route) {
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/signup':
        return <SignupPage navigate={navigate} plan={plan} price={price} />;
      case '/forgot-password':
        return <ForgotPasswordPage navigate={navigate} />;
      case '/dashboard':
        return <DashboardPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };
  
  const showHeaderFooter = !['/login', '/signup', '/forgot-password', '/dashboard'].includes(currentPage.split('?')[0]);
  
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