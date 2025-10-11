import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Bars3Icon } from '../dashboard/icons/outline';
import { UserRole } from './types';
import { NavItem } from '../dashboard/types';

interface AdminLayoutProps {
  pageTitle: string;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
  onLogout: () => void;
  children: ReactNode;
  onCreateUser: () => void;
  currentUserRole: UserRole;
  adminNavItems: NavItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  pageTitle,
  isSidebarOpen,
  setSidebarOpen,
  navigate,
  onLogout,
  children,
  onCreateUser,
  currentUserRole,
  adminNavItems
}) => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        navigate={navigate} 
        onLogout={onLogout}
        onCreateUser={onCreateUser}
        currentUserRole={currentUserRole}
        adminNavItems={adminNavItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm h-16 flex items-center justify-between px-4 z-10 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 dark:text-slate-400 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <a href="#/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>
                <img src="/logo.png" alt="Supplyix Logo" className="h-10 w-auto" />
            </a>
             <div className="w-6"></div> {/* Spacer */}
        </header>

        <div className="flex-1 flex items-stretch overflow-hidden">
          <main className="flex-1 overflow-y-auto">
             <div className="sticky top-0 z-10 hidden lg:block">
                <AdminHeader pageTitle={pageTitle} navigate={navigate} />
             </div>
             <div className="p-4 sm:p-6 lg:p-8">
                {children}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;