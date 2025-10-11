import React, { useState } from 'react';
import { User, UserStatus } from '../types';
import { ArrowLeftIcon } from '../icons';

interface UserDetailPageProps {
    user?: User;
    navigate: (path: string) => void;
    onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
    onUpdateSubscriptionEndDate: (userId: string, newEndDate: string) => void;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ user, navigate, onUpdateUserStatus, onUpdateSubscriptionEndDate }) => {
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [newEndDate, setNewEndDate] = useState(user?.subscriptionEndDate || '');

    if (!user) {
        return (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-dark-blue">Kullanıcı Bulunamadı</h2>
                <button onClick={() => navigate('/admin/users')} className="mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-lg">
                    Kullanıcı Listesine Geri Dön
                </button>
            </div>
        );
    }

    const handleSaveDate = () => {
        onUpdateSubscriptionEndDate(user.id, newEndDate);
        setIsEditingDate(false);
    };

    const handleToggleSuspend = () => {
        const newStatus = user.status === 'Aktif' ? 'Askıya Alındı' : 'Aktif';
        onUpdateUserStatus(user.id, newStatus);
    };

    return (
        <div className="space-y-6">
            <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-dark-blue">
                <ArrowLeftIcon className="w-5 h-5" />
                Tüm Kullanıcılar
            </button>

            {/* Card 1: User Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Kullanıcı Detayları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    <div><p className="text-xs text-slate-500">Ad Soyad</p><p className="font-semibold">{user.name}</p></div>
                    <div><p className="text-xs text-slate-500">E-posta</p><p className="font-semibold">{user.email}</p></div>
                    <div><p className="text-xs text-slate-500">Telefon Numarası</p><p className="font-semibold">{user.phone || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Referans Kodu</p><p className="font-semibold">{user.referans || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">T.C. Kimlik No</p><p className="font-semibold">{user.tcKimlik || '-'}</p></div>
                    <div><p className="text-xs text-slate-500">Vergi Kimlik No</p><p className="font-semibold">{user.vergiKimlik || '-'}</p></div>
                </div>
            </div>

            {/* Card 2: Subscription Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Abonelik Yönetimi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <p className="text-xs text-slate-500">Abonelik Başlangıcı</p>
                        <p className="font-semibold">{new Date(user.subscriptionStartDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                        {isEditingDate ? (
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">Yeni Bitiş Tarihi</label>
                                <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className="w-full bg-slate-100 p-2 rounded-md border border-slate-300 text-sm"/>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-slate-500">Abonelik Bitişi</p>
                                <p className="font-semibold">{new Date(user.subscriptionEndDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        {isEditingDate ? (
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditingDate(false)} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg text-sm">İptal</button>
                                <button onClick={handleSaveDate} className="bg-primary text-white font-bold py-2 px-4 rounded-lg text-sm">Kaydet</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditingDate(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">Bitiş Tarihini Düzenle</button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Card 3: Account Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">Hesap İşlemleri</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-600">Mevcut Durum: <span className="font-bold">{user.status}</span></p>
                        <p className="text-xs text-slate-500 mt-1">Hesabı geçici olarak dondurmak veya aktif etmek için butonu kullanın.</p>
                    </div>
                    <button
                        onClick={handleToggleSuspend}
                        className={`font-bold py-2 px-4 rounded-lg text-sm transition-colors ${user.status === 'Aktif' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                        {user.status === 'Aktif' ? 'Hesabı Askıya Al' : 'Hesabı Aktif Et'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;