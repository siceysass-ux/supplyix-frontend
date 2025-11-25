import React, { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import ExpiredSubscriptionBanner from './shared/ExpiredSubscriptionBanner';
import { CartItem, NavItem, Announcement } from './types';
import { ChevronRightIcon } from './icons/outline';

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
  isSubscriptionExpired?: boolean;
  announcements: Announcement[];
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
  mainNavItems,
  isSubscriptionExpired = false,
  announcements
}) => {
  React.useEffect(() => {
    document.title = `Supplyix - ${pageTitle}`;
  }, [pageTitle]);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigate={navigate}
        onLogout={onLogout}
        mainNavItems={mainNavItems}
      />

      {/* Embedded menu button for mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1/2 left-0 -translate-y-1/2 z-30 bg-primary text-white py-4 pl-3 pr-2 rounded-r-full shadow-lg transition-transform duration-200 ease-in-out hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-900"
          aria-label="Menüyü aç"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
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
                announcements={announcements}
              />
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              {isSubscriptionExpired && (
                <ExpiredSubscriptionBanner
                  onRenew={() => navigate('/dashboard/membership')}
                />
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;