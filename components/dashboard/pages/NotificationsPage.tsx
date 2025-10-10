import React from 'react';
import PageHeader from '../shared/PageHeader';
import { CubeIcon, ShoppingCartIcon, AcademicCapIcon } from '../icons/outline';

const notifications = [
    { type: 'Sipariş', title: '#S003 numaralı siparişiniz hazırlanıyor.', date: '10.10.2025', read: false, icon: ShoppingCartIcon },
    { type: 'Talep', title: '#T001 numaralı talebinize yeni bir teklif verildi.', date: '09.10.2025', read: false, icon: CubeIcon },
    { type: 'Danışmanlık', title: 'Reklam Stratejileri konulu randevunuz onaylandı.', date: '08.10.2025', read: true, icon: AcademicCapIcon },
    { type: 'Sipariş', title: '#S002 numaralı siparişiniz teslim edildi.', date: '08.10.2025', read: true, icon: ShoppingCartIcon },
];

const NotificationsPage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Bildirimler"
                subtitle="Hesabınızla ilgili son güncellemeler ve aktiviteler."
            >
                <button className="bg-dark-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-dark-blue/90 transition-colors text-sm">
                    Tümünü Okundu İşaretle
                </button>
            </PageHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Notifications List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <ul role="list" className="divide-y divide-gray-200">
                        {notifications.map((notification, index) => (
                            <li key={index} className={`p-4 hover:bg-neutral transition-colors flex items-start space-x-4 ${!notification.read ? 'bg-primary/5' : ''}`}>
                                <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                                        <notification.icon className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-dark-blue truncate">{notification.title}</p>
                                    <p className="text-sm text-gray-500">{notification.date}</p>
                                </div>
                                {!notification.read && <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Notification Preferences */}
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-dark-blue mb-4">Bildirim Tercihleri</h3>
                        <form className="space-y-4">
                           <fieldset>
                                <legend className="text-sm font-medium text-gray-900">Panel İçi Bildirimler</legend>
                                <div className="mt-2 space-y-2">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5"><input id="comments" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" defaultChecked /></div>
                                        <div className="ml-3 text-sm"><label htmlFor="comments" className="font-medium text-gray-700">Sipariş Güncellemeleri</label></div>
                                    </div>
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5"><input id="candidates" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" defaultChecked /></div>
                                        <div className="ml-3 text-sm"><label htmlFor="candidates" className="font-medium text-gray-700">Talep Yanıtları</label></div>
                                    </div>
                                </div>
                            </fieldset>
                             <fieldset>
                                <legend className="text-sm font-medium text-gray-900">E-posta Bildirimleri</legend>
                                 <div className="mt-2 space-y-2">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5"><input id="email-offers" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" /></div>
                                        <div className="ml-3 text-sm"><label htmlFor="email-offers" className="font-medium text-gray-700">Haftalık Özetler</label></div>
                                    </div>
                                </div>
                            </fieldset>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors mt-4">
                                Kaydet
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default NotificationsPage;
