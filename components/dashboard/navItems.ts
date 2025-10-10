import {
    HomeIcon,
    CreditCardIcon,
    CubeIcon,
    StarIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    BellIcon,
    SupportIcon,
    UserCircleIcon
} from './icons/outline';

export const navItems = [
    { name: 'Panel Ana Sayfa', path: '/dashboard', icon: HomeIcon },
    { name: 'Üyeliğim', path: '/dashboard/membership', icon: CreditCardIcon },
    { name: 'Tedarik Havuzu', path: '/dashboard/sourcing-pool', icon: CubeIcon },
    { name: 'Favorilerim', path: '/dashboard/favorites', icon: StarIcon },
    { name: 'Siparişlerim', path: '/dashboard/orders', icon: ShoppingCartIcon },
    { name: 'Taleplerim', path: '/dashboard/requests', icon: DocumentTextIcon },
    { name: 'Danışmanlık', path: '/dashboard/consulting', icon: AcademicCapIcon },
    { name: 'Ek Ücretler', path: '/dashboard/extra-fees', icon: CurrencyDollarIcon },
    { name: 'Bildirimler', path: '/dashboard/notifications', icon: BellIcon },
    { name: 'Destek Merkezi', path: '/dashboard/support-center', icon: SupportIcon },
    { name: 'Profil & Güvenlik', path: '/dashboard/profile-security', icon: UserCircleIcon },
];
