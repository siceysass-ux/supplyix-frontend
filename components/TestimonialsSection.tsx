import React from 'react';

interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        name: 'Ahmet Yılmaz',
        role: 'E-ticaret Girişimci',
        content: 'Supplyix sayesinde stok tutmadan online satış yapmaya başladım. İlk ayımda 50+ sipariş aldım ve işimi büyütmeye devam ediyorum!',
        rating: 5,
    },
    {
        name: 'Zeynep Kaya',
        role: 'Etsy Satıcısı',
        content: 'Ürün tedariki çok kolay! Binlerce farklı ürüne kolayca erişebiliyorum. Müşteri desteği de her zaman yardımcı oluyor.',
        rating: 5,
    },
    {
        name: 'Mehmet Demir',
        role: 'Shopify Satıcısı',
        content: 'Dropshipping ile başladım, şimdi aylık 100+ sipariş alıyorum. Kargo takibi ve ürün kalitesi mükemmel. Kesinlikle tavsiye ederim!',
        rating: 5,
    },
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-blue dark:text-white mb-4">
                        Müşterilerimiz Ne Diyor?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Binlerce girişimci Supplyix ile dropshipping işine başladı ve başarılı oldu
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-gray-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Star Rating */}
                            <div className="flex items-center mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Testimonial Content */}
                            <p className="text-gray-700 dark:text-slate-300 mb-6 italic">
                                "{testimonial.content}"
                            </p>

                            {/* Customer Info */}
                            <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                                <p className="font-bold text-dark-blue dark:text-white">
                                    {testimonial.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
