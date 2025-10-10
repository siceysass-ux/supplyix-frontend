import {
    HomeIcon,
    CubeIcon,
    StarIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
} from './icons/outline';

export const navItems = [
    { name: 'Panel Ana Sayfa', path: '/dashboard', icon: HomeIcon },
    { name: 'Tedarik Havuzu', path: '/dashboard/sourcing-pool', icon: CubeIcon },
    { name: 'Favorilerim', path: '/dashboard/favorites', icon: StarIcon },
    { name: 'Siparişlerim', path: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Taleplerim', path: '/dashboard/requests', icon: DocumentTextIcon },
    { name: 'Ek Ücretler', path: '/dashboard/extra-fees', icon: CurrencyDollarIcon },
];