import React, { useState, useEffect, useRef } from 'react';
import { CreditCardIcon } from '../icons/outline';
import axios from 'axios';

interface PaymentModalProps {
    item: {
        name: string;
        price: number;
        description: string;
    };
    buyer: {
        id: string;
        name: string;
        surname: string;
        email: string;
        gsmNumber: string;
        address?: string;
        city?: string;
        country?: string;
        zipCode?: string;
        identityNumber?: string;
        registrationDate?: string;
    };
    onClose: () => void;
    onSuccess: (paymentId: string) => void;
    onFailure: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ item, buyer, onClose, onSuccess, onFailure }) => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [show3DSecure, setShow3DSecure] = useState(false);
    const [threeDSHtml, setThreeDSHtml] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Listen for payment result from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Security: verify origin if needed
            if (event.data.type === 'PAYMENT_SUCCESS') {
                setShow3DSecure(false);
                onSuccess(event.data.paymentId);
            } else if (event.data.type === 'PAYMENT_FAILED') {
                setShow3DSecure(false);
                setIsProcessing(false);
                onFailure(event.data.message || 'Ödeme başarısız oldu');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSuccess, onFailure]);

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Format expiry date
    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) { // 16 digits + 3 spaces
            setCardNumber(formatted);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiry(e.target.value);
        if (formatted.length <= 5) {
            setCardExpiry(formatted);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()) {
            setError('Lütfen tüm ödeme bilgilerini eksiksiz doldurun.');
            return;
        }

        const cardNumberClean = cardNumber.replace(/\s/g, '');
        if (cardNumberClean.length !== 16) {
            setError('Geçerli bir kart numarası girin (16 hane).');
            return;
        }

        if (cardCVC.length !== 3) {
            setError('CVC 3 haneli olmalıdır.');
            return;
        }

        const expiryParts = cardExpiry.split('/');
        if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
            setError('Geçerli bir son kullanma tarihi girin (AA/YY).');
            return;
        }

        setIsProcessing(true);

        try {
            // Call backend to initialize payment
            const response = await axios.post('http://localhost:3002/api/payment/initialize', {
                item: {
                    id: `item_${Date.now()}`,
                    name: item.name,
                    price: item.price,
                    category: 'Subscription',
                    subcategory: 'Membership'
                },
                buyer: {
                    id: buyer.id,
                    name: buyer.name,
                    surname: buyer.surname,
                    email: buyer.email,
                    gsmNumber: buyer.gsmNumber,
                    address: buyer.address || 'Adres bilgisi',
                    city: buyer.city || 'Istanbul',
                    country: buyer.country || 'Turkey',
                    zipCode: buyer.zipCode || '34732',
                    identityNumber: buyer.identityNumber || '11111111111',
                    registrationDate: buyer.registrationDate || new Date().toISOString().replace('T', ' ').substring(0, 19)
                },
                card: {
                    cardHolderName: cardName,
                    cardNumber: cardNumberClean,
                    expireMonth: expiryParts[0],
                    expireYear: '20' + expiryParts[1],
                    cvc: cardCVC
                }
            });

            const { data } = response;

            if (data.success && data.threeDSHtmlContent) {
                console.log('✅ 3DS HTML received, length:', data.threeDSHtmlContent.length);
                // Decode base64 HTML
                const decodedHtml = atob(data.threeDSHtmlContent);
                console.log('📄 Decoded 3DS HTML preview:', decodedHtml.substring(0, 200));
                setThreeDSHtml(decodedHtml);
                setShow3DSecure(true);
            } else {
                setError(data.error || 'Ödeme başlatılamadı');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            setError('Ödeme işlemi sırasında bir hata oluştu');
        } finally {
            setIsProcessing(false);
        }
    };

    // Inject 3D Secure HTML into iframe
    useEffect(() => {
        if (show3DSecure && threeDSHtml && iframeRef.current) {
            const iframe = iframeRef.current;

            try {
                // Try using srcDoc first (more reliable)
                iframe.srcdoc = threeDSHtml;

                // Fallback to document.write
                setTimeout(() => {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc && !iframeDoc.body?.innerHTML) {
                        iframeDoc.open();
                        iframeDoc.write(threeDSHtml);
                        iframeDoc.close();
                    }
                }, 100);
            } catch (error) {
                console.error('Failed to inject 3DS HTML:', error);
            }
        }
    }, [show3DSecure, threeDSHtml]);

    if (show3DSecure) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full h-[600px] flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">3D Secure Doğrulama</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Lütfen bankanızın güvenlik sayfasında işlemi onaylayın</p>
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900">
                        <iframe
                            ref={iframeRef}
                            className="w-full h-full border-0 rounded-lg bg-white"
                            title="3D Secure"
                            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-modals allow-popups"
                        />
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Ödeme işlemi devam ediyor...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Ödeme Yap</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">iyzico güvenli ödeme sistemi</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
                            <p className="font-bold text-dark-blue dark:text-slate-200">Ödenecek Kalem: <span className="text-primary">{item.name}</span></p>
                            <p className="text-2xl font-extrabold text-primary mt-1">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kart Sahibi Adı *</label>
                                <input
                                    name="cardName"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary"
                                    placeholder="Ad Soyad"
                                    required
                                    disabled={isProcessing}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kart Numarası *</label>
                                <div className="relative">
                                    <input
                                        name="cardNumber"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 pl-10 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary"
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        disabled={isProcessing}
                                    />
                                    <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Son Kul. Tarihi *</label>
                                    <input
                                        name="cardExpiry"
                                        placeholder="AA/YY"
                                        value={cardExpiry}
                                        onChange={handleExpiryChange}
                                        className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">CVC *</label>
                                    <input
                                        name="cardCVC"
                                        value={cardCVC}
                                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                        className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary"
                                        placeholder="123"
                                        required
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                                <strong>Test Kartı:</strong> 5528 7900 0000 0008 | Son Kullanma: 12/30 | CVC: 123
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:bg-primary/70 disabled:cursor-wait"
                        >
                            {isProcessing ? 'İşleniyor...' : `Öde ($${item.price.toFixed(2)})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;