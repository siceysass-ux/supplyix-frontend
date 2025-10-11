import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import { ClipboardIcon } from '../icons/outline';

const FlyingFreeText: React.FC = () => {
    // More particles for a richer, non-overlapping effect
    const texts = [
        { left: '15%', duration: '8s', delay: '0s' },
        { left: '30%', duration: '10s', delay: '2s' },
        { left: '5%', duration: '12s', delay: '5s' },
        { left: '45%', duration: '9s', delay: '1s' },
        { left: '60%', duration: '11s', delay: '4s' },
        { left: '85%', duration: '7s', delay: '6s' },
        { left: '70%', duration: '13s', delay: '3s' },
        { left: '95%', duration: '9s', delay: '7s' },
        { left: '22%', duration: '11s', delay: '8s' },
        { left: '78%', duration: '10s', delay: '9s' },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {texts.map((text, i) => (
                <span
                    key={i}
                    className="absolute text-3xl font-black text-primary/20 dark:text-primary/30 animate-free-float"
                    style={{
                        left: text.left,
                        top: '100%',
                        animationDuration: text.duration,
                        animationDelay: text.delay,
                    }}
                >
                    FREE
                </span>
            ))}
        </div>
    );
};


const ProfileSecurityPage: React.FC = () => {
    
    // State for avatar
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?u=supplyix');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // State for Profile Information form
    const [profileInfo, setProfileInfo] = useState({
        fullName: 'Ahmet Yılmaz',
        email: 'ahmet@sirket.com',
        companyName: 'Ahmet A.Ş.',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

    // State for Change Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [savePasswordSuccess, setSavePasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    // State for Referral Code
    const [copySuccess, setCopySuccess] = useState(false);


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(URL.createObjectURL(file));
        }
    };

    const removeAvatar = () => {
        setAvatar('');
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleProfileInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setSaveProfileSuccess(false);
        // Simulate API call
        setTimeout(() => {
            setIsSavingProfile(false);
            setSaveProfileSuccess(true);
            setTimeout(() => setSaveProfileSuccess(false), 2500);
        }, 1500);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (passwordError) setPasswordError('');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            setPasswordError('Lütfen tüm şifre alanlarını doldurun.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError('Yeni şifreler eşleşmiyor.');
            return;
        }
        
        setIsSavingPassword(true);
        setSavePasswordSuccess(false);
        // Simulate API call
        setTimeout(() => {
            setIsSavingPassword(false);
            setSavePasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            setTimeout(() => setSavePasswordSuccess(false), 2500);
        }, 1500);
    };
    
    const copyReferralCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    return (
        <div>
             <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.3s ease-out;
                }
                @keyframes free-float {
                    0% {
                        transform: translateY(0) rotate(-15deg);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.7;
                    }
                    80% {
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(-160px) rotate(10deg);
                        opacity: 0;
                    }
                }
                .animate-free-float {
                    animation-name: free-float;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
            <PageHeader
                title="Profil & Güvenlik"
                subtitle="Kişisel bilgilerinizi ve hesap güvenliğinizi yönetin."
            />
            
            <div className="space-y-8">
                 {/* Profile Picture */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-3 mb-4">Profil Fotoğrafı</h3>
                    <div className="flex items-center gap-6">
                        <img 
                            className="h-24 w-24 rounded-full object-cover" 
                            src={avatar || `https://ui-avatars.com/api/?name=${profileInfo.fullName.replace(' ','+')}&background=random&color=fff`}
                            alt="Profil Avatar" 
                        />
                        <div className="flex items-center gap-3">
                            <label htmlFor="avatar-upload" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm cursor-pointer">
                                Değiştir
                            </label>
                            <input id="avatar-upload" ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            <button onClick={removeAvatar} type="button" className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300 text-sm">
                                Kaldır
                            </button>
                        </div>
                    </div>
                </div>

                {/* Referral Program */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-3 mb-4">Referans Programı</h3>
                    <div className="relative overflow-hidden text-center bg-primary/10 border-2 border-dashed border-primary/50 p-6 rounded-lg">
                        <FlyingFreeText />
                        <p className="relative z-10 text-2xl font-extrabold text-primary mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            - 3 arkadaşını çağır 1 ay bizden! -
                        </p>
                        <div className="relative z-10 flex items-center justify-center gap-2 mt-4">
                            <p className="text-xl md:text-2xl font-bold text-dark-blue tracking-widest bg-slate-200 dark:bg-slate-700 dark:text-slate-200 px-4 py-2 rounded-md">SUPPLYIX-AHMET</p>
                            <button 
                                onClick={() => copyReferralCode('SUPPLYIX-AHMET')} 
                                className="bg-slate-600 text-white font-bold p-3 rounded-lg hover:bg-slate-700 transition-colors"
                                title="Kopyala"
                            >
                                <ClipboardIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {copySuccess && <p className="relative z-10 text-green-600 text-sm mt-2 animate-fade-in-fast">Referans kodu kopyalandı!</p>}
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-3 mb-4">İletişim Bilgileri</h3>
                    <form className="mt-6" onSubmit={handleProfileSubmit}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Ad Soyad</label>
                                <input name="fullName" type="text" value={profileInfo.fullName} onChange={handleProfileInfoChange} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                            </div>
                             <div>
                                <label className="text-sm font-medium text-slate-700">Firma Adı</label>
                                <input name="companyName" type="text" value={profileInfo.companyName} onChange={handleProfileInfoChange} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">E-posta Adresi</label>
                                <input name="email" type="email" value={profileInfo.email} onChange={handleProfileInfoChange} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="md:col-span-2 text-right mt-4">
                                <button type="submit" disabled={isSavingProfile} className={`bg-primary text-white font-bold py-2 px-5 rounded-lg transition-colors ${isSavingProfile ? 'bg-primary/70 cursor-not-allowed' : 'hover:bg-primary-focus'} ${saveProfileSuccess ? '!bg-green-500' : ''}`}>
                                    {isSavingProfile ? 'Kaydediliyor...' : (saveProfileSuccess ? 'Kaydedildi!' : 'Bilgileri Güncelle')}
                                </button>
                            </div>
                         </div>
                    </form>
                </div>

                {/* Change Password */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-3 mb-4">Şifre Değiştir</h3>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handlePasswordSubmit}>
                         <div>
                            <label className="text-sm font-medium text-slate-700">Mevcut Şifre</label>
                            <input name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Yeni Şifre</label>
                            <input name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700">Yeni Şifre (Tekrar)</label>
                            <input name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                        {passwordError && (
                            <div className="md:col-span-3 text-red-500 text-sm -mt-2">{passwordError}</div>
                        )}
                         <div className="md:col-span-3 text-right">
                            <button type="submit" disabled={isSavingPassword} className={`bg-primary text-white font-bold py-2 px-5 rounded-lg transition-colors ${isSavingPassword ? 'bg-primary/70 cursor-not-allowed' : 'hover:bg-primary-focus'} ${savePasswordSuccess ? '!bg-green-500' : ''}`}>
                                {isSavingPassword ? 'Değiştiriliyor...' : (savePasswordSuccess ? 'Değiştirildi!' : 'Şifreyi Değiştir')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityPage;