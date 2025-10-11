import React from 'react';

const WavingHand: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    return (
        <div className="absolute text-5xl" style={style}>
            👋
        </div>
    );
};

const LogoutAnimation: React.FC = () => {
    const emojis = Array.from({ length: 40 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animation: `float-up ${3 + Math.random() * 3}s ${Math.random() * 2}s ease-in-out infinite`,
        };
        return <WavingHand key={i} style={style} />;
    });

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-[999] overflow-hidden">
            <style>{`
                @keyframes float-up {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-10vh) rotate(${Math.random() * 720 - 360}deg);
                        opacity: 0;
                    }
                }
                @keyframes scale-in-subtle {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in-subtle {
                    animation: scale-in-subtle 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
            <div className="absolute inset-0 pointer-events-none">{emojis}</div>
            <div className="relative text-center animate-scale-in-subtle">
                <img
                    src="/logo.png"
                    alt="Supplyix Logo"
                    className="h-24 w-auto mx-auto"
                />
                <p className="mt-6 text-2xl font-bold text-dark-blue dark:text-slate-200">
                    Hoşçakal!
                </p>
            </div>
        </div>
    );
};

export default LogoutAnimation;