import React from 'react';
import { BellIcon, ShoppingCartIcon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from './icons/outline';
import { LogoutIcon } from './icons/duotone';
import { CartItem, Announcement } from './types';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../shared/ThemeToggle';
import api, { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../src/services/api';

interface DashboardHeaderProps {
    pageTitle: string;
    navigate: (path: string) => void;
    onLogout: () => void;
    cart: CartItem[];
    onUpdateCartQuantity: (cartItemId: string, newQuantity: number) => void;
    onRemoveFromCart: (cartItemId: string) => void;
    announcements: Announcement[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ pageTitle, navigate, onLogout, cart, onUpdateCartQuantity, onRemoveFromCart, announcements }) => {
    const [isNotificationsOpen, setNotificationsOpen] = React.useState(false);
    const [readAnnouncementIds, setReadAnnouncementIds] = React.useState<string[]>([]);
    const notificationsRef = React.useRef<HTMLDivElement>(null);

    const [isCartOpen, setCartOpen] = React.useState(false);
    const cartRef = React.useRef<HTMLDivElement>(null);

    const [isProfileOpen, setProfileOpen] = React.useState(false);
    const profileRef = React.useRef<HTMLDivElement>(null);

    // User profile state
    const [userProfile, setUserProfile] = React.useState({
        name: 'Kullanıcı',
        email: '',
        avatar: ''
    });

    // Load user profile from localStorage
    React.useEffect(() => {
        const loadProfile = () => {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserProfile({
                    name: user.name || 'Kullanıcı',
                    email: user.email || '',
                    avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&color=fff`
                });
            }
        };

        loadProfile();

        // Listen for profile updates
        window.addEventListener('profileUpdated', loadProfile);
        return () => window.removeEventListener('profileUpdated', loadProfile);
    }, []);


    // Notifications state
    const [userNotifications, setUserNotifications] = React.useState<any[]>([]);

    // Fetch user notifications
    React.useEffect(() => {
        const fetchNotifications = async () => {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const user = JSON.parse(userStr);
                try {
                    const data = await getNotifications(user.id);
                    setUserNotifications(data);
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        };

        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllAsRead = async () => {
        const allIds = announcements.map(a => a.id);
        setReadAnnouncementIds(allIds);
        localStorage.setItem('readAnnouncementIds', JSON.stringify(allIds));

        // Also mark user notifications as read
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            try {
                await markAllNotificationsRead(user.id);
                setUserNotifications(prev => prev.map(n => ({ ...n, read: true })));
            } catch (error) {
                console.error('Failed to mark notifications as read:', error);
            }
        }
    };

    const handleMarkOneAsRead = async (id: string, isAnnouncement: boolean, link?: string) => {
        if (isAnnouncement) {
            if (!readAnnouncementIds.includes(id)) {
                const newIds = [...readAnnouncementIds, id];
                setReadAnnouncementIds(newIds);
                localStorage.setItem('readAnnouncementIds', JSON.stringify(newIds));
            }
        } else {
            // Mark user notification as read
            try {
                await markNotificationRead(id);
                setUserNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }

        // Navigate if link is present
        if (link) {
            handleNavigation(link);
            setNotificationsOpen(false);
        }
    };

    const notifications = React.useMemo(() => {
        const announcementNotifs = announcements.map(ann => ({
            id: ann.id,
            type: ann.type === 'primary' ? 'Duyuru' : ann.type === 'blue' ? 'Güncelleme' : 'Yeni Özellik',
            title: ann.title,
            date: ann.date,
            read: readAnnouncementIds.includes(ann.id),
            icon: 'MegaphoneIcon',
            isAnnouncement: true
        }));

        const userNotifs = userNotifications.map(n => ({
            id: n.id,
            type: n.type === 'warning' ? 'Uyarı' : n.type === 'error' ? 'Hata' : 'Bilgi',
            title: n.title,
            date: new Date(n.createdAt).toLocaleDateString('tr-TR'),
            read: n.read,
            icon: n.type === 'warning' ? 'ExclamationTriangleIcon' : 'InformationCircleIcon',
            isAnnouncement: false,
            message: n.message,
            link: n.link
        }));

        // Merge and sort by date (assuming announcements have date string, userNotifs have createdAt)
        // For simplicity, just putting user notifications first
        return [...userNotifs, ...announcementNotifs];
    }, [announcements, readAnnouncementIds, userNotifications]);

    const hasUnread = React.useMemo(() => notifications.some(n => !n.read), [notifications]);
    const totalItemsInCart = React.useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    const { subtotal, shippingTotal, total } = React.useMemo(() => {
        const sub = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
        const shipping = cart.reduce((sum, item) => {
            const baseShipping = item.product.shippingInfo.shippingCosts[item.destination];
            const modifier = item.variant.shippingCostModifier;
            return sum + (baseShipping + modifier) * item.quantity;
        }, 0);
        return { subtotal: sub, shippingTotal: shipping, total: sub + shipping };
    }, [cart]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setCartOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
        setProfileOpen(false); // Close dropdown on navigation
    };

    const renderNotificationIcon = (iconName: string | React.ElementType) => {
        if (iconName === 'MegaphoneIcon') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 018.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.467a23.782 23.782 0 00-4.673-4.773" />
                </svg>
            );
        }
        if (iconName === 'ExclamationTriangleIcon') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            );
        }
        if (iconName === 'InformationCircleIcon') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
            );
        }
        if (typeof iconName !== 'string') {
            const IconComponent = iconName;
            return <IconComponent className="h-6 w-6 text-primary" />;
        }
        return <ShoppingCartIcon className="h-6 w-6 text-primary" />;
    };

    return (
        <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 z-10 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold text-dark-blue dark:text-slate-100 sm:block">{pageTitle}</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle />
                {/* Shopping Cart */}
                <div className="relative" ref={cartRef}>
                    <button
                        id="cart-icon-button"
                        onClick={() => setCartOpen(!isCartOpen)}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Sepet"
                    >
                        <img src="/cart.webp" alt="Sepet" className="h-6 w-6" />
                        {totalItemsInCart > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary rounded-full">
                                {totalItemsInCart}
                            </span>
                        )}
                    </button>
                    {isCartOpen && (
                        <div className="absolute right-0 mt-2 w-96 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none z-20">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-md font-semibold text-dark-blue dark:text-slate-100">Alışveriş Sepeti</h3>
                            </div>
                            {cart.length === 0 ? (
                                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                    <img src="/cart.webp" alt="Boş Sepet" className="h-12 w-12 mx-auto opacity-30 mb-2" />
                                    Sepetiniz boş.
                                </div>
                            ) : (
                                <>
                                    <ul className="max-h-80 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 p-2">
                                        {cart.map(item => {
                                            const variationText = Object.values(item.variant.attributes).join(', ');
                                            return (
                                                <li key={item.id} className="p-2 flex items-start space-x-4">
                                                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-dark-blue dark:text-slate-100 truncate">{item.product.name}</p>
                                                        {variationText && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{variationText}</p>}
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Hedef: <span className="uppercase">{item.destination}</span></p>
                                                        <div className="flex items-center mt-2">
                                                            <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-md">
                                                                <button onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 text-lg font-semibold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-md">-</button>
                                                                <span className="px-3 py-0.5 text-sm font-medium">{item.quantity}</span>
                                                                <button onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 text-lg font-semibold text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-md">+</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end justify-between h-16">
                                                        <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-500" aria-label="Kaldır">
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                        <p className="text-sm font-bold text-dark-blue dark:text-slate-100">${(item.variant.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-600 dark:text-slate-300">Ara Toplam:</span>
                                            <span className="font-semibold text-dark-blue dark:text-slate-100">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-600 dark:text-slate-300">Kargo:</span>
                                            <span className="font-semibold text-dark-blue dark:text-slate-100">${shippingTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                                            <span className="text-md font-semibold text-dark-blue dark:text-slate-100">Toplam:</span>
                                            <span className="text-xl font-bold text-dark-blue dark:text-slate-100">${total.toFixed(2)}</span>
                                        </div>
                                        <div className="mt-2">
                                            <button onClick={() => { navigate('/dashboard/cart'); setCartOpen(false); }} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-focus transition-colors">
                                                Sepete Git
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                    <button
                        onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Bildirimler"
                    >
                        <img src="/notifacation.webp" alt="Bildirimler" className="h-7 w-7" />
                        {hasUnread && (
                            <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary top-0.5 right-0.5"></span>
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none z-20">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-md font-semibold text-dark-blue dark:text-slate-100">Duyurular & Bildirimler</h3>
                                {hasUnread && (
                                    <button onClick={handleMarkAllAsRead} className="text-xs text-primary font-semibold hover:underline">Tümünü okundu işaretle</button>
                                )}
                            </div>
                            <ul className="max-h-96 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
                                {notifications.length === 0 ? (
                                    <li className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Henüz yeni bir bildirim yok.
                                    </li>
                                ) : (
                                    notifications.map((notification, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleMarkOneAsRead(notification.id, notification.isAnnouncement, notification.link)}
                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-start space-x-4 cursor-pointer ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                    {renderNotificationIcon(notification.icon)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-dark-blue dark:text-slate-200 whitespace-normal">{notification.title}</p>
                                                {notification.message && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notification.message}</p>}
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.date} • {notification.type}</p>
                                            </div>
                                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" aria-label="Okunmadı"></div>}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Kullanıcı menüsü"
                    >
                        <img className="h-8 w-8 rounded-full object-cover" src={userProfile.avatar} alt="Profil Avatar" />
                        <span className="hidden sm:inline text-sm font-semibold text-dark-blue dark:text-slate-200">{userProfile.name}</span>
                        <ChevronDownIcon className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none z-20">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                <img className="h-12 w-12 rounded-full object-cover" src={userProfile.avatar} alt="Profil Avatar" />
                                <div>
                                    <p className="text-sm font-semibold text-dark-blue dark:text-slate-100 truncate">{userProfile.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                                </div>
                            </div>
                            <div className="py-2">
                                <a href="#/dashboard/profile-security" onClick={(e) => { e.preventDefault(); handleNavigation('/dashboard/profile-security'); }} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary transition-colors w-full text-left">
                                    <UserCircleIcon className="w-5 h-5 mr-3" />
                                    Profil & Güvenlik
                                </a>
                                <div className="border-t border-slate-200 dark:border-slate-700 mx-2 my-1"></div>
                                <button onClick={onLogout} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-500 dark:hover:text-red-500 transition-colors w-full text-left">
                                    <LogoutIcon className="w-5 h-5 mr-3" />
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default DashboardHeader;