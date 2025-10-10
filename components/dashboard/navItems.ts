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
        hoverColor: 'hover:bg-green-100',
        activeColor: 'bg-green-600'
    },
    { 
        name: 'Planlarım', 
        path: '/dashboard/membership', 
        icon: CreditCardIcon,
        color: 'text-blue-700',
        hoverColor: 'hover:bg-blue-100',
        activeColor: 'bg-blue-600'
    },
    {
        name: 'Çıkış Yap',
        path: '/',
        icon: LogoutIcon,
        color: 'text-red-700',
        hoverColor: 'hover:bg-red-100',
    }
];