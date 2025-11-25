import React from 'react';

type StatusType =
  | 'Beklemede' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal'
  | 'Bekliyor' | 'Tamamlandı'
  | 'Ödendi' | 'Aktif' | 'Sona Eriyor' | 'Süresi Doldu'
  | 'Başarılı' | 'Başarısız'
  | 'Açık' | 'Yanıt Bekleniyor' | 'Çözüldü';

interface StatusBadgeProps {
  status: StatusType;
}

const statusStyles: Record<StatusType, string> = {
  // Order Statuses
  'Beklemede': 'bg-yellow-100 text-yellow-800',
  'Hazırlanıyor': 'bg-blue-100 text-blue-800',
  'Kargoda': 'bg-indigo-100 text-indigo-800',
  'Teslim Edildi': 'bg-green-100 text-green-800',
  'İptal': 'bg-red-100 text-red-800',
  // Request Statuses
  'Bekliyor': 'bg-yellow-100 text-yellow-800',
  'Tamamlandı': 'bg-green-100 text-green-800',
  // Payment Statuses
  'Ödendi': 'bg-green-100 text-green-800',
  // Membership Statuses
  'Aktif': 'bg-green-100 text-green-800',
  'Sona Eriyor': 'bg-yellow-100 text-yellow-800',
  'Süresi Doldu': 'bg-red-100 text-red-800',
  // Result Statuses
  'Başarılı': 'bg-green-100 text-green-800',
  'Başarısız': 'bg-red-100 text-red-800',
  // Ticket Statuses
  'Açık': 'bg-green-100 text-green-800',
  'Yanıt Bekleniyor': 'bg-yellow-100 text-yellow-800',
  'Çözüldü': 'bg-gray-100 text-gray-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeStyle = statusStyles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;