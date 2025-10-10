import React, { useState } from 'react';

const ContactSection: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Gönderiliyor...');
        // Simulate form submission
        setTimeout(() => {
            setStatus('Mesaj başarıyla gönderildi!');
            setName('');
            setEmail('');
            setMessage('');
            setTimeout(() => setStatus(''), 3000);
        }, 1000);
    };

    return (
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">İletişime Geçin</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Bir sorunuz mu var veya birlikte çalışmak mı istiyorsunuz? Aşağıdaki formu doldurun.
                    </p>
                </div>
                <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-xl shadow-gray-500/10">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-dark-blue font-bold mb-2">Adınız</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-dark-blue font-bold mb-2">E-posta</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 text-gray-800 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
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
                            ></textarea>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300 w-full"
                            >
                                Mesaj Gönder
                            </button>
                        </div>
                         {status && <p className="text-center text-green-500 mt-4">{status}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;