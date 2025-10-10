import React from 'react';
import { BellIcon, UserCircleIcon, CubeIcon, ShoppingCartIcon, AcademicCapIcon } from './icons/outline';

interface DashboardHeaderProps {
  pageTitle: string;
  navigate: (path: string) => void;
}

const notifications = [
    { type: 'Sipariş', title: '#S003 numaralı siparişiniz hazırlanıyor.', date: '10.10.2025', read: false, icon: ShoppingCartIcon },
    { type: 'Talep', title: '#T001 numaralı talebinize yeni bir teklif verildi.', date: '09.10.2025', read: false, icon: CubeIcon },
    { type: 'Danışmanlık', title: 'Reklam Stratejileri konulu randevunuz onaylandı.', date: '08.10.2025', read: true, icon: AcademicCapIcon },
    { type: 'Sipariş', title: '#S002 numaralı siparişiniz teslim edildi.', date: '08.10.2025', read: true, icon: ShoppingCartIcon },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ pageTitle, navigate }) => {
  const [isNotificationsOpen, setNotificationsOpen] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="flex-shrink-0 bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-dark-blue sm:block">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setNotificationsOpen(!isNotificationsOpen)} 
              className="text-slate-500 hover:text-slate-700 relative p-1 rounded-full hover:bg-slate-100"
              aria-label="Bildirimler"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary top-0.5 right-0.5"></span>
              </span>
            </button>
            {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-md font-semibold text-dark-blue">Bildirimler</h3>
                        <button className="text-xs text-primary font-semibold hover:underline">Tümünü okundu işaretle</button>
                    </div>
                    <ul className="max-h-96 overflow-y-auto divide-y divide-slate-200">
                        {notifications.map((notification, index) => (
                            <li key={index} className={`p-4 hover:bg-slate-50 transition-colors flex items-start space-x-4 ${!notification.read ? 'bg-primary/5' : ''}`}>
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <notification.icon className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-dark-blue whitespace-normal">{notification.title}</p>
                                    <p className="text-xs text-slate-500 mt-1">{notification.date}</p>
                                </div>
                                {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" aria-label="Okunmadı"></div>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <a 
          href="#/dashboard/profile-security" 
          onClick={(e) => handleNavigation(e, '/dashboard/profile-security')}
          className="flex items-center space-x-2 text-slate-600 hover:text-dark-blue"
          aria-label="Profil Sayfası"
        >
          <img className="h-8 w-8 rounded-full object-cover" src="https://i.pravatar.cc/150?u=supplyix" alt="User avatar" />
          <div className="hidden md:block text-left">
              <div className="text-sm font-medium">Ahmet Yılmaz</div>
          </div>
        </a>
      </div>
    </header>
  );
};

export default DashboardHeader;