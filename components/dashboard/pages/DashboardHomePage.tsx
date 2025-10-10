import React from 'react';
import PageHeader from '../shared/PageHeader';
import { CreditCardIcon, CubeIcon, StarIcon, DocumentTextIcon, AcademicCapIcon } from '../icons/outline';
import StatusBadge from '../shared/StatusBadge';

const DashboardHomePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
    
  const recentOrders = [
    { id: '#S001', product: 'Akıllı Saat', amount: '₺850.00', status: 'Kargoda', date: '10.10.2025' },
    { id: '#S002', product: 'Bluetooth Kulaklık', amount: '₺450.50', status: 'Teslim Edildi', date: '08.10.2025' },
    { id: '#S003', product: 'Yoga Matı', amount: '₺250.00', status: 'Hazırlanıyor', date: '10.10.2025' },
  ];

  const recentRequests = [
    { type: 'Tedarik', subject: 'Özel tasarım t-shirt', status: 'Teklif Verildi', updated: '09.10.2025' },
    { type: 'Ürün', subject: 'Yeni model drone', status: 'Çalışılıyor', updated: '10.10.2025' },
  ];

  return (
    <div>
      <PageHeader
        title="Panel Ana Sayfa"
        subtitle="Supplyix paneline hoş geldiniz, işte genel durumunuz."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Membership Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-dark-blue mb-4">Üyelik Durumu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Plan</p>
                <p className="font-semibold text-primary">Pro</p>
              </div>
              <div>
                <p className="text-gray-500">Başlangıç</p>
                <p className="font-semibold">10.10.2025</p>
              </div>
              <div>
                <p className="text-gray-500">Bitiş</p>
                <p className="font-semibold">10.10.2026</p>
              </div>
              <div>
                <p className="text-gray-500">Kalan Gün</p>
                <p className="font-semibold">365</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm">Planı Yenile/Uzat</button>
              <button onClick={() => handleNavigation('/dashboard/membership')} className="bg-dark-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-dark-blue/80 transition-colors text-sm">Plan Yükselt</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-dark-blue mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => handleNavigation('/dashboard/sourcing-pool')} className="flex flex-col items-center justify-center p-4 bg-neutral rounded-lg hover:bg-gray-200 transition-colors">
                <CubeIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Tedarik Havuzu</span>
              </button>
               <button onClick={() => handleNavigation('/dashboard/favorites')} className="flex flex-col items-center justify-center p-4 bg-neutral rounded-lg hover:bg-gray-200 transition-colors">
                <StarIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Favorileri Gör</span>
              </button>
               <button onClick={() => handleNavigation('/dashboard/requests')} className="flex flex-col items-center justify-center p-4 bg-neutral rounded-lg hover:bg-gray-200 transition-colors">
                <DocumentTextIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Tedarik İste</span>
              </button>
               <button onClick={() => handleNavigation('/dashboard/consulting')} className="flex flex-col items-center justify-center p-4 bg-neutral rounded-lg hover:bg-gray-200 transition-colors">
                <AcademicCapIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue text-center">Danışmanlık Talep Et</span>
              </button>
            </div>
          </div>
          
          {/* Recent Orders & Requests */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-dark-blue mb-4">Son Siparişler</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2 pr-2 font-normal">#</th>
                                <th className="py-2 pr-2 font-normal">Ürün</th>
                                <th className="py-2 pr-2 font-normal">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id} className="border-t border-gray-200">
                                    <td className="py-3 pr-2 font-semibold text-primary">{order.id}</td>
                                    <td className="py-3 pr-2">{order.product}</td>
                                    <td className="py-3 pr-2"><StatusBadge status={order.status as any} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-dark-blue mb-4">Son Talepler</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2 pr-2 font-normal">Tür</th>
                                <th className="py-2 pr-2 font-normal">Konu</th>
                                <th className="py-2 pr-2 font-normal">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map(req => (
                                <tr key={req.subject} className="border-t border-gray-200">
                                    <td className="py-3 pr-2">{req.type}</td>
                                    <td className="py-3 pr-2">{req.subject}</td>
                                    <td className="py-3 pr-2"><StatusBadge status={req.status as any} /></td>
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-dark-blue mb-4">Duyurular & Güncellemeler</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-dark-blue">Yeni Kargo Seçenekleri Eklendi!</h4>
                <p className="text-sm text-gray-600 mt-1">Artık siparişlerinizde daha fazla kargo firması seçeneğiyle gönderim yapabilirsiniz.</p>
                <p className="text-xs text-gray-400 mt-2">08.10.2025</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-dark-blue">Tedarik Havuzuna Yeni Ürünler</h4>
                <p className="text-sm text-gray-600 mt-1">Elektronik ve ev yaşam kategorilerine 50'den fazla yeni trend ürün eklendi.</p>
                 <p className="text-xs text-gray-400 mt-2">05.10.2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
