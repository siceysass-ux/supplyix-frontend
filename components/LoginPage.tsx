import React, { useState, useEffect } from 'react';

interface LoginPageProps {
    navigate: (path: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // On component mount, check for a remembered email in localStorage
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Admin user check
            if (email === 'admin@gmail.com' && password === '12345678') {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                navigate('/admin');
            } 
            // Regular user check
            else if (email === 'supplyix@supplyix.com' && password === '12345678') {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                navigate('/dashboard');
            } 
            // Invalid credentials
            else {
                setError('Geçersiz e-posta adresi veya şifre.');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto" />
                    </a>
                </div>
                <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-xl">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-dark-blue">Hesabınıza Giriş Yapın</h1>
                        <p className="text-gray-500 mt-1">Hoş geldiniz!</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-dark-blue font-bold mb-2">E-posta Adresi</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-dark-blue font-bold mb-2">Şifre</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" 
                                />
                                <span className="ml-2">Beni Hatırla</span>
                            </label>
                            <a href="#/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} className="text-sm text-primary hover:underline">
                                Şifremi Unuttum?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300 w-full disabled:bg-primary/50 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;