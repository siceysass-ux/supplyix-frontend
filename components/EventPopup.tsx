import React, { useState, useEffect } from 'react';
import { EventPopup as EventPopupType } from './dashboard/types';

interface EventPopupProps {
    popup: EventPopupType;
}

const EventPopup: React.FC<EventPopupProps> = ({ popup }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('hasSeenEventPopup');
        if (popup.enabled && !hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenEventPopup', 'true');
            }, 2000); // Show popup after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [popup.enabled]);

    if (!isOpen) {
        return null;
    }

    const handleClose = () => setIsOpen(false);
    
    const handleCTAClick = () => {
        if (popup.ctaLink.startsWith('#/')) {
            window.location.hash = popup.ctaLink.substring(1);
        } else if (popup.ctaLink.startsWith('#')) {
             const element = document.getElementById(popup.ctaLink.substring(1));
             element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.open(popup.ctaLink, '_blank');
        }
        handleClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full relative" onClick={e => e.stopPropagation()}>
                 <button onClick={handleClose} className="absolute -top-3 -right-3 bg-white dark:bg-slate-600 rounded-full p-1.5 shadow-lg text-slate-600 dark:text-slate-200 hover:scale-110 transition-transform" aria-label="Kapat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img src={popup.imageUrl} alt={popup.title} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-primary">{popup.title}</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">{popup.description}</p>
                    <button onClick={handleCTAClick} className="mt-6 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all w-full">
                        {popup.ctaText}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default EventPopup;