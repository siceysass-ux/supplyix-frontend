

import React, { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { CartItem } from './types';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
  cart: CartItem[];
  onUpdateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveFromCart: (cartItemId: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle, isSidebarOpen, setSidebarOpen, navigate, cart, onUpdateCartQuantity, onRemoveFromCart }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
      {/* New Mobile Menu Trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`lg:hidden fixed top-1/2 -translate-y-1/2 left-0 z-20 bg-primary text-white p-2 rounded-r-lg shadow-lg transition-transform duration-300 transform ${
          isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
        aria-label="Menüyü aç"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen}
        navigate={navigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          pageTitle={pageTitle}
          navigate={navigate}
          cart={cart}
          onUpdateCartQuantity={onUpdateCartQuantity}
          onRemoveFromCart={onRemoveFromCart}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;