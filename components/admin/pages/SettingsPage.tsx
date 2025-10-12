import React, { useState, useEffect } from 'react';
import { Plan, EventPopup, InfluencerCode, NavItem, initialMainNavItems, initialAdminNavItems } from '../../dashboard/types';
import { TrashIcon, ClipboardIcon, Bars3Icon, PencilIcon } from '../../dashboard/icons/outline';
import ConfirmationModal from '../shared/ConfirmationModal';

interface SettingsPageProps {
    plans: Plan[];
    onUpdatePlans: (plans: Plan[]) => void;
    eventPopup: EventPopup;
    onUpdateEventPopup: (popup: EventPopup) => void;
    influencerCodes: InfluencerCode[];
    onUpdateInfluencerCodes: (codes: InfluencerCode[]) => void;
    mainNavItems: NavItem[];
    onUpdateMainNavItems: (items: NavItem[]) => void;
    adminNavItems: NavItem[];
    onUpdateAdminNavItems: (items: NavItem[]) => void;
}

// Modal for Adding/Editing Plans
interface PlanModalProps {
    plan: Partial<Plan> | null;
    onClose: () => void;
    onSave: (plan: Plan) => void;
    existingPlanNames: string[];
}

const PlanModal: React.FC<PlanModalProps> = ({ plan, onClose, onSave, existingPlanNames }) => {
    const [formData, setFormData] = useState<Plan>(
        plan ? { ...{ name: '', price: 0, durationText: '/ aylık', buttonText: 'Planı Seç', popular: false }, ...plan } :
        { name: '', price: 0, durationText: '/ aylık', buttonText: 'Planı Seç', popular: false }
    );
    const [error, setError] = useState('');
    const isEditing = !!plan?.name;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSaveClick = () => {
        setError('');
        if (!formData.name.trim() || !formData.durationText.trim() || !formData.buttonText.trim()) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }
        if (!isEditing && existingPlanNames.includes(formData.name.trim())) {
            setError('Bu paket adı zaten mevcut.');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">{isEditing ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}</h2>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                    <div><label className="block text-sm font-medium text-slate-700">Paket Adı *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required disabled={isEditing} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700">Fiyat ($) *</label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required /></div>
                        <div><label className="block text-sm font-medium text-slate-700">Süre Metni *</label><input type="text" name="durationText" value={formData.durationText} onChange={handleChange} placeholder="/ aylık" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700">Buton Metni *</label><input type="text" name="buttonText" value={formData.buttonText} onChange={handleChange} placeholder="Planı Seç" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required /></div>
                    <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} className="h-4 w-4 rounded" /> Popüler olarak işaretle</label></div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg">İptal</button>
                    <button onClick={handleSaveClick} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">Kaydet</button>
                </div>
            </div>
        </div>
    );
};


const SettingsPage: React.FC<SettingsPageProps> = ({ 
    plans, onUpdatePlans, 
    eventPopup, onUpdateEventPopup,
    influencerCodes, onUpdateInfluencerCodes,
    mainNavItems, onUpdateMainNavItems,
    adminNavItems, onUpdateAdminNavItems,
}) => {
    // Local state for forms
    const [localPlans, setLocalPlans] = useState<Plan[]>(plans);
    const [planPrices, setPlanPrices] = useState<Record<string, string>>({});
    const [localPopup, setLocalPopup] = useState<EventPopup>(eventPopup);
    const [localCodes, setLocalCodes] = useState<InfluencerCode[]>(influencerCodes);
    const [newCode, setNewCode] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    
    // User Menu management state
    const [localMainNavItems, setLocalMainNavItems] = useState<NavItem[]>(mainNavItems);
    const [draggedMainItemIndex, setDraggedMainItemIndex] = useState<number | null>(null);

    // Plan management state
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
    
    // Save status state
    const [saveStatus, setSaveStatus] = useState<Record<string, 'saving' | 'success' | null>>({});

    useEffect(() => { setLocalMainNavItems(mainNavItems) }, [mainNavItems]);
    useEffect(() => { 
        setLocalPlans(plans);
        const prices = plans.reduce((acc, plan) => {
            acc[plan.name] = String(plan.price);
            return acc;
        }, {} as Record<string, string>);
        setPlanPrices(prices);
    }, [plans]);
    useEffect(() => { setLocalPopup(eventPopup) }, [eventPopup]);
    useEffect(() => { setLocalCodes(influencerCodes) }, [influencerCodes]);


    const handleSave = (section: string, callback: () => void) => {
        setSaveStatus(prev => ({...prev, [section]: 'saving' }));
        setTimeout(() => {
            callback();
            setSaveStatus(prev => ({...prev, [section]: 'success' }));
            setTimeout(() => {
                setSaveStatus(prev => ({...prev, [section]: null }));
            }, 2000);
        }, 1000);
    };

    const getButtonText = (section: string, defaultText: string) => {
        if (saveStatus[section] === 'saving') return 'Kaydediliyor...';
        if (saveStatus[section] === 'success') return 'Kaydedildi!';
        return defaultText;
    };

    // Plan Handlers
    const handlePlanPriceChange = (planName: string, priceStr: string) => {
        setPlanPrices(prev => ({ ...prev, [planName]: priceStr }));
    };
    
    const handleSavePlans = () => {
        const updatedPlans = localPlans.map(plan => {
            const priceStr = planPrices[plan.name];
            const priceNum = parseFloat(priceStr);
            return {
                ...plan,
                price: isNaN(priceNum) ? 0 : priceNum,
            };
        });
        setLocalPlans(updatedPlans);
        handleSave('plans', () => onUpdatePlans(updatedPlans));
    };

    const handleOpenPlanModal = (plan: Plan | null) => {
        setEditingPlan(plan);
        setIsPlanModalOpen(true);
    };

    const handleSavePlan = (planData: Plan) => {
        if (editingPlan) {
            setLocalPlans(prev => prev.map(p => p.name === editingPlan.name ? planData : p));
        } else {
            setLocalPlans(prev => [...prev, planData]);
        }
        setIsPlanModalOpen(false);
        setEditingPlan(null);
    };

    const confirmDeletePlan = () => {
        if (planToDelete) {
            setLocalPlans(prev => prev.filter(p => p.name !== planToDelete.name));
            setPlanToDelete(null);
        }
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
    
    const handlePopupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newUrl = URL.createObjectURL(file);
            // Revoke old object URL to prevent memory leaks if it's a blob URL
            if (localPopup.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(localPopup.imageUrl);
            }
            setLocalPopup(prev => ({...prev, imageUrl: newUrl }));
        }
    };

    const handleAddCode = () => {
        const codeValue = newCode.trim();
        const discountValue = parseFloat(newDiscount);
        if (codeValue && !localCodes.some(c => c.code === codeValue)) {
            const newCodeObj: InfluencerCode = {
                id: `inf-${Date.now()}`,
                code: codeValue,
                discountRate: !isNaN(discountValue) ? discountValue : undefined,
            };
            const updatedCodes = [...localCodes, newCodeObj];
            setLocalCodes(updatedCodes);
            handleSave('codes', () => onUpdateInfluencerCodes(updatedCodes)); // Save when adding
            setNewCode('');
            setNewDiscount('');
        }
    };
    
    const handleDeleteCode = (id: string) => {
        const updatedCodes = localCodes.filter(c => c.id !== id);
        setLocalCodes(updatedCodes);
        handleSave('codes', () => onUpdateInfluencerCodes(updatedCodes)); // Save when deleting
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
            {isPlanModalOpen && <PlanModal plan={editingPlan} onClose={() => setIsPlanModalOpen(false)} onSave={handleSavePlan} existingPlanNames={localPlans.map(p => p.name)} />}
            {planToDelete && <ConfirmationModal title="Paketi Sil" message={`'${planToDelete.name}' adlı paketi kalıcı olarak silmek istediğinizden emin misiniz?`} onConfirm={confirmDeletePlan} onCancel={() => setPlanToDelete(null)} confirmText="Sil" />}

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
                    <button onClick={() => handleSave('mainMenu', () => onUpdateMainNavItems(localMainNavItems))} 
                        className={`font-bold py-2 px-6 rounded-lg transition-colors ${saveStatus.mainMenu === 'success' ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-focus'}`}
                        disabled={saveStatus.mainMenu === 'saving'}>
                        {getButtonText('mainMenu', 'Menüyü Kaydet')}
                    </button>
                </div>
            </div>

            {/* Plan Prices */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Paket Fiyatlarını Yönet</h2>
                <div className="space-y-4">
                    {localPlans.map(plan => (
                        <div key={plan.name} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="md:col-span-4">
                                <p className="font-semibold text-dark-blue">{plan.name}</p>
                            </div>
                            <div className="md:col-span-4">
                                <label className="text-xs font-semibold text-slate-500 block">Fiyat ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={planPrices[plan.name] || ''}
                                    onChange={(e) => handlePlanPriceChange(plan.name, e.target.value)}
                                    className="w-full bg-white p-2 rounded-md border border-slate-300"
                                />
                            </div>
                            <div className="md:col-span-4 flex justify-end items-center gap-2">
                                <button onClick={() => handleOpenPlanModal(plan)} className="p-2 text-slate-600 hover:text-primary hover:bg-slate-200 rounded-md transition-colors" title="Düzenle">
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                {plan.name !== '7 Günlük Deneme' && (
                                     <button onClick={() => setPlanToDelete(plan)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-slate-200 rounded-md transition-colors" title="Sil">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button onClick={() => handleOpenPlanModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Yeni Paket Ekle
                    </button>
                </div>
                <div className="text-right pt-4 mt-4 border-t border-slate-200">
                    <button onClick={handleSavePlans} 
                        className={`font-bold py-2 px-6 rounded-lg transition-colors ${saveStatus.plans === 'success' ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-focus'}`}
                        disabled={saveStatus.plans === 'saving'}>
                        {getButtonText('plans', 'Fiyatları Kaydet')}
                    </button>
                </div>
            </div>

            {/* Event Popup */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Etkinlik Pop-up Yönetimi</h2>
                <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="enabled" checked={localPopup.enabled} onChange={handlePopupChange} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" /><span className="font-semibold text-dark-blue">Pop-up'ı Etkinleştir</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Başlık</label>
                            <input type="text" name="title" value={localPopup.title} onChange={handlePopupChange} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-1 block">Görsel</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    name="imageUrl" 
                                    value={localPopup.imageUrl} 
                                    onChange={handlePopupChange} 
                                    placeholder="Görsel URL'i yapıştırın..."
                                    className="flex-grow bg-slate-50 p-2 rounded-md border border-slate-300" 
                                />
                                <label htmlFor="popup-image-upload" className="cursor-pointer bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 text-sm flex-shrink-0">
                                    Yükle
                                </label>
                                <input id="popup-image-upload" type="file" className="hidden" accept="image/*" onChange={handlePopupImageUpload} />
                            </div>
                        </div>
                    </div>
                     {localPopup.imageUrl && (
                        <div className="mt-2 border rounded-lg p-2 bg-slate-50">
                             <p className="text-xs font-semibold text-slate-500 mb-2">Önizleme:</p>
                            <img src={localPopup.imageUrl} alt="Pop-up Önizlemesi" className="max-h-32 w-auto rounded" />
                        </div>
                    )}
                    <div><label className="text-sm font-bold text-slate-700 mb-1 block">Açıklama</label><textarea name="description" value={localPopup.description} onChange={handlePopupChange} rows={3} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">Buton Metni (CTA)</label><input type="text" name="ctaText" value={localPopup.ctaText} onChange={handlePopupChange} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" /></div>
                        <div><label className="text-sm font-bold text-slate-700 mb-1 block">Buton Linki (CTA)</label><input type="text" name="ctaLink" value={localPopup.ctaLink} onChange={handlePopupChange} placeholder="#pricing veya https://..." className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" /></div>
                    </div>
                    <div className="text-right pt-4 border-t border-slate-200">
                        <button onClick={() => handleSave('popup', () => onUpdateEventPopup(localPopup))} 
                            className={`font-bold py-2 px-6 rounded-lg transition-colors ${saveStatus.popup === 'success' ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-focus'}`}
                            disabled={saveStatus.popup === 'saving'}>
                           {getButtonText('popup', 'Pop-up Ayarlarını Kaydet')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Influencer Codes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Influencer Referans Kodları</h2>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="Yeni referans kodu..." className="flex-grow bg-slate-50 p-2 rounded-md border border-slate-300" />
                    <input type="number" value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} placeholder="İndirim Oranı (%)" className="sm:w-48 bg-slate-50 p-2 rounded-md border border-slate-300" />
                    <button onClick={handleAddCode} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm">Oluştur</button>
                </div>
                <div className="space-y-2">
                    {localCodes.map(code => (
                        <div key={code.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-200">
                            <span className="font-mono font-semibold text-dark-blue">{code.code}</span>
                            {typeof code.discountRate === 'number' && (
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                    %{code.discountRate}
                                </span>
                            )}
                            <span className="flex-grow"></span>
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