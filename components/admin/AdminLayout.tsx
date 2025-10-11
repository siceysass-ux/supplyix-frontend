

import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle: string;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle, isSidebarOpen, setSidebarOpen, navigate }) => {
  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
      <button
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-20 bg-primary text-white p-2 rounded-md shadow-lg transition-transform duration-300 transform ${
          isSidebarOpen ? 'opacity-0' : 'opacity-100'
        }`}
        aria-label="Menüyü aç"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen}
        navigate={navigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          pageTitle={pageTitle}
          navigate={navigate}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;