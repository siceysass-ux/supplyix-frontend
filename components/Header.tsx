import React from 'react';

interface HeaderProps {
  navigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
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
          <a 
            href="#/login" 
            onClick={(e) => handleNavigation(e, '/login')} 
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus transition-transform duration-300 transform hover:scale-105"
          >
            Giriş Yap
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;