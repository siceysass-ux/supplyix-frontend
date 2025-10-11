import {
    HomeIcon,
    UsersIcon,
    CubeIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    SupportIcon,
    Cog6ToothIcon,
    Squares2X2Icon
} from '../dashboard/icons/outline';
import { LogoutIcon } from '../dashboard/icons/duotone';

export const adminNavItems = [
    { name: 'Admin Ana Sayfa', path: '/admin', icon: HomeIcon },
    { name: 'Kullanıcıları Yönet', path: '/admin/users', icon: UsersIcon },
    { name: 'Ürünleri Yönet', path: '/admin/products', icon: CubeIcon },
    { name: 'Kategorileri Yönet', path: '/admin/categories', icon: Squares2X2Icon },
    { name: 'Siparişleri Yönet', path: '/admin/orders', icon: ShoppingCartIcon },
    { name: 'Talepleri Yönet', path: '/admin/requests', icon: DocumentTextIcon },
    { name: 'Destek Talepleri', path: '/admin/support', icon: SupportIcon },
];

export const adminSecondaryNavItems = [
    { name: 'Ayarlar', path: '/admin/settings', icon: Cog6ToothIcon },
    { name: 'Çıkış Yap', path: '/', icon: LogoutIcon },
];