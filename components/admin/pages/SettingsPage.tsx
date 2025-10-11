import React, { useState, useEffect } from 'react';
import { Plan, EventPopup, InfluencerCode, NavItem, initialMainNavItems } from '../../dashboard/types';
import { TrashIcon, ClipboardIcon, Bars3Icon } from '../../dashboard/icons/outline';

interface SettingsPageProps {
    plans: Plan[];
    onUpdatePlans: (plans: Plan[]) => void;
    eventPopup: EventPopup;
    onUpdateEventPopup: (popup: EventPopup) => void;
    influencerCodes: InfluencerCode[];
    onUpdateInfluencerCodes: (codes: InfluencerCode[]) => void;
    mainNavItems: NavItem[];
    onUpdateMainNavItems: (items: NavItem[]) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    plans, onUpdatePlans, 
    eventPopup, onUpdateEventPopup,
    influencerCodes, onUpdateInfluencerCodes,
    mainNavItems, onUpdateMainNavItems,
}) => {
    // Local state for forms
    const [localPlans, setLocalPlans] = useState<Plan[]>(plans);
    const [localPopup, setLocalPopup] = useState<EventPopup>(eventPopup);
    const [localCodes, setLocalCodes] = useState<InfluencerCode[]>(influencerCodes);
    const [newCode, setNewCode] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    
    // User Menu management state
    const [localMainNavItems, setLocalMainNavItems] = useState<NavItem[]>(mainNavItems);
    const [draggedMainItemIndex, setDraggedMainItemIndex] = useState<number | null>(null);

    useEffect(() => { setLocalMainNavItems(mainNavItems) }, [mainNavItems]);
    useEffect(() => { setLocalPlans(plans) }, [plans]);
    useEffect(() => { setLocalPopup(eventPopup) }, [eventPopup]);
    useEffect(() => { setLocalCodes(influencerCodes) }, [influencerCodes]);


    const handlePlanPriceChange = (planName: string, newPrice: number) => {
        setLocalPlans(prev => prev.map(p => p.name === planName ? {...p, price: newPrice} : p));
    };

    const handlePopupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setLocalPopup(prev => ({...prev, [name]: checked }));
        } else {
            setLocalPopup(prev => ({...prev, [name]: value }));
        }
    };

    const handleAddCode = () => {
        if (newCode.trim() && !localCodes.some(c => c.code === newCode.trim())) {
            const newCodeObj: InfluencerCode = { id: `inf-${Date.now()}`, code: newCode.trim() };
            const updatedCodes = [...localCodes, newCodeObj];
            setLocalCodes(updatedCodes);
            onUpdateInfluencerCodes(updatedCodes); // Update central state immediately
            setNewCode('');
        }
    };
    
    const handleDeleteCode = (id: string) => {
        const updatedCodes = localCodes.filter(c => c.id !== id);
        setLocalCodes(updatedCodes);
        onUpdateInfluencerCodes(updatedCodes); // Update central state
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopySuccess(code);
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    // Drag and Drop handlers for user menu
    const handleMainDragStart = (e: React.DragEvent, index: number) => {
        setDraggedMainItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleMainDrop = (e: React.DragEvent, droppedOnIndex: number) => {
        e.preventDefault();
        if (draggedMainItemIndex === null || draggedMainItemIndex === droppedOnIndex) {
            setDraggedMainItemIndex(null);
            return;
        }
        const items = [...localMainNavItems];
        const [reorderedItem] = items.splice(draggedMainItemIndex, 1);
        items.splice(droppedOnIndex, 0, reorderedItem);
        setLocalMainNavItems(items);
        setDraggedMainItemIndex(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark-blue">Site Ayarları</h1>
            
            {/* User Menu Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Kullanıcı Menü Yönetimi</h2>
                <p className="text-sm text-slate-500 mb-4">Kullanıcı panelindeki ana menü öğelerini sürükleyip bırakarak yeniden sıralayın.</p>
                <div className="space-y-2">
                    {localMainNavItems.map((item, index) => (
                        <div
                            key={item.path}
                            draggable
                            onDragStart={(e) => handleMainDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleMainDrop(e, index)}
                            className={`flex items-center gap-4 p-3 rounded-lg border border-slate-200 cursor-move transition-all ${
                                draggedMainItemIndex === index ? 'bg-primary/20 opacity-50' : 'bg-slate-50 hover:bg-slate-100'
                            }`}
                        >
                            <Bars3Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <item.icon className="w-6 h-6 text-primary" />
                            <span className="font-semibold text-dark-blue">{item.name}</span>
                        </div>
                    ))}
                </div>
                 <div className="text-right pt-4 mt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={() => setLocalMainNavItems(initialMainNavItems)} className="bg-slate-200 text-dark-blue font-bold py-2 px-6 rounded-lg hover:bg-slate-300">
                        Varsayılana Sıfırla
                    </button>
                    <button onClick={() => onUpdateMainNavItems(localMainNavItems)} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">
                        Menüyü Kaydet
                    </button>
                </div>
            </div>

            {/* Plan Prices */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Paket Fiyatlarını Yönet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {localPlans.map(plan => (
                        <div key={plan.name}>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">{plan.name}</label>
                            <input
                                type="number"
                                step="1"
                                value={plan.price}
                                onChange={(e) => handlePlanPriceChange(plan.name, parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-slate-50 p-2 rounded-md border border-slate-300"
                            />
                        </div>
                    ))}
                </div>
                <div className="text-right pt-4 mt-4 border-t border-slate-200">
                    <button onClick={() => onUpdatePlans(localPlans)} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">
                        Fiyatları Kaydet
                    </button>
                </div>
            </div>

            {/* Event Popup */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Etkinlik Pop-up Yönetimi</h2>
                <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="enabled" checked={localPopup.enabled} onChange={handlePopupChange} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" /><span className="font-semibold text-dark-blue">Pop-up'ı Etkinleştir</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">Başlık</label><input type="text" name="title" value={localPopup.title} onChange={handlePopupChange} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" /></div>
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">Görsel URL</label><input type="text" name="imageUrl" value={localPopup.imageUrl} onChange={handlePopupChange} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" /></div>
                    </div>
                    <div><label className="text-sm font-bold text-slate-700 mb-1 block">Açıklama</label><textarea name="description" value={localPopup.description} onChange={handlePopupChange} rows={3} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">Buton Metni (CTA)</label><input type="text" name="ctaText" value={localPopup.ctaText} onChange={handlePopupChange} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" /></div>
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">Buton Linki (CTA)</label><input type="text" name="ctaLink" value={localPopup.ctaLink} onChange={handlePopupChange} placeholder="#pricing veya https://..." className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" /></div>
                    </div>
                    <div className="text-right pt-4 border-t border-slate-200">
                        <button onClick={() => onUpdateEventPopup(localPopup)} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">Pop-up Ayarlarını Kaydet</button>
                    </div>
                </div>
            </div>

            {/* Influencer Codes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Influencer Referans Kodları</h2>
                <div className="flex gap-2 mb-4">
                    <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="Yeni referans kodu..." className="flex-grow bg-slate-50 p-2 rounded-md border border-slate-300" />
                    <button onClick={handleAddCode} className="bg-primary text-white font-semibold px-4 rounded-lg text-sm">Oluştur</button>
                </div>
                <div className="space-y-2">
                    {localCodes.map(code => (
                        <div key={code.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-200">
                            <span className="flex-grow font-mono font-semibold text-dark-blue">{code.code}</span>
                            <button onClick={() => copyToClipboard(code.code)} className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-200 rounded-md" title="Kopyala">
                                {copySuccess === code.code ? <span className="text-xs font-bold text-green-600">Kopyalandı!</span> : <ClipboardIcon className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDeleteCode(code.id)} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-200 rounded-md" title="Sil">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;