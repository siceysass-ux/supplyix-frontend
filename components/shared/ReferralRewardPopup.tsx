import React from 'react';

interface ReferralRewardPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReferralRewardPopup: React.FC<ReferralRewardPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
                {/* Celebration Icon */}
                <div className="text-8xl mb-4 animate-bounce">🎉</div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-primary mb-3">
                    Tebrikler!
                </h2>

                {/* Message */}
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
                    3 arkadaşını davet ettin ve
                </p>
                <p className="text-2xl font-bold text-primary mb-6">
                    1 Ay Ücretsiz Üyelik
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                    kazandın!
                </p>

                {/* Details */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Üyeliğin otomatik olarak 1 ay uzatıldı. Daha fazla arkadaşını davet ederek daha fazla ödül kazanabilirsin!
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-colors w-full"
                >
                    Harika! 🎊
                </button>
            </div>
        </div>
    );
};

export default ReferralRewardPopup;
