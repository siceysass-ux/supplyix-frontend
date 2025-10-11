import React, { useState, useMemo } from 'react';
import { CartItem, ShippingAddress } from '../types';
import PageHeader from '../shared/PageHeader';
import EmptyState from '../shared/EmptyState';
import { ShoppingCartIcon, TrashIcon } from '../icons/outline';
import { countries } from '../../../data/countries';
import PaymentFailureModal from '../shared/PaymentFailureModal';

// Helper component for the success animation
const OrderSuccessAnimation: React.FC<{ onAnimationEnd: () => void }> = ({ onAnimationEnd }) => {
    React.useEffect(() => {
        const timer = setTimeout(onAnimationEnd, 4000);
        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    const confettiPieces = Array.from({ length: 150 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * -80}%`,
            backgroundColor: ['#ff6a00', '#042d4d', '#FBBF24', '#34D399'][Math.floor(Math.random() * 4)],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
        };
        return <div key={i} className="absolute w-2 h-4" style={style}></div>;
    });

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4 text-center overflow-hidden z-50">
            <div className="absolute inset-0 pointer-events-none">{confettiPieces}</div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl animate-scale-in">
                <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-dark-blue dark:text-slate-100">Siparişiniz Başarıyla Alındı!</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Siparişlerim sayfasına yönlendiriliyorsunuz...</p>
            </div>
            <style>{`
                @keyframes confetti-fall {
                    from { transform: translateY(0) rotate(0); opacity: 1; }
                    to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </div>
    );
};


interface CartPageProps {
    cart: CartItem[];
    onUpdateCartQuantity: (cartItemId: string, newQuantity: number) => void;
    onRemoveFromCart: (cartItemId: string) => void;
    onUpdatePodFile: (cartItemId: string, file: File | null) => void;
    onPlaceOrder: (selectedItemIds: string[], shippingDetails: ShippingAddress) => Promise<void>;
    navigate: (path: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateCartQuantity, onRemoveFromCart, onUpdatePodFile, onPlaceOrder, navigate }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>(cart.map(item => item.id));
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showPaymentFailure, setShowPaymentFailure] = useState(false);

    const [shippingDetails, setShippingDetails] = useState<ShippingAddress>({
        consignee: '', address: '', city: '', country: 'Turkey', postcode: '',
    });
    const [paymentDetails, setPaymentDetails] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCVC: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress | keyof typeof paymentDetails, string>>>({});
    
    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({...prev, [name]: value}));
    };
    
    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({...prev, [name]: value}));
    };


    const handleSelectItem = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(cart.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };
    
    const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

    const { summary, hasMissingPodFile } = useMemo(() => {
        const itemsToProcess = cart.filter(item => selectedItems.includes(item.id));
        const subtotal = itemsToProcess.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        const shipping = itemsToProcess.reduce((sum, item) => {
            const baseShipping = item.product.shippingInfo.shippingCosts[item.destination];
            const modifier = item.variant.shippingCostModifier;
            return sum + (baseShipping + modifier) * item.quantity;
        }, 0);
        const missingFiles = itemsToProcess.some(item => item.product.isPOD && !item.podFile);

        return {
            summary: {
                subtotal,
                shipping,
                total: subtotal + shipping,
                count: itemsToProcess.length
            },
            hasMissingPodFile: missingFiles
        };
    }, [cart, selectedItems]);


    const validateStep1 = () => {
        const newErrors: typeof errors = {};
        if (!shippingDetails.consignee.trim()) newErrors.consignee = "Alıcı adı zorunludur.";
        if (!shippingDetails.address.trim()) newErrors.address = "Adres zorunludur.";
        if (!shippingDetails.city.trim()) newErrors.city = "Şehir zorunludur.";
        if (!shippingDetails.country.trim()) newErrors.country = "Ülke zorunludur.";
        if (!shippingDetails.postcode.trim()) newErrors.postcode = "Posta kodu zorunludur.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const validateStep2 = () => {
        const newErrors: typeof errors = {};
        if (!paymentDetails.cardName.trim()) newErrors.cardName = 'Kart sahibi adı zorunludur.';
        if (!paymentDetails.cardNumber.trim()) newErrors.cardNumber = 'Kart numarası zorunludur.';
        if (!paymentDetails.cardExpiry.trim()) newErrors.cardExpiry = 'Son kullanma tarihi zorunludur.';
        if (!paymentDetails.cardCVC.trim()) newErrors.cardCVC = 'CVC zorunludur.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinueToPayment = () => {
        if (summary.count === 0) {
            alert("Lütfen ödeme yapmak için en az bir ürün seçin.");
            return;
        }
        if (hasMissingPodFile) {
            alert('Lütfen seçili tüm POD ürünleri için baskı dosyası yükleyin.');
            return;
        }
        if (validateStep1()) {
            setStep(2);
        } else {
             alert('Lütfen tüm zorunlu teslimat bilgilerini doldurun.');
        }
    };

    const handleFinalizeOrder = async () => {
        if (!validateStep2()) {
            alert('Lütfen ödeme bilgilerinizi eksiksiz doldurun.');
            return;
        };

        // DEMO: Simulate payment failure if CVC is not '123'
        if (paymentDetails.cardCVC !== '123') {
            setShowPaymentFailure(true);
            return;
        }

        setIsProcessing(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await onPlaceOrder(selectedItems, shippingDetails);

        setIsProcessing(false);
        setOrderSuccess(true);
    };

    if (orderSuccess) {
        return <OrderSuccessAnimation onAnimationEnd={() => navigate('/dashboard/orders')} />;
    }

    if (cart.length === 0) {
        return (
            <div>
                 <PageHeader title="Alışveriş Sepetim" subtitle="Sepetinizde henüz ürün bulunmuyor." />
                 <EmptyState
                    icon={<ShoppingCartIcon />}
                    title="Sepetiniz boş"
                    message="Tedarik Havuzu'ndan harika ürünler ekleyerek başlayın."
                    actionButton={
                        <button onClick={() => navigate('/dashboard/sourcing-pool')} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus">
                            Alışverişe Başla
                        </button>
                    }
                 />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showPaymentFailure && <PaymentFailureModal onClose={() => setShowPaymentFailure(false)} />}
            <PageHeader title="Sipariş Tamamlama" subtitle={`Sepetinizde ${cart.length} ürün var.`} />

            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        {/* Cart Items */}
                        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                             <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                                <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary mr-3"/>
                                    Tümünü Seç ({selectedItems.length}/{cart.length})
                                </label>
                                <button onClick={() => selectedItems.forEach(onRemoveFromCart)} disabled={selectedItems.length === 0} className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-slate-400 disabled:cursor-not-allowed">
                                    Seçilenleri Kaldır
                                </button>
                            </div>
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                {cart.map(item => {
                                    const isSelected = selectedItems.includes(item.id);
                                    const isPodMissingFile = item.product.isPOD && !item.podFile;
                                    return (
                                        <li key={item.id} className="py-4">
                                            <div className="flex items-start gap-4">
                                                <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(item.id)} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary mt-1 flex-shrink-0"/>
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-dark-blue dark:text-slate-100 truncate">{item.product.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{Object.values(item.variant.attributes).join(', ')}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hedef: <span className="uppercase font-medium">{item.destination}</span></p>
                                                    {item.product.isPOD && (
                                                        <div className="mt-2">
                                                            {item.podFile ? (
                                                                <div className="flex items-center gap-2 text-xs">
                                                                    <span className="font-medium text-green-600 truncate">{item.podFile.name}</span>
                                                                    <button onClick={() => onUpdatePodFile(item.id, null)} className="text-red-500 font-semibold">Değiştir</button>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <label htmlFor={`pod-upload-${item.id}`} className="cursor-pointer text-xs font-semibold text-primary hover:underline">Baskı Dosyası Yükle</label>
                                                                    <input type="file" id={`pod-upload-${item.id}`} className="hidden" onChange={(e) => onUpdatePodFile(item.id, e.target.files ? e.target.files[0] : null)} accept="image/png, image/jpeg, image/svg+xml, image/webp, .psd, .ai"/>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {isSelected && isPodMissingFile && <p className="text-xs text-red-500 font-semibold mt-1">Bu ürün için dosya yüklenmesi zorunludur.</p>}
                                                </div>
                                                <div className="flex flex-col items-end justify-between self-stretch">
                                                    <p className="font-bold text-lg text-dark-blue dark:text-slate-100">${(item.variant.price * item.quantity).toFixed(2)}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-md">
                                                            <button onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-lg font-semibold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-md">-</button>
                                                            <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                                                            <button onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-lg font-semibold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-md">+</button>
                                                        </div>
                                                        <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 p-1" aria-label="Kaldır"><TrashIcon className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    {/* Shipping and Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                            <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Teslimat Bilgileri (Adım 1/2)</h3>
                            <div className="space-y-4">
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Alıcı Tam Adı *</label><input name="consignee" value={shippingDetails.consignee} onChange={handleShippingChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.consignee ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Adres Satırı 1 *</label><input name="address" value={shippingDetails.address} onChange={handleShippingChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Adres Satırı 2 (Opsiyonel)</label><input name="address2" value={shippingDetails.address2 || ''} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-300 dark:border-slate-600" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Şehir *</label><input name="city" value={shippingDetails.city} onChange={handleShippingChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.city ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                    <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Posta Kodu *</label><input name="postcode" value={shippingDetails.postcode} onChange={handleShippingChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.postcode ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                </div>
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Ülke *</label><select name="country" value={shippingDetails.country} onChange={handleShippingChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.country ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required><option value="">Ülke Seçin</option>{countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}</select></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Eyalet (Opsiyonel)</label><input name="province" value={shippingDetails.province || ''} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-300 dark:border-slate-600" /></div>
                                    <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Telefon (Opsiyonel)</label><input name="phone" type="tel" value={shippingDetails.phone || ''} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-300 dark:border-slate-600" /></div>
                                </div>
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">E-posta (Opsiyonel)</label><input name="email" type="email" value={shippingDetails.email || ''} onChange={handleShippingChange} className="w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-300 dark:border-slate-600" /></div>
                            </div>
                            <button onClick={handleContinueToPayment} disabled={summary.count === 0 || hasMissingPodFile} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus transition-colors mt-6 disabled:bg-primary/50 disabled:cursor-not-allowed">Ödemeye Devam Et</button>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100 mb-4">Ödeme Bilgileri (Adım 2/2)</h3>
                            <div className="space-y-4">
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Kart Sahibi Adı *</label><input name="cardName" value={paymentDetails.cardName} onChange={handlePaymentChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.cardName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Kart Numarası *</label><input name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.cardNumber ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">Son Kul. Tarihi (AA/YY) *</label><input name="cardExpiry" value={paymentDetails.cardExpiry} onChange={handlePaymentChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.cardExpiry ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                    <div><label className="text-sm font-medium text-slate-600 dark:text-slate-300">CVC *</label><input name="cardCVC" value={paymentDetails.cardCVC} onChange={handlePaymentChange} className={`w-full bg-slate-50 dark:bg-slate-700 mt-1 p-2 rounded-md border ${errors.cardCVC ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`} required /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                            <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Sipariş Özeti</h3>
                             <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center"><span className="font-medium text-slate-600 dark:text-slate-300">Seçili Ürün:</span><span className="font-semibold text-dark-blue dark:text-slate-100">{summary.count}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium text-slate-600 dark:text-slate-300">Ara Toplam:</span><span className="font-semibold text-dark-blue dark:text-slate-100">${summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium text-slate-600 dark:text-slate-300">Kargo Toplamı:</span><span className="font-semibold text-dark-blue dark:text-slate-100">${summary.shipping.toFixed(2)}</span></div>
                                <div className="flex justify-between items-center text-lg font-bold text-primary pt-3 mt-3 border-t border-slate-200 dark:border-slate-700"><span >Genel Toplam:</span><span>${summary.total.toFixed(2)}</span></div>
                            </div>
                             <div className="mt-4 text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md border dark:border-slate-700"><b>Teslimat Adresi:</b> {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.country}</div>
                            <div className="flex items-center gap-2 mt-6">
                                <button onClick={() => setStep(1)} className="w-full bg-slate-200 text-dark-blue font-bold py-3 rounded-lg hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500">Geri Dön</button>
                                <button onClick={handleFinalizeOrder} disabled={isProcessing} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed">{isProcessing ? 'İşleniyor...' : 'Siparişi Tamamla'}</button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default CartPage;