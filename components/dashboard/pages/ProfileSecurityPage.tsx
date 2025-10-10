import React from 'react';
import PageHeader from '../shared/PageHeader';

const ProfileSecurityPage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Profil & Güvenlik"
                subtitle="Kişisel bilgilerinizi, firma detaylarınızı ve hesap güvenliğinizi yönetin."
            />
            
            <div className="space-y-8">
                {/* Profile Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-gray-200 pb-3 mb-4">Firma ve İletişim Bilgileri</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                            <input type="text" defaultValue="Ahmet Yılmaz" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700">E-posta Adresi</label>
                            <input type="email" defaultValue="ahmet@sirket.com" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700">Firma Adı</label>
                            <input type="text" defaultValue="Yılmaz E-Ticaret" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus transition-colors">Bilgileri Güncelle</button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-gray-200 pb-3 mb-4">Şifre Değiştir</h3>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="text-sm font-medium text-gray-700">Mevcut Şifre</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Yeni Şifre</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-neutral mt-1 p-2 rounded-md border border-gray-300" />
                        </div>
                         <div className="md:col-span-3 text-right">
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus transition-colors">Şifreyi Değiştir</button>
                        </div>
                    </form>
                </div>
                
                {/* Security Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-gray-200 pb-3 mb-4">Güvenlik Ayarları</h3>
                    <div className="space-y-4 divide-y divide-gray-200">
                        <div className="pt-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-dark-blue">İki Adımlı Doğrulama (2FA)</h4>
                                <p className="text-sm text-gray-500">Hesabınıza ek bir güvenlik katmanı ekleyin.</p>
                            </div>
                            <button className="bg-dark-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-dark-blue/90 transition-colors">Etkinleştir</button>
                        </div>
                         <div className="pt-4">
                            <h4 className="font-medium text-dark-blue">Aktif Oturumlar</h4>
                            <p className="text-sm text-gray-500 mb-2">Hesabınıza giriş yapılmış cihazların listesi.</p>
                            <div className="text-sm text-gray-700 p-3 bg-neutral rounded-md">
                                <p>Chrome - Windows 10 (Mevcut Oturum)</p>
                            </div>
                            <button className="mt-2 text-sm text-red-600 hover:underline">Tüm diğer oturumları sonlandır</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityPage;
