import React, { useState, useEffect } from 'react';
import * as api from '../src/services/api';

interface EmailVerificationPageProps {
    navigate: (path: string) => void;
    token: string;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ navigate, token }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Doğrulama token\'ı bulunamadı.');
                return;
            }

            try {
                await api.verifyEmail(token);
                setStatus('success');
                setMessage('Email adresiniz başarıyla doğrulandı!');

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Doğrulama başarısız oldu. Link süresi dolmuş olabilir.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto" />
                    </a>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl">
                    <div className="text-center">
                        {status === 'loading' && (
                            <>
                                <div className="mb-6">
                                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                                </div>
                                <h1 className="text-2xl font-bold text-dark-blue dark:text-slate-100 mb-2">
                                    Email Doğrulanıyor...
                                </h1>
                                <p className="text-gray-500 dark:text-slate-400">
                                    Lütfen bekleyin
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    ✅ Doğrulama Başarılı!
                                </h1>
                                <p className="text-gray-600 dark:text-slate-300 mb-4">
                                    {message}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    Dashboard'a yönlendiriliyorsunuz...
                                </p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900">
                                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                                    ⚠️ Doğrulama Başarısız
                                </h1>
                                <p className="text-gray-600 dark:text-slate-300 mb-6">
                                    {message}
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/giris')}
                                        className="w-full bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300"
                                    >
                                        Giriş Sayfasına Dön
                                    </button>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">
                                        Giriş yaptıktan sonra yeni bir doğrulama emaili talep edebilirsiniz.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EmailVerificationPage;
