import React, { useState, useEffect } from 'react';

const LiveVisitorCounter: React.FC = () => {
    const [counts, setCounts] = useState({ landing: 0, dashboard: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await fetch('/api/analytics/active-users');
                if (response.ok) {
                    const data = await response.json();
                    setCounts({ landing: data.landing, dashboard: data.dashboard });
                }
            } catch (error) {
                console.error("Failed to fetch visitor counts:", error);
            }
        };

        fetchCounts(); // Initial fetch
        const interval = setInterval(fetchCounts, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Landing Page</span>
                </div>
                <p className="text-2xl font-bold text-dark-blue dark:text-slate-100">{counts.landing}</p>
                <p className="text-xs text-slate-400">Ziyaretçi</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Satıcı Paneli</span>
                </div>
                <p className="text-2xl font-bold text-dark-blue dark:text-slate-100">{counts.dashboard}</p>
                <p className="text-xs text-slate-400">Aktif Kullanıcı</p>
            </div>
        </div>
    );
};

export default LiveVisitorCounter;
