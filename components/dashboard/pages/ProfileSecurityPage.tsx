import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import { CameraIcon } from '../icons/outline';

const ProfileSecurityPage: React.FC = () => {
    const [avatarPreview, setAvatarPreview] = useState('https://i.pravatar.cc/150?u=supplyix');

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarPreview(URL.createObjectURL(file));
            // In a real application, you would also upload the file to a server here.
        }
    };

    return (
        <div>
            <PageHeader
                title="Profil & Güvenlik"
                subtitle="Kişisel bilgilerinizi, firma detaylarınızı ve hesap güvenliğinizi yönetin."
            />
            
            <div className="space-y-8">
                {/* Profile Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-3 mb-4">Firma ve İletişim Bilgileri</h3>
                    <div className="flex flex-col md:flex-row items-start gap-8 mt-6">
                        {/* Avatar Uploader */}
                        <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center">
                            <div className="relative group w-32 h-32">
                                <img 
                                    src={avatarPreview} 
                                    alt="Profil Avatarı" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <label 
                                    htmlFor="avatar-upload"
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <CameraIcon className="w-8 h-8" />
                                </label>
                                <input 
                                    id="avatar-upload" 
                                    type="file" 
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={handleAvatarChange} 
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Avatarınızı Değiştirin</p>
                        </div>

                        {/* Profile Form */}
                        <form className="flex-grow w-full">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Ad Soyad</label>
                                    <input type="text" defaultValue="Ahmet Yılmaz" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">E-posta Adresi</label>
                                    <input type="email" defaultValue="ahmet@sirket.com" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Firma Adı</label>
                                    <input type="text" defaultValue="Yılmaz E-Ticaret" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="md:col-span-2 text-right mt-4">
                                    <button type="submit" className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus transition-colors">Bilgileri Güncelle</button>
                                </div>
                             </div>
                        </form>
                    </div>
                </div>

                {/* Change Password */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-3 mb-4">Şifre Değiştir</h3>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="text-sm font-medium text-slate-700">Mevcut Şifre</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Yeni Şifre</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Yeni Şifre (Tekrar)</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                         <div className="md:col-span-3 text-right">
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus transition-colors">Şifreyi Değiştir</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityPage;