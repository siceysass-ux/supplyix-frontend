import {
    HomeIcon,
    CubeIcon,
    StarIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    SupportIcon,
    CreditCardIcon,
    BanknotesIcon,
    LogoutIcon,
} from './icons/duotone';

export const mainNavItems = [
    { name: 'Panel Ana Sayfa', path: '/dashboard', icon: HomeIcon },
    { name: 'Tedarik Havuzu', path: '/dashboard/sourcing-pool', icon: CubeIcon },
    { name: 'Favorilerim', path: '/dashboard/favorites', icon: StarIcon },
    { name: 'Siparişlerim', path: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Taleplerim', path: '/dashboard/requests', icon: DocumentTextIcon },
    { name: 'Ek Ücretler', path: '/dashboard/extra-fees', icon: BanknotesIcon },
];

export const secondaryNavItems = [
    { 
        name: 'Destek Merkezi', 
        path: '/dashboard/support-center', 
        icon: SupportIcon,
        color: 'text-green-700',
        darkColor: 'dark:text-green-400',
        hoverColor: 'hover:bg-green-100',
        darkHoverColor: 'dark:hover:bg-green-500/20',
        activeColor: 'bg-green-600',
        darkActiveColor: 'dark:bg-green-600',
    },
    { 
        name: 'Planlarım', 
        path: '/dashboard/membership', 
        icon: CreditCardIcon,
        color: 'text-blue-700',
        darkColor: 'dark:text-blue-400',
        hoverColor: 'hover:bg-blue-100',
        darkHoverColor: 'dark:hover:bg-blue-500/20',
        activeColor: 'bg-blue-600',
        darkActiveColor: 'dark:bg-blue-600',
    },
    {
        name: 'Çıkış Yap',
        path: '/',
        icon: LogoutIcon,
        color: 'text-red-700',
        darkColor: 'dark:text-red-400',
        hoverColor: 'hover:bg-red-100',
        darkHoverColor: 'dark:hover:bg-red-500/20',
    }
];