import React from 'react';
import { SunIcon, MoonIcon } from '../icons/outline';

interface ToggleSwitchProps {
    isDark: boolean;
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isDark, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-900 ${
                isDark ? 'bg-green-500' : 'bg-slate-300'
            }`}
            aria-pressed={isDark}
            title={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
        >
            <span className="sr-only">Temayı Değiştir</span>
            <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 flex items-center justify-center shadow-md ${
                    isDark ? 'translate-x-7' : 'translate-x-1'
                }`}
            >
                {isDark ? (
                    <MoonIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <SunIcon className="h-4 w-4 text-slate-500" />
                )}
            </span>
        </button>
    );
};

export default ToggleSwitch;
