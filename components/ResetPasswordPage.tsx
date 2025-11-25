import React, { useState } from 'react';
import * as api from '../src/services/api';

interface ResetPasswordPageProps {
    navigate: (path: string) => void;
    token: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigate, token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            setIsLoading(false);
            return;
        }

        try {
            await api.resetPassword(token, newPassword);
            setMessage('Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Bir hata oluştu. Linkin süresi dolmuş olabilir.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto" />
                    </a>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-dark-blue dark:text-slate-100">Yeni Şifre Belirle</h1>
                        <p className="text-gray-500 dark:text-slate-400 mt-1">Lütfen yeni şifrenizi girin.</p>
                    </div>

                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-dark-blue dark:text-slate-200 font-bold mb-2">Yeni Şifre</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={isLoading}
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-slate-500 mt-1">En az 8 karakter, 1 büyük, 1 küçük harf ve 1 rakam.</p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-dark-blue dark:text-slate-200 font-bold mb-2">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={isLoading}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300 w-full disabled:bg-primary/50 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ResetPasswordPage;
