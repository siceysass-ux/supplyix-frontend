import React from 'react';

// Data for the feature steps with shorter descriptions for mobile
const featureStepsData = [
  {
    title: 'Ürünü Seçin',
    description: 'En çok satan ürünleri tek tıkla seçin, ürün araştırmasını bize bırakın.',
    imgSrc: '/boxes.webp',
  },
  {
    title: 'Mağazanıza Ekleyin',
    description: 'Stok derdi olmadan ürünleri mağazanıza ekleyerek işinizi kolayca büyütün.',
    imgSrc: '/shop.webp',
  },
  {
    title: 'Sipariş Alın',
    description: 'Satış yaptıkça sipariş verin, tedarik sürecini biz yönetelim.',
    imgSrc: '/shopping.webp',
  },
  {
    title: 'Kargo Sürecini Başlatın',
    description: 'Şeffaf gönderim süreciyle kargo takibini kolayca yapın.',
    imgSrc: '/map.webp',
  },
  {
    title: 'Kazancınızı Alın',
    description: 'Geliriniz doğrudan cebinize girer. Satış adedi fark etmeksizin kazanın.',
    imgSrc: '/graph.webp',
  },
];

const FeatureSteps: React.FC = () => {
  return (
    <section className="bg-white dark:bg-dark-blue/20 py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary dark:text-primary">
            Sisteminiz nasıl çalışır?
          </h2>
          <p className="mt-4 text-lg text-dark-blue dark:text-neutral-300">
            Supplyix İle Dropshipping Çok Daha Kolay
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featureStepsData.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col text-center p-4 md:p-6 bg-neutral/60 dark:bg-neutral-900/90 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-primary ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}
              aria-label={`${index + 1}. ${step.title}`}
            >
                {/* Icon Container */}
                <div className="mx-auto flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-white dark:bg-neutral-800 mb-4 md:mb-6 shadow-inner">
                    <img
                        src={step.imgSrc}
                        alt={`${step.title} ikonu`}
                        className="h-10 w-10 md:h-14 md:h-14 object-contain"
                    />
                </div>
                
                {/* Text Content */}
                <h3 className="text-base md:text-lg font-bold text-dark-blue dark:text-white uppercase tracking-wider">
                    {`${index + 1}. ${step.title}`}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-neutral-400">
                    {step.description}
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSteps;