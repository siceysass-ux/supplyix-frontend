import React, { useState, useMemo } from 'react';
import { CartItem, ShippingAddress } from '../types';
import PageHeader from '../shared/PageHeader';
import EmptyState from '../shared/EmptyState';
import { ShoppingCartIcon, TrashIcon } from '../icons/outline';
import { countries } from '../../../data/countries';
import PaymentFailureModal from '../shared/PaymentFailureModal';
import PaymentModal from '../shared/PaymentModal';

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
    currentUser?: { id: string; name: string; email: string; phone?: string };
}

const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateCartQuantity, onRemoveFromCart, onUpdatePodFile, onPlaceOrder, navigate, currentUser }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>(cart.map(item => item.id));
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showPaymentFailure, setShowPaymentFailure] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [shippingDetails, setShippingDetails] = useState<ShippingAddress>({
        consignee: '', address: '', city: '', country: 'Turkey', postcode: '',
    });
    const [paymentDetails, setPaymentDetails] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCVC: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress | keyof typeof paymentDetails, string>>>({});

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({ ...prev, [name]: value }));
    };

    // Clean up invalid cart items
    React.useEffect(() => {
        const invalidItems = cart.filter(item =>
            !item?.product || !item?.variant || !item?.product?.shippingInfo?.shippingCosts
        );

        if (invalidItems.length > 0) {
            console.warn('🗑️ Removing invalid cart items:', invalidItems.length);
            invalidItems.forEach(item => {
                if (item?.id) {
                    onRemoveFromCart(item.id);
                }
            });
        }
    }, [cart, onRemoveFromCart]);


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
        // Filter out invalid items (products that were deleted or have missing data)
        const validItems = cart.filter(item =>
            item?.product &&
            item?.variant &&
            item?.product?.shippingInfo?.shippingCosts &&
            item?.destination
        );

        const itemsToProcess = validItems.filter(item => selectedItems.includes(item.id));

        const subtotal = itemsToProcess.reduce((sum, item) => {
            const price = item.variant?.price || 0;
            return sum + price * item.quantity;
        }, 0);

        const shipping = itemsToProcess.reduce((sum, item) => {
            const baseShipping = item.product?.shippingInfo?.shippingCosts?.[item.destination] || 0;
            const modifier = item.variant?.shippingCostModifier || 0;
            return sum + (baseShipping + modifier) * item.quantity;
        }, 0);

        const missingFiles = itemsToProcess.some(item => item.product?.isPOD && !item.podFile && !item.podFileUrl);

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

    const handleContinueToPayment = async () => {
        if (summary.count === 0) {
            alert("Lütfen sipariş vermek için en az bir ürün seçin.");
            return;
        }
        if (hasMissingPodFile) {
            alert('Lütfen seçili tüm POD ürünleri için baskı dosyası yükleyin.');
            return;
        }
        if (!validateStep1()) {
            alert('Lütfen tüm zorunlu teslimat bilgilerini doldurun.');
            return;
        }

        // Ödeme modalını aç
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentId: string) => {
        console.log('Payment successful:', paymentId);
        setShowPaymentModal(false);
        setIsProcessing(true);

        // Sipariş oluştur
        await onPlaceOrder(selectedItems, shippingDetails);

        setIsProcessing(false);
        setOrderSuccess(true);
    };

    const handlePaymentFailure = (error: string) => {
        console.error('Payment failed:', error);
        setShowPaymentModal(false);
        setShowPaymentFailure(true);
    };

    const handleFinalizeOrder = async () => {
        // Bu fonksiyon artık kullanılmıyor - ödeme adımı kaldırıldı
        await handleContinueToPayment();
    };

    if (orderSuccess) {
        return <OrderSuccessAnimation onAnimationEnd={() => navigate('/dashboard/orders')} />;
    }

    if (cart.length === 0) {
        return (
            <div>
                <PageHeader title="Alışveriş Sepetim" subtitle="Sepetinizde henüz ürün bulunmuyor." />
                <EmptyState
                    icon={<img src="/cart-icon.png" alt="Sepet" className="w-16 h-16 mx-auto" />}
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

    // Prepare buyer data for payment
    const buyerData = currentUser ? {
        id: currentUser.id,
        name: currentUser.name.split(' ')[0] || 'Ad',
        surname: currentUser.name.split(' ').slice(1).join(' ') || 'Soyad',
        email: currentUser.email,
        gsmNumber: currentUser.phone || shippingDetails.phone || '+905555555555',
        address: shippingDetails.address,
        city: shippingDetails.city,
        country: shippingDetails.country,
        zipCode: shippingDetails.postcode
    } : {
        id: 'guest_' + Date.now(),
        name: shippingDetails.consignee.split(' ')[0] || 'Ad',
        surname: shippingDetails.consignee.split(' ').slice(1).join(' ') || 'Soyad',
        email: shippingDetails.email || 'guest@supplyix.com',
        gsmNumber: shippingDetails.phone || '+905555555555',
        address: shippingDetails.address,
        city: shippingDetails.city,
        country: shippingDetails.country,
        zipCode: shippingDetails.postcode
    };

    const paymentItem = {
        name: `Supplyix Sipariş - ${summary.count} Ürün`,
        price: summary.total,
        description: `${summary.count} ürün içeren sipariş`
    };

    return (
        <div className="space-y-6">
            {showPaymentFailure && <PaymentFailureModal onClose={() => setShowPaymentFailure(false)} />}
            {showPaymentModal && (
                <PaymentModal
                    item={paymentItem}
                    buyer={buyerData}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                />
            )}
            <PageHeader title="Sipariş Tamamlama" subtitle={`Sepetinizde ${cart.length} ürün var.`} />

            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        {/* Cart Items */}
                        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                                <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary mr-3" />
                                    Tümünü Seç ({selectedItems.length}/{cart.length})
                                </label>
                                <button onClick={() => selectedItems.forEach(onRemoveFromCart)} disabled={selectedItems.length === 0} className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-slate-400 disabled:cursor-not-allowed">
                                    Seçilenleri Kaldır
                                </button>
                            </div>
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                {cart.map(item => {
                                    // Skip invalid items
                                    if (!item?.product || !item?.variant) {
                                        return null;
                                    }

                                    const isSelected = selectedItems.includes(item.id);
                                    const isPodMissingFile = item.product?.isPOD && !item.podFile && !item.podFileUrl;

                                    // Calculate prices for this item
                                    const unitPrice = item.variant?.price || 0;
                                    const shippingCost = (item.product?.shippingInfo?.shippingCosts?.[item.destination] || 0) + (item.variant?.shippingCostModifier || 0);
                                    const itemTotal = (unitPrice + shippingCost) * item.quantity;

                                    return (
                                        <li key={item.id} className="py-4">
                                            <div className="flex items-start gap-4">
                                                <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(item.id)} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary mt-1 flex-shrink-0" />
                                                <img src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name || 'Product'} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-dark-blue dark:text-slate-100 truncate">{item.product?.name || 'Ürün'}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.variant?.attributes ? Object.values(item.variant.attributes).join(', ') : 'Varyant'}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hedef: <span className="uppercase font-medium">{item.destination || 'N/A'}</span></p>

                                                    {/* Price Breakdown */}
                                                    <div className="mt-2 space-y-0.5">
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            <span className="font-medium">Birim Fiyat:</span> ${unitPrice.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            <span className="font-medium">Kargo:</span> ${shippingCost.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            <span className="font-medium">Miktar:</span> {item.quantity}
                                                        </p>
                                                    </div>

                                                    {item.product?.isPOD && (
                                                        <div className="mt-2">
                                                            {(item.podFile || item.podFileName || item.podFileUrl) ? (
                                                                <div className="space-y-2">
                                                                    {/* Image Preview */}
                                                                    {item.podFileUrl && (
                                                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-green-500">
                                                                            <img
                                                                                src={item.podFileUrl}
                                                                                alt="POD Design"
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-medium text-green-600 truncate">
                                                                            ✓ {item.podFileName || item.podFile?.name || 'Baskı dosyası yüklendi'}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => onUpdatePodFile(item.id, null)}
                                                                            className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
                                                                        >
                                                                            Değiştir
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <label
                                                                        htmlFor={`pod-upload-${item.id}`}
                                                                        className="inline-flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs py-2 px-4 rounded-lg border-2 border-primary/30 hover:border-primary transition-all"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                        </svg>
                                                                        Baskı Dosyası Yükle
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        id={`pod-upload-${item.id}`}
                                                                        className="hidden"
                                                                        onChange={(e) => onUpdatePodFile(item.id, e.target.files ? e.target.files[0] : null)}
                                                                        accept="image/png, image/jpeg, image/svg+xml, image/webp, .psd, .ai"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {isSelected && isPodMissingFile && <p className="text-xs text-red-500 font-semibold mt-1">Bu ürün için dosya yüklenmesi zorunludur.</p>}
                                                </div>
                                                <div className="flex flex-col items-end justify-between self-stretch">
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg text-dark-blue dark:text-slate-100">${itemTotal.toFixed(2)}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Toplam</p>
                                                    </div>
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
                            <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Teslimat Bilgileri</h3>
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

                            {/* Order Summary */}
                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="text-sm font-bold text-dark-blue dark:text-slate-100 mb-3">Sipariş Özeti</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Seçili Ürün:</span>
                                        <span className="font-semibold text-dark-blue dark:text-slate-100">{summary.count} adet</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Ürünler Toplamı:</span>
                                        <span className="font-semibold text-dark-blue dark:text-slate-100">${summary.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">Kargo Toplamı:</span>
                                        <span className="font-semibold text-dark-blue dark:text-slate-100">${summary.shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-base font-bold text-primary pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span>Genel Toplam:</span>
                                        <span>${summary.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleContinueToPayment} disabled={summary.count === 0 || hasMissingPodFile || isProcessing} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus transition-colors mt-6 disabled:bg-primary/50 disabled:cursor-not-allowed">{isProcessing ? 'Sipariş Oluşturuluyor...' : 'Sipariş Ver'}</button>
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