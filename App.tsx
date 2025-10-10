import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import CategoriesSection from './components/CategoriesSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';

const HomePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <main>
      <HeroSection navigate={navigate} />
      <FeaturesSection />
      <LiveDemoSection />
      <CategoriesSection />
      <PricingSection />
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
    switch (currentPage) {
      case '/contact':
        return <ContactPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-base-100 font-sans leading-normal tracking-normal flex flex-col">
      <Header navigate={navigate} />
      <div className="flex-grow">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
};

export default App;
