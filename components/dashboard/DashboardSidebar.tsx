import React, { useEffect } from 'react';
import { navItems } from './navItems';

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, setIsOpen, navigate }) => {
  const currentPath = window.location.hash;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isOpen && sidebar && !sidebar.contains(event.target as Node)) {
        const menuButton = document.getElementById('menu-button');
        if (menuButton && menuButton.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, setIsOpen]);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
        id="sidebar"
        className={`fixed lg:relative flex-shrink-0 bg-dark-blue text-white w-64 h-full flex flex-col z-40 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-center p-4 border-b border-white/10 h-16">
          <a href="#" onClick={(e) => handleNavigation(e, '/')} aria-label="Ana Sayfa">
            <img src="/logo.png" alt="Supplyix Logo" className="h-12 w-auto" />
          </a>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.path}`}
              onClick={(e) => handleNavigation(e, item.path)}
              className={`flex items-center p-3 rounded-lg transition-colors text-sm font-medium ${
                (item.path === '/dashboard' && currentPath === '#/dashboard') || (item.path !== '/dashboard' && currentPath.startsWith(`#${item.path}`))
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a
            href="#"
            onClick={(e) => handleNavigation(e, '/')}
            className="flex items-center p-3 rounded-lg transition-colors text-gray-300 hover:bg-white/10 hover:text-white text-sm font-medium"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Çıkış Yap</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
