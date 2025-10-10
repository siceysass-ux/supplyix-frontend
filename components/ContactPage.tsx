import React, { useState } from 'react';

interface ContactPageProps {
    navigate: (path: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // New: Client-side validation
        if (!name.trim() || !email.trim() || !message.trim()) {
            setError('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        if (isSubmitting || isSubmitted) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('https://formspree.io/f/mrbyyejr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                const data = await response.json();
                if (data.errors) {
                    setError(data.errors.map((err: { message: string }) => err.message).join(', '));
                } else {
                    setError('Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.');
                }
            }
        } catch (err) {
            setError('Mesaj gönderilemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-neutral flex items-center justify-center py-12 md:py-20 px-4">
             <div className="relative w-full max-w-lg animate-fade-in-up mt-8">
                <button
                    onClick={(e) => { e.preventDefault(); navigate('/'); }}
                    className="absolute top-0 -translate-y-1/2 -left-20 z-10 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral focus:ring-primary"
                    aria-label="Ana Sayfaya Geri Dön"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-xl shadow-gray-500/10">
                    {isSubmitted ? (
                        <div className="text-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-dark-blue mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Mesajınız Gönderildi!</h2>
                            <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                Başarıyla e-postanız iletildi. En kısa sürede yanıtlanacaktır.
                            </p>
                            <p className="text-sm text-gray-500 mt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                Ana sayfaya yönlendiriliyorsunuz...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-left mb-8">
                                <h2 className="text-3xl font-bold text-dark-blue">İletişime Geçin</h2>
                                <p className="text-gray-500 mt-1">Sorularınız için buradayız!</p>
                            </div>
                             {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                                    <strong className="font-bold">Hata! </strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-dark-blue font-bold mb-2">Ad Soyad</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-dark-blue font-bold mb-2">E-posta Adresi</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-dark-blue font-bold mb-2">Mesajınız</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300 w-full disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <img src="/logo.png" alt="Supplyix Logo" className="h-6 w-auto mr-3 animate-pulse" />
                                                Gönderiliyor...
                                            </>
                                        ) : 'Gönder'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
             </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                @keyframes scale-in {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </main>
    );
};

export default ContactPage;