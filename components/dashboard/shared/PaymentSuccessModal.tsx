import React from 'react';

interface PaymentSuccessModalProps {
    title: string;
    message: string;
    onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ title, message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full text-center p-8" onClick={e => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-dark-blue dark:text-slate-100">{title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{message}</p>
                <button 
                    onClick={onClose} 
                    className="mt-6 bg-primary text-white font-bold py-2 px-8 rounded-lg hover:bg-primary-focus"
                >
                    Harika!
                </button>
            </div>
            <style>{`
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

export default PaymentSuccessModal;