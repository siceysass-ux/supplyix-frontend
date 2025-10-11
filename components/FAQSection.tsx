import React, { useState } from 'react';

const faqData = [
  {
    question: 'Neden Supplyix’i kullanmalıyım?',
    answer: `Çünkü zaman kaybetmeye, karmaşık panellerle uğraşmaya veya ürün aramakla boğuşmaya gerek yok.\nSupplyix ile:\n- En çok satan ürünleri tek tıkla keşfedersin.\n- Tedarikçiyi biz buluruz.\n- Danışmanlığı biz veririz.\nSen sadece satışına odaklanırsın.`,
  },
  {
    question: 'Supplyix ile dropshipping’e nasıl başlayabilirim?',
    answer: 'İlk adımı atman için yalnızca 1$ yeterli! 7 günlük deneme süremizle platformu tam kapasiteyle keşfedebilirsin. Hiçbir risk almadan ürünleri inceleyebilir, danışmanlık talebinde bulunabilirsin.',
  },
  {
    question: 'Bir mağazam yoksa yine de kullanabilir miyim?',
    answer: 'Kesinlikle. Supplyix, hem sıfırdan başlayanlar hem de deneyimli satıcılar için tasarlandı.\n1. Henüz mağaza açmadıysan seni yönlendiriyoruz.\n2. Aktif satış yapıyorsan ürün havuzumuzla işini büyütüyorsun.',
  },
  {
    question: 'Yeni başlıyorsam Supplyix bana uygun mu?',
    answer: 'Tam sana göre!\n1. Ne satacağını biliyorsun ancak uygun tedarikçi mi bulamıyorsun?\n2. Ne satacağını bilmiyor, trend ürünleri keşfetmek mi istiyorsun?\nOnlarca kategori arasından trend ürünleri keşfedip mağazanda satışa başlayabilirsin. Kafandaki ürünü bizde bulamadıysan dert etme; senin için tedarikçiyi buluyoruz.',
  },
  {
    question: 'Supplyix’te istediğim ürünü bulamıyorum.',
    answer: 'Ürün Talep Et özelliğimizle aradığınız ürünü bize iletin. Sizin için o ürünü en uygun fiyata satan tedarikçiyi bulalım ve ürünü sizin için havuzumuza ekleyelim.',
  },
  {
    question: 'Kendi ürün stoğum olması gerekiyor mu?',
    answer: 'Hayır. Sizler için Çin’den milyonlarca ürünün stokunu biz tutmaktayız.',
  },
  {
    question: 'Gönderi kaç gün içinde müşteriye ulaşır?',
    answer: 'Siparişinizi aldığımız vakit ürünü tedarikçinizden alıp müşterinize gönderim için hazırlar, depomuzdan çıkış yaptıktan sonra sistemde belirtilen gün aralığında kargonuz müşterinize ulaşır.',
  },
  {
    question: 'Hangi pazaryerlerinde satış yapabilirim?',
    answer: 'Supplyix tedarik havuzu ile istediğiniz pazaryerinde satış yapabilirsiniz.',
  },
  {
    question: 'Mağazam için danışmana ihtiyacım var mı?',
    answer: 'Danışmanlık İste veya Destek butonlarımızdan dilediğiniz konu hakkında profesyonel ekibimizden yardım alabilirsiniz.',
  },
  {
    question: 'Supplyix ile çalışmanın avantajları nelerdir?',
    answer: 'Sizler için Çin’deki milyonlarca ürünü tedarik havuzumuzda uygun fiyat ve uygun kargo politikasıyla rakipsiz olarak listeliyoruz.',
  },
];

const AccordionItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="bg-primary rounded-xl shadow-lg shadow-primary/20">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none h-28"
                aria-expanded={isOpen}
            >
                <span className="flex-1 text-center text-base font-semibold text-white uppercase tracking-wider">{faq.question}</span>
                <span className={`text-dark-blue ml-4 flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'transform rotate-45' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                 <div className="px-6 pb-6 text-white/90 border-t border-white/30 pt-4" style={{ whiteSpace: 'pre-line' }}>
                    {faq.answer}
                 </div>
            </div>
        </div>
    );
};

const FAQSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    
    // Split data into two columns for a stable layout
    const half = Math.ceil(faqData.length / 2);
    const leftColumnFaqs = faqData.slice(0, half);
    const rightColumnFaqs = faqData.slice(half);

    return (
        <section id="faq" className="py-16 md:py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Sıkça Sorulan Sorular (S.S.S.)
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {leftColumnFaqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                faq={faq}
                                isOpen={activeIndex === index}
                                onClick={() => toggleFAQ(index)}
                            />
                        ))}
                    </div>
                     {/* Right Column */}
                    <div className="space-y-6 mt-6 md:mt-0">
                        {rightColumnFaqs.map((faq, index) => {
                            const originalIndex = index + half;
                            return (
                                <AccordionItem
                                    key={originalIndex}
                                    faq={faq}
                                    isOpen={activeIndex === originalIndex}
                                    onClick={() => toggleFAQ(originalIndex)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;