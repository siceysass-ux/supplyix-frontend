import React, { useState } from 'react';
import { CreditCardIcon } from '../icons/outline';

interface PaymentModalProps {
    item: {
        name: string;
        price: number;
        description: string;
    };
    onClose: () => void;
    onSubmit: (cvc: string) => void;
    isProcessing: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ item, onClose, onSubmit, isProcessing }) => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()) {
            setError('Lütfen tüm ödeme bilgilerini eksiksiz doldurun.');
            return;
        }
        onSubmit(cardCVC);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100">Ödeme Yap</h2>
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
                                <input name="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kart Numarası *</label>
                                <div className="relative">
                                    <input name="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 pl-10 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary" required />
                                    <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Son Kul. Tarihi *</label>
                                    <input name="cardExpiry" placeholder="AA/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary" required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">CVC *</label>
                                    <input name="cardCVC" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 dark:border-slate-600 focus:ring-primary focus:border-primary" required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3 rounded-b-xl">
                        <button type="button" onClick={onClose} disabled={isProcessing} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 disabled:opacity-50">İptal</button>
                        <button type="submit" disabled={isProcessing} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus disabled:bg-primary/70 disabled:cursor-wait">
                           {isProcessing ? 'İşleniyor...' : `Öde ($${item.price.toFixed(2)})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;