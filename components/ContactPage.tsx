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
    
    // NOTE: This form simulates sending an email. In a real application,
    // you would send this data to a backend server or a third-party service
    // (like Formspree, Netlify Forms) to handle the email sending process to supplyix@supplyix.com.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || isSubmitted) return;

        setIsSubmitting(true);
        
        // Simulate network request
        setTimeout(() => {
            console.log('Form Submitted:', { name, email, message });
            setIsSubmitting(false);
            setIsSubmitted(true);
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }, 1500);
    };

    return (
        <main className="bg-neutral flex items-center justify-center py-12 md:py-20 px-4">
             <div className="w-full max-w-lg">
                <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-xl shadow-gray-500/10">
                    {isSubmitted ? (
                        <div className="text-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-dark-blue mb-2">Mesajınız Gönderildi!</h2>
                            <p className="text-gray-600">
                                Başarıyla e-postanız iletildi. En kısa sürede yanıtlanacaktır.
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                                Ana sayfaya yönlendiriliyorsunuz...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-left mb-8">
                                <h2 className="text-3xl font-bold text-dark-blue">İletişime Geçin</h2>
                                <p className="text-gray-500 mt-1">Sorularınız için buradayız!</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-dark-blue font-bold mb-2">Ad Soyad</label>
                                    <input
                                        type="text"
                                        id="name"
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
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
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
        </main>
    );
};

export default ContactPage;
