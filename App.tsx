import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveDemoSection from './components/LiveDemoSection';
import CategoriesSection from './components/CategoriesSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100 font-sans leading-normal tracking-normal">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <LiveDemoSection />
        <CategoriesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;