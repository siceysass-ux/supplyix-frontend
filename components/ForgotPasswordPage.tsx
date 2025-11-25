import React, { useState } from 'react';
import * as api from '../src/services/api';

interface ForgotPasswordPageProps {
    navigate: (path: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await api.forgotPassword(email);
            setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
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
                        <h1 className="text-2xl font-bold text-dark-blue dark:text-slate-100">Şifremi Unuttum</h1>
                        <p className="text-gray-500 dark:text-slate-400 mt-1">E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.</p>
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
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-dark-blue dark:text-slate-200 font-bold mb-2">E-posta Adresi</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300 w-full disabled:bg-primary/50 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                        </button>
                        <div className="mt-4 text-center">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-sm text-slate-500 hover:text-primary">
                                Giriş sayfasına dön
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;