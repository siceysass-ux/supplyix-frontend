import React from 'react';
import { motivationalQuotes } from '../../../data/motivationalQuotes';

interface MotivationalModalProps {
    onClose: () => void;
}

const MotivationalModal: React.FC<MotivationalModalProps> = ({ onClose }) => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full text-center p-8" onClick={e => e.stopPropagation()}>
                <img src="/logo.png" alt="Supplyix Logo" className="h-12 w-auto mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-dark-blue">Günün Mottosu</h2>
                <p className="text-slate-600 mt-4 text-xl italic">"{quote.text}"</p>
                <p className="text-slate-500 mt-2 font-medium">- {quote.author}</p>
                <button 
                    onClick={onClose} 
                    className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus"
                >
                    Harika!
                </button>
            </div>
        </div>
    );
};

export default MotivationalModal;
