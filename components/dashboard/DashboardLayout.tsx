import React, { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { CartItem, NavItem } from './types';
import { Bars3Icon } from './icons/outline';

interface DashboardLayoutProps {
  pageTitle: string;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
  onLogout: () => void;
  cart: CartItem[];
  onUpdateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveFromCart: (cartItemId: string) => void;
  children: ReactNode;
  mainNavItems: NavItem[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
    pageTitle, 
    isSidebarOpen, 
    setSidebarOpen, 
    navigate, 
    onLogout,
    cart,
    onUpdateCartQuantity,
    onRemoveFromCart,
    children,
    mainNavItems
}) => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <DashboardSidebar 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        navigate={navigate} 
        onLogout={onLogout} 
        mainNavItems={mainNavItems}
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
            <a href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                <img src="/logo.png" alt="Supplyix Logo" className="h-10 w-auto" />
            </a>
            <div className="w-6"></div> {/* Spacer to balance the header */}
        </header>
        
        <div className="flex-1 flex items-stretch overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {/* The sticky header is now part of the scrollable main area */}
            <div className="sticky top-0 z-10">
                <DashboardHeader 
                    pageTitle={pageTitle}
                    navigate={navigate}
                    onLogout={onLogout}
                    cart={cart}
                    onUpdateCartQuantity={onUpdateCartQuantity}
                    onRemoveFromCart={onRemoveFromCart}
                />
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

export default DashboardLayout;