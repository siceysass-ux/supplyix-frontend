import React, { useEffect } from 'react';
import { mainNavItems, secondaryNavItems } from './navItems';
import { XMarkIcon } from './icons/duotone';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
}

interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  name: string;
  color?: string;
  darkColor?: string;
  hoverColor?: string;
  darkHoverColor?: string;
  activeColor?: string;
  darkActiveColor?: string;
}


const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, setIsOpen, navigate }) => {
  const { theme, toggleTheme } = useTheme();

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
    if (path === '/' && theme === 'dark') {
      toggleTheme(); // Switch back to light mode on logout
    }
    navigate(path);
  };

  const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const { path, icon: Icon, name, color, darkColor, hoverColor, darkHoverColor, activeColor, darkActiveColor } = item;
    const currentPath = window.location.hash;
    const isActive = (path === '/dashboard' && (currentPath === '#/dashboard' || currentPath === '#/dashboard/')) || (path !== '/dashboard' && path !== '/' && currentPath.startsWith(`#${path}`));
    
    const baseClasses = 'flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold';
    
    const activeClasses = activeColor 
        ? `${activeColor} dark:${darkActiveColor || activeColor} text-white shadow-lg` 
        : 'bg-primary text-white shadow-lg shadow-primary/30';

    const inactiveClasses = color && hoverColor 
        ? `${color} ${darkColor} ${hoverColor} ${darkHoverColor}`
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
    
    if (name === 'Çıkış Yap') {
        return (
             <a
                href={`#${path}`}
                onClick={(e) => handleNavigation(e, path)}
                className={`${baseClasses} ${inactiveClasses}`}
            >
                <Icon className={`h-6 w-6 mr-3 flex-shrink-0 ${color || 'text-slate-600'} ${darkColor || 'dark:text-slate-400'}`} />
                <span className="flex-1">{name}</span>
            </a>
        );
    }
    
    return (
      <a
        href={`#${path}`}
        onClick={(e) => handleNavigation(e, path)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <Icon className={`h-6 w-6 mr-3 flex-shrink-0 ${isActive ? 'text-white' : (color || 'text-slate-600')} ${isActive ? '' : (darkColor || 'dark:text-slate-400')}`} />
        <span className="flex-1">{name}</span>
      </a>
    );
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
        className={`fixed lg:relative flex-shrink-0 bg-slate-50 border-r border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 w-72 h-screen flex flex-col z-40 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 h-16 flex-shrink-0">
          <a href="#/dashboard" onClick={(e) => handleNavigation(e, '/dashboard')} aria-label="Panel Ana Sayfa">
            <img 
              src="/logo.png" 
              alt="Supplyix Logo" 
              className="h-10 w-auto dark:bg-white dark:p-1 dark:rounded-md dark:shadow-[0_0_8px_rgba(255,255,255,0.7)]" 
            />
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Menüyü kapat"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {mainNavItems.map((item) => (
            <NavLink key={item.name} item={item as NavItem} />
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2 flex-shrink-0">
          {secondaryNavItems.map((item) => (
            <NavLink key={item.name} item={item as NavItem} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;