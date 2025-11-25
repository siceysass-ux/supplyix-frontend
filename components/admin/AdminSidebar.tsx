import React, { useMemo } from 'react';
import { secondaryNavItems } from './navItems';
import { XMarkIcon, UserPlusIcon } from './icons';
import { PencilIcon } from '../dashboard/icons/outline';
import { UserRole } from './types';
import { NavItem } from '../dashboard/types';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
  onLogout: () => void;
  onCreateUser: () => void;
  currentUserRole: UserRole;
  adminNavItems: NavItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, setSidebarOpen, navigate, onLogout, onCreateUser, currentUserRole, adminNavItems }) => {
  const currentPath = window.location.hash.substring(1);

  const mainNavItems = useMemo(() => {
    console.log('Current user role:', currentUserRole);
    console.log('All admin nav items:', adminNavItems.map(i => i.name));

    // Full admin - see everything
    if (currentUserRole === 'admin') {
      return adminNavItems;
    }

    // Product admin - only products and categories
    if (currentUserRole === 'product_admin' || currentUserRole === 'product lister') {
      const filtered = adminNavItems.filter(item =>
        item.path === '/admin' || // Home page
        item.name.includes('Ürün') ||
        item.name.includes('Kategori')
      );
      console.log('Product admin filtered items:', filtered.map(i => i.name));
      return filtered;
    }

    // Support admin - only requests and support
    if (currentUserRole === 'support_admin') {
      const filtered = adminNavItems.filter(item =>
        item.path === '/admin' || // Home page
        item.name.includes('Talep') ||
        item.name.includes('Destek')
      );
      console.log('Support admin filtered items:', filtered.map(i => i.name));
      return filtered;
    }

    // Default - show all (fallback)
    return adminNavItems;
  }, [adminNavItems, currentUserRole]);

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setSidebarOpen(false);
  };

  const handleCreateUser = (e: React.MouseEvent) => {
    e.preventDefault();
    onCreateUser();
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-800 px-6 pb-4 border-r border-slate-200 dark:border-slate-700">
      <div className="flex h-16 shrink-0 items-center">
        <a href="#/admin" onClick={(e) => handleNavigation(e, '/admin')} className="bg-white rounded-lg p-2 shadow-sm">
          <img className="h-10 w-auto" src="/logo.png" alt="Supplyix Admin" />
        </a>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.path || (item.path !== '/admin/home' && currentPath.startsWith(item.path));
                return (
                  <li key={item.name}>
                    <a
                      href={`#${item.path}`}
                      onClick={(e) => handleNavigation(e, item.path)}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive ? 'bg-primary text-white' : 'text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      <item.icon className={`h-6 w-6 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} aria-hidden="true" />
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
          {currentUserRole === 'admin' && (
            <li>
              <button
                onClick={handleCreateUser}
                className="w-full group flex items-center justify-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold bg-primary/10 text-primary hover:bg-primary/20"
              >
                <UserPlusIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                Yeni Kullanıcı Ekle
              </button>
            </li>
          )}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <a
                  href="#/admin/menu-settings"
                  onClick={(e) => handleNavigation(e, '/admin/menu-settings')}
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <PencilIcon className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-primary" aria-hidden="true" />
                  Menüyü Düzenle
                </a>
              </li>
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
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${item.color} ${item.darkColor} ${item.hoverColor} ${item.darkHoverColor}`}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
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

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
      <div className="hidden lg:block lg:w-72"></div>
    </>
  );
};

export default AdminSidebar;