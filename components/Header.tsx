import React, { useState } from 'react';

interface HeaderProps {
  navigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200">
        <nav className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <a href="#" onClick={(e) => handleNavigation(e, '/')} className="flex items-center">
              <img
                src="/logo.png"
                alt="Supplyix Logo"
                className="h-14 w-auto"
                aria-label="Supplyix Logo"
              />
            </a>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#demo" onClick={(e) => handleScrollTo(e, 'demo')} className="text-dark-blue font-semibold hover:text-primary transition-colors">Demo</a>
              <a href="#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="text-dark-blue font-semibold hover:text-primary transition-colors">Fiyatlar</a>
              <a href="#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="text-dark-blue font-semibold hover:text-primary transition-colors">S.S.S.</a>
              <a href="#/login" onClick={(e) => handleNavigation(e, '/login')} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-transform duration-300 transform hover:scale-105">
                Giriş Yap
              </a>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="text-gray-700 focus:outline-none" aria-label="Menüyü aç">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      ></div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
             <h2 id="mobile-menu-title" className="text-lg font-bold text-dark-blue">Menü</h2>
             <button onClick={() => setIsMenuOpen(false)} className="text-gray-700 focus:outline-none" aria-label="Menüyü kapat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
          <nav className="flex flex-col space-y-4">
            <a href="#demo" onClick={(e) => handleScrollTo(e, 'demo')} className="text-dark-blue font-semibold hover:text-primary py-2 text-lg">Demo</a>
            <a href="#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="text-dark-blue font-semibold hover:text-primary py-2 text-lg">Fiyatlar</a>
            <a href="#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="text-dark-blue font-semibold hover:text-primary py-2 text-lg">S.S.S.</a>
            <a href="#/login" onClick={(e) => handleNavigation(e, '/login')} className="bg-primary text-white text-center font-bold mt-4 py-3 px-6 rounded-lg hover:bg-primary-focus transition-transform duration-300 transform hover:scale-105">
              Giriş Yap
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;