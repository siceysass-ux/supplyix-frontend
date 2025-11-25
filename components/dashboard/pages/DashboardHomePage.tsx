

import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';
import { CubeIcon, StarIcon, DocumentTextIcon } from '../icons/outline';
import StatusBadge from '../shared/StatusBadge';
import { Order, Request, Announcement } from '../types';
import ReferralRewardPopup from '../../shared/ReferralRewardPopup';
import * as api from '../../../src/services/api';

interface DashboardHomePageProps {
  navigate: (path: string) => void;
  orders: Order[];
  requests: Request[];
  announcements: Announcement[];
  subscription: {
    planName: string;
    startDate: string;
    endDate: string;
  };
}

const announcementColors = {
  primary: 'border-primary',
  blue: 'border-blue-500',
  green: 'border-green-500',
};

const DashboardHomePage: React.FC<DashboardHomePageProps> = ({ navigate, orders, requests, announcements, subscription }) => {

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const recentOrders = orders.slice(0, 3);
  const recentRequests = requests.slice(0, 3);

  // Calculate remaining days
  const today = new Date();
  const endDate = new Date(subscription.endDate);
  const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Referral reward popup state
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  // Check for unseen rewards on mount
  useEffect(() => {
    const checkRewards = async () => {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        try {
          const rewards = await api.getUnseenRewards(user.id);
          if (rewards.length > 0) {
            setShowRewardPopup(true);
            // Mark as seen
            await api.markRewardsSeen(user.id);
          }
        } catch (error) {
          console.error('Error checking rewards:', error);
        }
      }
    };
    checkRewards();
  }, []);

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Satıcı Paneli Ana Sayfa"
        subtitle="Supplyix paneline hoş geldiniz, işte genel durumunuz."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Membership Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 mb-4">Üyelik Durumu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Plan</p>
                <p className="font-semibold text-primary">{subscription.planName}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Başlangıç</p>
                <p className="font-semibold text-dark-blue dark:text-slate-200">{formatDate(subscription.startDate)}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Bitiş</p>
                <p className="font-semibold text-dark-blue dark:text-slate-200">{formatDate(subscription.endDate)}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Kalan Gün</p>
                <p className="font-semibold text-dark-blue dark:text-slate-200">{remainingDays > 0 ? remainingDays : 0}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => handleNavigation('/dashboard/membership')} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm">Planı Yönet</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => handleNavigation('/dashboard/sourcing-pool')} className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                <CubeIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue dark:text-slate-200 text-center">Tedarik Havuzu</span>
              </button>
              <button onClick={() => handleNavigation('/dashboard/favorites')} className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                <StarIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue dark:text-slate-200 text-center">Favorileri Gör</span>
              </button>
              <button onClick={() => handleNavigation('/dashboard/requests')} className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                <DocumentTextIcon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-dark-blue dark:text-slate-200 text-center">Taleplerim</span>
              </button>
            </div>
          </div>

          {/* Recent Orders & Requests */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex justify-between items-center p-6">
                <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100">Son Siparişler</h3>
                <button onClick={() => navigate('/dashboard/orders')} className="text-sm font-semibold text-primary hover:underline">
                  Tümünü Gör &rarr;
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                  <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">Sipariş #</th>
                      <th scope="col" className="px-6 py-3">Ürün</th>
                      <th scope="col" className="px-6 py-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="bg-white dark:bg-slate-800 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
                        <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{order.id}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{order.products[0].name}</td>
                        <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex justify-between items-center p-6">
                <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100">Son Talepler</h3>
                <button onClick={() => navigate('/dashboard/requests')} className="text-sm font-semibold text-primary hover:underline">
                  Tümünü Gör &rarr;
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                  <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">Tür</th>
                      <th scope="col" className="px-6 py-3">Konu</th>
                      <th scope="col" className="px-6 py-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map(req => (
                      <tr key={req.id} className="bg-white dark:bg-slate-800 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{req.type}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{req.type === 'Tedarik' ? req.productName : req.title}</td>
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
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 mb-4">Duyurular & Güncellemeler</h3>
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className={`border-l-4 ${announcementColors[announcement.type] || 'border-primary'} pl-4`}>
                  <h4 className="font-semibold text-dark-blue dark:text-slate-100">{announcement.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{announcement.content}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{announcement.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Reward Popup */}
      <ReferralRewardPopup
        isOpen={showRewardPopup}
        onClose={() => setShowRewardPopup(false)}
      />
    </div>
  );
};

export default DashboardHomePage;