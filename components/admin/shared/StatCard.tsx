
import React, { ReactElement, ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    color: 'green' | 'blue' | 'indigo' | 'red';
}

const colorClasses = {
    green: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    red: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                {React.isValidElement(icon) ? React.cloneElement(icon as ReactElement<any>, { className: 'h-7 w-7' }) : icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-dark-blue dark:text-slate-100">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;