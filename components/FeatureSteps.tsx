import React from 'react';

// Data for the feature steps
const featureStepsData = [
  {
    title: 'Ürünü Seçin',
    description: 'Dropshipping için en çok satan ürünleri tek tıkla seçin. E-ticaret mağazanız için ürün araştırmasını biz yaptık.',
    imgSrc: '/boxes.webp',
  },
  {
    title: 'Mağazanıza Ekleyin',
    description: 'Ürünleri online mağazanıza ekleyin. Stoksuz satış modeliyle sermaye ve stok derdi olmadan dropshipping işinizi kolayca büyütün.',
    imgSrc: '/shop.webp',
  },
  {
    title: 'Sipariş Alın',
    description: 'Satış sonrası tedarik sürecini başlatın, satış yaptıkça sipariş verin.',
    imgSrc: '/shopping.webp',
  },
  {
    title: 'Kargo Sürecini Başlatın',
    description: 'Gönderim süreci şeffaf ilerler, takip numaranızı e-ticaret mağazanıza yükleyin.',
    imgSrc: '/map.webp',
  },
  {
    title: 'Kazancınızı Alın',
    description: 'Gelir doğrudan cebinize girer. İster 1, ister 1000 ürün satın.',
    imgSrc: '/graph.webp',
  },
];

const FeatureSteps: React.FC = () => {
  return (
    <section className="bg-white dark:bg-dark-blue/20 py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-dark-blue dark:text-white">
            Supplyix İle Dropshipping Çok Daha Kolay
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400">
            Save time and money with the best dropshipping automation software
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featureStepsData.map((step, index) => (
            <div
              key={index}
              className="flex flex-col text-center p-6 bg-neutral/60 dark:bg-neutral-900/90 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-primary"
              aria-label={`${index + 1}. ${step.title}`}
            >
                {/* Icon Container */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-neutral-800 mb-6 shadow-inner">
                    <img
                        src={step.imgSrc}
                        alt={`${step.title} ikonu`}
                        className="h-8 w-8 object-contain"
                    />
                </div>
                
                {/* Text Content */}
                <h3 className="text-lg font-bold text-dark-blue dark:text-white uppercase tracking-wider">
                    {`${index + 1}. ${step.title}`}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
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
