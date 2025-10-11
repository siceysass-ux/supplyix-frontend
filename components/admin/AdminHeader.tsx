import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ToggleSwitch from '../dashboard/shared/ToggleSwitch';

interface AdminHeaderProps {
  pageTitle: string;
  navigate: (path: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle, navigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-dark-blue dark:text-slate-100">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ToggleSwitch isDark={theme === 'dark'} onToggle={toggleTheme} />
        {/* Profile Display */}
        <div className="flex items-center space-x-2 p-1">
            <img className="h-9 w-9 rounded-full object-cover" src="https://i.pravatar.cc/150?u=admin" alt="Admin avatar" />
            <span className="hidden sm:inline text-sm font-semibold text-dark-blue dark:text-slate-200">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;