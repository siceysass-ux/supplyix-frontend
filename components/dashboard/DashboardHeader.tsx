import React from 'react';
import { BellIcon, UserCircleIcon } from './icons/solid';

interface DashboardHeaderProps {
  pageTitle: string;
  onMenuClick: () => void;
  navigate: (path: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ pageTitle, onMenuClick, navigate }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        <button
          id="menu-button"
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
          aria-label="Menüyü Aç"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-dark-blue">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard/notifications')} 
          className="text-gray-500 hover:text-gray-700 relative"
          aria-label="Bildirimler"
        >
          <BellIcon className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </button>
        <button 
          onClick={() => navigate('/dashboard/profile-security')}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Profil"
        >
          <UserCircleIcon className="h-8 w-8" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
