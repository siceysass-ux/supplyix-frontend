import React from 'react';

interface HeaderProps {
  navigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200">
      <nav className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <a href="#" onClick={handleLogoClick} className="flex items-center">
            <img
              src="https://i.imgur.com/NqnodCe.png"
              alt="Supplyix Logo"
              className="h-14 w-auto"
              aria-label="Supplyix Logo"
            />
          </a>
          <div className="flex items-center space-x-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-transform duration-300 transform hover:scale-105">
              Giriş Yap
            </a>
            <button className="md:hidden text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
