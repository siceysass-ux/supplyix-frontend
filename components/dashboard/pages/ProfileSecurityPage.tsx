import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';
import { ClipboardIcon } from '../icons/outline';
import * as api from '../../../src/services/api';

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

    // Get current user from localStorage
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            setProfileInfo({
                fullName: user.name || '',
                email: user.email || '',
                companyName: user.companyName || '',
            });
            setAvatar(user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&color=fff`);
        }
    }, []);

    // State for avatar
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?u=supplyix');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // State for Profile Information form
    const [profileInfo, setProfileInfo] = useState({
        fullName: '',
        email: '',
        companyName: '',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');

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


    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const localUrl = URL.createObjectURL(file);
            setAvatar(localUrl);

            // Upload to backend
            if (currentUser) {
                try {
                    const uploadResult = await api.uploadImage(file);
                    const avatarUrl = uploadResult.url;

                    // Update avatar in backend
                    const updatedUser = await api.updateAvatar(currentUser.id, avatarUrl);

                    // Update localStorage
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    setCurrentUser(updatedUser);
                    setAvatar(avatarUrl);

                    // Notify header to update
                    window.dispatchEvent(new Event('profileUpdated'));
                } catch (error) {
                    console.error('Avatar upload error:', error);
                    alert('Avatar yüklenirken bir hata oluştu.');
                }
            }
        }
    };

    const removeAvatar = () => {
        setAvatar('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleProfileInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setProfileError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }

        setIsSavingProfile(true);
        setSaveProfileSuccess(false);
        setProfileError('');

        try {
            const updatedUser = await api.updateProfile(currentUser.id, profileInfo);
            // Update localStorage with new user data
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setSaveProfileSuccess(true);
            setTimeout(() => setSaveProfileSuccess(false), 2500);

            // Notify header to update
            window.dispatchEvent(new Event('profileUpdated'));
        } catch (error: any) {
            console.error('Profile update error:', error);
            setProfileError(error.response?.data?.error || 'Profil güncellenirken bir hata oluştu.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (passwordError) setPasswordError('');
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (!currentUser) {
            setPasswordError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            setPasswordError('Lütfen tüm şifre alanlarını doldurun.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError('Yeni şifreler eşleşmiyor.');
            return;
        }
        // Password complexity check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(passwordData.newPassword)) {
            setPasswordError('Yeni şifre en az 8 karakter olmalı ve en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.');
            return;
        }

        setIsSavingPassword(true);
        setSavePasswordSuccess(false);

        try {
            await api.updatePassword(currentUser.id, passwordData.currentPassword, passwordData.newPassword);
            setSavePasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            setTimeout(() => setSavePasswordSuccess(false), 2500);
        } catch (error: any) {
            console.error('Password update error:', error);
            setPasswordError(error.response?.data?.error || 'Şifre güncellenirken bir hata oluştu.');
        } finally {
            setIsSavingPassword(false);
        }
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
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Profil Fotoğrafı</h3>
                    <div className="flex items-center gap-6">
                        <img
                            className="h-24 w-24 rounded-full object-cover"
                            src={avatar || `https://ui-avatars.com/api/?name=${profileInfo.fullName.replace(' ', '+')}&background=random&color=fff`}
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
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Referans Programı</h3>
                    <div className="relative overflow-hidden text-center bg-primary/10 border-2 border-dashed border-primary/50 p-6 rounded-lg">
                        <FlyingFreeText />
                        <p className="relative z-10 text-2xl font-extrabold text-primary mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            - 3 arkadaşını çağır 1 ay bizden! -
                        </p>
                        <div className="relative z-10 flex items-center justify-center gap-2 mt-4">
                            <p className="text-xl md:text-2xl font-bold text-dark-blue tracking-widest bg-slate-200 dark:bg-slate-700 dark:text-slate-200 px-4 py-2 rounded-md">
                                {currentUser?.referralCode || 'LOADING...'}
                            </p>
                            <button
                                onClick={() => copyReferralCode(currentUser?.referralCode || '')}
                                className="bg-slate-600 text-white font-bold p-3 rounded-lg hover:bg-slate-700 transition-colors"
                                title="Kopyala"
                            >
                                <ClipboardIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {copySuccess && <p className="relative z-10 text-green-600 text-sm mt-2 animate-fade-in-fast">Referans kodu kopyalandı!</p>}

                        {/* Referral Stats */}
                        <div className="relative z-10 mt-4 pt-4 border-t border-primary/20">
                            <div className="flex justify-center gap-8 text-sm">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400">Davet Ettiğin Kişi</p>
                                    <p className="text-2xl font-bold text-primary">{currentUser?.referralCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400">Kalan</p>
                                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                        {currentUser?.referralCount ? 3 - (currentUser.referralCount % 3) : 3}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400">Kazandığın Ödül</p>
                                    <p className="text-2xl font-bold text-green-600">{currentUser?.referralRewards || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">İletişim Bilgileri</h3>
                    <form className="mt-6" onSubmit={handleProfileSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Firma Adı</label>
                                <input name="companyName" type="text" value={profileInfo.companyName} onChange={handleProfileInfoChange} className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                            </div>
                            {profileError && (
                                <div className="text-red-500 text-sm -mt-2">{profileError}</div>
                            )}
                            <div className="text-right mt-4">
                                <button type="submit" disabled={isSavingProfile} className={`bg-primary text-white font-bold py-2 px-5 rounded-lg transition-colors ${isSavingProfile ? 'bg-primary/70 cursor-not-allowed' : 'hover:bg-primary-focus'} ${saveProfileSuccess ? '!bg-green-500' : ''}`}>
                                    {isSavingProfile ? 'Kaydediliyor...' : (saveProfileSuccess ? 'Kaydedildi!' : 'Bilgileri Güncelle')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-dark-blue dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Şifre Değiştir</h3>
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handlePasswordSubmit}>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mevcut Şifre</label>
                            <input name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Yeni Şifre</label>
                            <input name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
                            <p className="text-xs text-slate-500 mt-1">En az 8 karakter, 1 büyük, 1 küçük harf ve 1 rakam.</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Yeni Şifre (Tekrar)</label>
                            <input name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-slate-100 dark:bg-slate-700 mt-1 p-2 rounded-md border border-slate-200 focus:ring-primary focus:border-primary" />
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
