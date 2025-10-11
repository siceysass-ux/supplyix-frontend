import React, { useState, useEffect, DragEvent } from 'react';
import { adminNavItems, adminSecondaryNavItems } from './navItems';
import { XMarkIcon } from '../dashboard/icons/duotone';
import { Bars3Icon, PencilIcon } from '../dashboard/icons/outline'; // Sürükleme ve düzenleme ikonu
import { useTheme } from '../../contexts/ThemeContext';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navigate: (path: string) => void;
}

interface NavItem {
  path: string;
  icon: React.ComponentType<any>;
  name: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen, navigate }) => {
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(adminNavItems as NavItem[]);
  const [tempNavItems, setTempNavItems] = useState<NavItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('adminNavOrder');
      if (savedOrder) {
        const orderedPaths = JSON.parse(savedOrder) as string[];
        const baseItems = adminNavItems as NavItem[];
        
        const orderedItems = orderedPaths
            .map(path => baseItems.find(item => item.path === path))
            .filter((item): item is NavItem => !!item);

        const missingItems = baseItems.filter(item => !orderedPaths.includes(item.path));
        setNavItems([...orderedItems, ...missingItems]);
      } else {
        setNavItems(adminNavItems as NavItem[]);
      }
    } catch (error) {
      console.error("Failed to load or parse nav order from localStorage:", error);
      setNavItems(adminNavItems as NavItem[]);
    }
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (isEditingOrder) return;
    if (path === '/' && theme === 'dark') {
      toggleTheme(); // Switch back to light mode on logout
    }
    navigate(path);
  };
  
  const handleEditClick = () => {
    setTempNavItems([...navItems]);
    setIsEditingOrder(true);
  };

  const handleSaveClick = () => {
    setNavItems(tempNavItems);
    try {
      localStorage.setItem('adminNavOrder', JSON.stringify(tempNavItems.map(item => item.path)));
    } catch (error) {
      console.error("Failed to save nav order to localStorage:", error);
    }
    setIsEditingOrder(false);
  };

  const handleCancelClick = () => {
    setIsEditingOrder(false);
  };
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null) return;
    const items = [...tempNavItems];
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);
    setTempNavItems(items);
  };


  const NavLink: React.FC<{ item: NavItem; index?: number }> = ({ item, index }) => {
    const { path, icon: Icon, name } = item;
    const currentPath = window.location.hash;
    const isActive = (path === '/admin' && currentPath === '#/admin') || (path !== '/admin' && currentPath.startsWith(`#${path}`));
    
    const baseClasses = 'flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold';
    const activeClasses = 'bg-primary text-white shadow-lg shadow-primary/30';
    const inactiveClasses = 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';

    return (
      <div 
        draggable={isEditingOrder && index !== undefined}
        onDragStart={isEditingOrder && index !== undefined ? () => handleDragStart(index) : undefined}
        onDragEnter={isEditingOrder && index !== undefined ? () => handleDragEnter(index) : undefined}
        onDragEnd={isEditingOrder ? handleDragEnd : undefined}
        onDragOver={(e) => e.preventDefault()}
        onDrop={isEditingOrder && index !== undefined ? () => handleDrop(index) : undefined}
        className={`relative ${isEditingOrder ? 'cursor-grab' : ''} ${draggedIndex === index ? 'opacity-50' : ''}`}
      >
        <a
          href={`#${path}`}
          onClick={(e) => handleNavigation(e, path)}
          className={`${baseClasses} ${isActive && !isEditingOrder ? activeClasses : inactiveClasses} w-full`}
        >
          {isEditingOrder && index !== undefined && <Bars3Icon className="h-5 w-5 mr-2 text-slate-400 dark:text-slate-500" />}
          <Icon className={`h-6 w-6 mr-3 flex-shrink-0 ${isActive && !isEditingOrder ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
          <span className="flex-1">{name}</span>
        </a>
      </div>
    );
  };
  
  const itemsToDisplay = isEditingOrder ? tempNavItems : navItems;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed lg:relative flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 w-72 h-screen flex flex-col z-40 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 h-16 flex-shrink-0">
          <a href="#/admin" onClick={(e) => handleNavigation(e, '/admin')} className="flex items-center gap-2">
            <img src="/logo.png" alt="Supplyix Logo" className="h-10 w-auto" />
            <span className="font-bold text-lg text-dark-blue dark:text-slate-100">Admin</span>
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Menüyü kapat"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" onDragLeave={() => setDragOverIndex(null)}>
            {itemsToDisplay.map((item, index) => (
                <div key={item.path}>
                    {dragOverIndex === index && (
                        <div className="h-1 bg-primary/50 rounded-full my-1 transition-all" />
                    )}
                    <NavLink item={item as NavItem} index={index} />
                </div>
            ))}
             {dragOverIndex === itemsToDisplay.length && (
                <div className="h-1 bg-primary/50 rounded-full my-1 transition-all" />
            )}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2 flex-shrink-0">
           {isEditingOrder ? (
              <div className="flex items-center gap-2">
                <button onClick={handleSaveClick} className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-green-700">Kaydet</button>
                <button onClick={handleCancelClick} className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600">İptal</button>
              </div>
            ) : (
              <button onClick={handleEditClick} className="w-full text-slate-600 dark:text-slate-400 font-semibold py-2 px-3 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-2">
                <PencilIcon className="w-4 h-4"/>
                Sıralamayı Düzenle
              </button>
            )}
          {adminSecondaryNavItems.map((item) => (
            <a href={`#${item.path}`} onClick={(e) => handleNavigation(e, item.path)} className="flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
               <item.icon className="h-6 w-6 mr-3 flex-shrink-0 text-slate-600 dark:text-slate-400" />
               <span className="flex-1">{item.name}</span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;