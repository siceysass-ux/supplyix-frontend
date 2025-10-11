import React, { useState, useEffect } from 'react';
import { NavItem, initialAdminNavItems } from '../../dashboard/types';
import { Bars3Icon } from '../../dashboard/icons/outline';

interface AdminMenuSettingsPageProps {
    adminNavItems: NavItem[];
    onUpdateAdminNavItems: (items: NavItem[]) => void;
}

const AdminMenuSettingsPage: React.FC<AdminMenuSettingsPageProps> = ({ adminNavItems, onUpdateAdminNavItems }) => {
    const [localAdminNavItems, setLocalAdminNavItems] = useState<NavItem[]>(adminNavItems);
    const [draggedAdminItemIndex, setDraggedAdminItemIndex] = useState<number | null>(null);

    useEffect(() => {
        setLocalAdminNavItems(adminNavItems);
    }, [adminNavItems]);

    const handleAdminDragStart = (e: React.DragEvent, index: number) => {
        setDraggedAdminItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const handleAdminDrop = (e: React.DragEvent, droppedOnIndex: number) => {
        e.preventDefault();
        if (draggedAdminItemIndex === null || draggedAdminItemIndex === droppedOnIndex) {
            setDraggedAdminItemIndex(null);
            return;
        }
        const items = [...localAdminNavItems];
        const [reorderedItem] = items.splice(draggedAdminItemIndex, 1);
        items.splice(droppedOnIndex, 0, reorderedItem);
        setLocalAdminNavItems(items);
        setDraggedAdminItemIndex(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-dark-blue border-b border-slate-200 pb-4 mb-4">Admin Menü Yönetimi</h1>
            <p className="text-sm text-slate-500 mb-4">Admin panelindeki ana menü öğelerini sürükleyip bırakarak yeniden sıralayın.</p>
            <div className="space-y-2">
                {localAdminNavItems.map((item, index) => (
                    <div
                        key={item.path}
                        draggable
                        onDragStart={(e) => handleAdminDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleAdminDrop(e, index)}
                        className={`flex items-center gap-4 p-3 rounded-lg border border-slate-200 cursor-move transition-all ${
                            draggedAdminItemIndex === index ? 'bg-primary/20 opacity-50' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                    >
                        <Bars3Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <item.icon className="w-6 h-6 text-primary" />
                        <span className="font-semibold text-dark-blue">{item.name}</span>
                    </div>
                ))}
            </div>
            <div className="text-right pt-4 mt-4 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setLocalAdminNavItems(initialAdminNavItems)} className="bg-slate-200 text-dark-blue font-bold py-2 px-6 rounded-lg hover:bg-slate-300">
                    Varsayılana Sıfırla
                </button>
                <button onClick={() => onUpdateAdminNavItems(localAdminNavItems)} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">
                    Menüyü Kaydet
                </button>
            </div>
        </div>
    );
};

export default AdminMenuSettingsPage;