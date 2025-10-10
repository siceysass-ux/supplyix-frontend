import React, { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle, isSidebarOpen, setSidebarOpen, navigate }) => {
  return (
    <div className="flex h-screen bg-neutral text-gray-800">
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen}
        navigate={navigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          pageTitle={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
          navigate={navigate}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
