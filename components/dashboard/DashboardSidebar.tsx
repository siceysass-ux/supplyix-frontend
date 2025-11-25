import React from 'react';
import { secondaryNavItems } from './navItems';
import { XMarkIcon } from './icons/outline';
import { NavItem } from './types';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
  onLogout: () => void;
  mainNavItems: NavItem[];
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isSidebarOpen, setSidebarOpen, navigate, onLogout, mainNavItems }) => {
  const currentPath = window.location.hash.substring(1);

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setSidebarOpen(false);
  };

  const getItemClasses = (item: NavItem, isActive: boolean) => {
    if (isActive) {
      return {
        link: 'bg-primary text-white',
        icon: 'text-white'
      };
    }

    // Default item style
    const baseLink = 'text-slate-700 dark:text-slate-300';
    const baseIcon = 'text-slate-400';
    const hoverClasses = 'hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700';
    const iconHover = 'group-hover:text-primary';

    return {
      link: `${baseLink} ${hoverClasses}`,
      icon: `${baseIcon} ${iconHover}`
    };
  };

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-800 px-6 pb-4 border-r border-slate-200 dark:border-slate-700">
      <div className="flex h-16 shrink-0 items-center">
        <a href="#/dashboard" onClick={(e) => handleNavigation(e, '/dashboard')}>
          <img className="h-10 w-auto" src="/logo.png" alt="Supplyix" />
        </a>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-400">Ana Panel</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
                const classes = getItemClasses(item, isActive);
                return (
                  <li key={item.name}>
                    <a
                      href={`#${item.path}`}
                      onClick={(e) => handleNavigation(e, item.path)}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${classes.link}`}
                    >
                      {typeof item.icon === 'string' ? (
                        <img
                          src={item.icon}
                          alt={item.name}
                          className={`shrink-0 ${item.path === '/dashboard' ? 'h-7 w-7' : 'h-6 w-6'} ${classes.icon} ${isActive ? 'brightness-110 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]' : ''}`}
                          aria-hidden="true"
                        />
                      ) : (
                        <item.icon className={`h-6 w-6 shrink-0 ${classes.icon} ${isActive ? 'brightness-110 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]' : ''}`} aria-hidden="true" />
                      )}
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <div className="text-xs font-semibold leading-6 text-slate-400">Hesap</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {secondaryNavItems.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.name === 'Çıkış Yap') {
                        onLogout();
                      } else {
                        handleNavigation(e, item.path);
                      }
                      setSidebarOpen(false);
                    }}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${item.colorClass || 'text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    <item.icon className={`h-6 w-6 shrink-0 ${item.iconColorClass || 'text-slate-400 group-hover:text-primary'}`} aria-hidden="true" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`relative z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
      <div className="hidden lg:block lg:w-72"></div>
    </>
  );
};

export default DashboardSidebar;