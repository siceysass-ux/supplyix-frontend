import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, ChevronDownIcon } from '../dashboard/icons/outline';
import { useTheme } from '../../contexts/ThemeContext';
import ToggleSwitch from '../dashboard/shared/ToggleSwitch';

interface AdminHeaderProps {
  pageTitle: string;
  navigate: (path: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle, navigate }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setProfileOpen(false);
  };

  return (
    <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-dark-blue dark:text-slate-100">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ToggleSwitch isDark={theme === 'dark'} onToggle={toggleTheme} />
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
            <button 
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Admin menüsü"
            >
                <img className="h-9 w-9 rounded-full object-cover" src="https://i.pravatar.cc/150?u=admin" alt="Admin avatar" />
                <span className="hidden sm:inline text-sm font-semibold text-dark-blue dark:text-slate-200">Admin</span>
                <ChevronDownIcon className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none z-20">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-dark-blue dark:text-slate-100 truncate">Admin Kullanıcısı</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@supplyix.com</p>
                    </div>
                    <div className="py-2">
                        <a href="#/admin/profile" onClick={(e) => { e.preventDefault(); handleNavigation('/admin/profile'); }} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary transition-colors w-full text-left">
                            <UserCircleIcon className="w-5 h-5 mr-3" />
                            Profilim
                        </a>
                         <a href="#/" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary transition-colors w-full text-left">
                            Çıkış Yap
                        </a>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;