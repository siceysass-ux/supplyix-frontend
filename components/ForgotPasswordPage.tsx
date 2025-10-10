import React, { useState } from 'react';

interface ForgotPasswordPageProps {
    navigate: (path: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Lütfen e-posta adresinizi girin.');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-neutral flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <img src="/logo.png" alt="Supplyix Logo" className="h-20 w-auto mx-auto" />
                    </a>
                </div>
                <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-xl">
                    {isSubmitted ? (
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-dark-blue mb-2">Bağlantı Gönderildi</h1>
                            <p className="text-gray-600">
                                {email} adresine bir şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.
                            </p>
                             <button
                                onClick={() => navigate('/login')}
                                className="mt-6 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all w-full"
                            >
                                Giriş Sayfasına Dön
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-dark-blue">Şifreni Sıfırla</h1>
                                <p className="text-gray-500 mt-1">E-posta adresinize bir sıfırlama bağlantısı göndereceğiz.</p>
                            </div>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-dark-blue font-bold mb-2">E-posta Adresi</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
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
                            </form>

                            <p className="text-center text-gray-500 mt-6">
                                <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-primary font-bold hover:underline">
                                    Giriş yapmaya geri dön
                                </a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;
