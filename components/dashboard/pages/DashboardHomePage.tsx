


import React from 'react';
import PageHeader from '../shared/PageHeader';
import { CubeIcon, StarIcon, DocumentTextIcon } from '../icons/outline';
import StatusBadge from '../shared/StatusBadge';
import { Order, Request } from '../types';

interface DashboardHomePageProps {
  navigate: (path: string) => void;
  orders: Order[];
  requests: Request[];
}

const DashboardHomePage: React.FC<DashboardHomePageProps> = ({ navigate, orders, requests }) => {
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
    
  const recentOrders = orders.slice(0, 3);
  const recentRequests = requests.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel Ana Sayfa"
        subtitle="Supplyix paneline hoş geldiniz, işte genel durumunuz."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Membership Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-dark-blue mb-4">Üyelik Durumu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Plan</p>
                <p className="font-semibold text-primary">1 Ay</p>
              </div>
              <div>
                <p className="text-slate-500">Başlangıç</p>
                <p className="font-semibold">10.10.2025</p>
              </div>
              <div>
                <p className="text-slate-500">Bitiş</p>
                <p className="font-semibold">10.11.2025</p>
              </div>
              <div>
                <p className="text-slate-500">Kalan Gün</p>
                <p className="font-semibold">30</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => handleNavigation('/dashboard/membership')} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm">Planı Yönet</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-dark-blue mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => handleNavigation('/dashboard/sourcing-pool')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                <CubeIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Tedarik Havuzu</span>
              </button>
               <button onClick={() => handleNavigation('/dashboard/favorites')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                <StarIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Favorileri Gör</span>
              </button>
               <button onClick={() => handleNavigation('/dashboard/requests')} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                <DocumentTextIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Taleplerim</span>
              </button>
            </div>
          </div>
          
          {/* Recent Orders & Requests */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <h3 className="text-lg font-semibold text-dark-blue p-6">Son Siparişler</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Sipariş #</th>
                                <th scope="col" className="px-6 py-3">Ürün</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id} className="bg-white border-b last:border-b-0 border-slate-200">
                                    <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4 text-slate-900">{order.products[0].name}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <h3 className="text-lg font-semibold text-dark-blue p-6">Son Talepler</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tür</th>
                                <th scope="col" className="px-6 py-3">Konu</th>
                                <th scope="col" className="px-6 py-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map(req => (
                                <tr key={req.id} className="bg-white border-b last:border-b-0 border-slate-200">
                                    <td className="px-6 py-4 text-slate-900">{req.type}</td>
                                    <td className="px-6 py-4 text-slate-900">{req.title}</td>
                                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-dark-blue mb-4">Duyurular & Güncellemeler</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-dark-blue">Yeni Kargo Seçenekleri Eklendi!</h4>
                <p className="text-sm text-slate-600 mt-1">Artık siparişlerinizde daha fazla kargo firması seçeneğiyle gönderim yapabilirsiniz.</p>
                <p className="text-xs text-slate-400 mt-2">08.10.2025</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-dark-blue">Tedarik Havuzuna Yeni Ürünler</h4>
                <p className="text-sm text-slate-600 mt-1">Elektronik ve ev yaşam kategorilerine 50'den fazla yeni trend ürün eklendi.</p>
                 <p className="text-xs text-slate-400 mt-2">05.10.2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;