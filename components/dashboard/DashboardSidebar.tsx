import React, { useEffect } from 'react';
import { navItems } from './navItems';
import { SupportIcon, CreditCardIcon, LogoutIcon, XMarkIcon } from './icons/outline';

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

  const NavLink: React.FC<{ path: string, icon: React.ComponentType<any>, name: string }> = ({ path, icon: Icon, name }) => {
    const isActive = (path === '/dashboard' && (currentPath === '#/dashboard' || currentPath === '#/dashboard/')) || (path !== '/dashboard' && path !== '/' && currentPath.startsWith(`#${path}`));
    
    const baseClasses = 'flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium';
    const activeClasses = 'bg-primary text-white shadow-md shadow-primary/40';
    const inactiveClasses = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';

    return (
      <a
        href={`#${path}`}
        onClick={(e) => handleNavigation(e, path)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        <span className="flex-1">{name}</span>
      </a>
    );
  };
  
  const baseActionClasses = 'flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium';
  
  // Custom styles for special links
  const isSupportActive = currentPath.startsWith('#/dashboard/support-center');
  const supportClasses = isSupportActive 
      ? 'bg-green-600 text-white shadow-md shadow-green-500/40' 
      : 'text-green-700 hover:bg-green-50 hover:text-green-800';
  const supportIconClasses = isSupportActive ? 'text-white' : 'text-green-500';

  const isMembershipActive = currentPath.startsWith('#/dashboard/membership');
  const membershipClasses = isMembershipActive
      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
      : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800';
  const membershipIconClasses = isMembershipActive ? 'text-white' : 'text-blue-500';

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
        className={`fixed lg:relative flex-shrink-0 bg-white border-r border-slate-200 w-72 h-screen flex flex-col z-40 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 h-16 flex-shrink-0">
          <a href="#/dashboard" onClick={(e) => handleNavigation(e, '/dashboard')} aria-label="Panel Ana Sayfa">
            <img src="/logo.png" alt="Supplyix Logo" className="h-10 w-auto" />
          </a>
          {/* Add close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
            aria-label="Menüyü kapat"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {navItems.map((item, index) => (
            <NavLink key={index} path={item.path} icon={item.icon} name={item.name} />
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-200 space-y-2 flex-shrink-0">
            <a href="#/dashboard/support-center" onClick={(e) => handleNavigation(e, '/dashboard/support-center')} className={`${baseActionClasses} ${supportClasses}`}>
                <SupportIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${supportIconClasses}`} />
                <span className="flex-1">Destek Merkezi</span>
            </a>
            <a href="#/dashboard/membership" onClick={(e) => handleNavigation(e, '/dashboard/membership')} className={`${baseActionClasses} ${membershipClasses}`}>
                <CreditCardIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${membershipIconClasses}`} />
                <span className="flex-1">Planlarım</span>
            </a>
            <a href="#/" onClick={(e) => handleNavigation(e, '/')} className={`${baseActionClasses} text-red-600 hover:bg-red-50 hover:text-red-700`}>
                <LogoutIcon className="h-5 w-5 mr-3 flex-shrink-0 text-red-400" />
                <span className="flex-1">Çıkış Yap</span>
            </a>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;