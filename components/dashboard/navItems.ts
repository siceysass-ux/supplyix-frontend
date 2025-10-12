import {
    LogoutIcon,
    CreditCardIcon,
    LifebuoyIcon,
} from './icons/duotone';

export const secondaryNavItems = [
    { 
        name: 'Destek Merkezi', 
        path: '/dashboard/support', 
        icon: LifebuoyIcon,
        colorClass: 'text-green-700 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-500/10',
        iconColorClass: 'text-green-700 dark:text-green-500',
    },
    { 
        name: 'Planlarım', 
        path: '/dashboard/membership', 
        icon: CreditCardIcon,
        colorClass: 'text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10',
        iconColorClass: 'text-blue-700 dark:text-blue-400',
    },
    { 
        name: 'Çıkış Yap', 
        path: '/', 
        icon: LogoutIcon,
        colorClass: 'text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10',
        iconColorClass: 'text-red-600 dark:text-red-400',
    },
];