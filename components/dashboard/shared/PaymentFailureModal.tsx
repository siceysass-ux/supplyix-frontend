import React from 'react';

const XPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    return (
        <div className="absolute text-red-500 font-bold text-3xl" style={style}>
            &times;
        </div>
    );
};

interface PaymentFailureModalProps {
    onClose: () => void;
}

const PaymentFailureModal: React.FC<PaymentFailureModalProps> = ({ onClose }) => {
    const xPieces = Array.from({ length: 60 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * -80}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall-and-spin ${2 + Math.random() * 4}s ${Math.random() * 3}s linear infinite`,
        };
        return <XPiece key={i} style={style} />;
    });

    return (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center z-[999]">
            <style>{`
                @keyframes fall-and-spin {
                    from { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">{xPieces}</div>
            <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl animate-scale-in w-full max-w-md">
                <img src="/logo.png" alt="Supplyix Logo" className="h-16 w-auto mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">Ödeme Başarısız</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Ödeme alınamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.</p>
                <button 
                    onClick={onClose} 
                    className="mt-8 bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary-focus transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
};

export default PaymentFailureModal;