import React, { useState, useEffect } from 'react';

const LiveVisitorCounter: React.FC = () => {
    const [visitorCount, setVisitorCount] = useState(Math.floor(Math.random() * 50) + 120);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisitorCount(prevCount => {
                const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
                const newCount = prevCount + change;
                return newCount > 50 ? newCount : 51; // Keep it above a certain threshold
            });
        }, 2500); // Update every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center space-x-3">
            <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <div>
                <p className="text-2xl font-bold text-dark-blue">{visitorCount}</p>
                <p className="text-sm text-slate-500">Şu an sitede</p>
            </div>
        </div>
    );
};

export default LiveVisitorCounter;
