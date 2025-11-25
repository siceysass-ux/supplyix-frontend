import React from 'react';

// Data for the feature steps with shorter descriptions for mobile
const featureStepsData = [
  {
    title: 'Ürünü Seçin',
    description: 'En çok satan ürünleri tek tıkla seçin, ürün araştırmasını bize bırakın.',
    imgSrc: '/step-icons/1.png',
  },
  {
    title: 'Mağazanıza Ekleyin',
    description: 'Stok derdi olmadan ürünleri mağazanıza ekleyerek işinizi kolayca büyütün.',
    imgSrc: '/step-icons/2.png',
  },
  {
    title: 'Sipariş Alın',
    description: 'Satış yaptıkça sipariş verin, tedarik sürecini biz yönetelim.',
    imgSrc: '/step-icons/3.png',
  },
  {
    title: 'Kargo Sürecini Başlatın',
    description: 'Şeffaf gönderim süreciyle kargo takibini kolayca yapın.',
    imgSrc: '/step-icons/4.png',
  },
  {
    title: 'Kazancınızı Alın',
    description: 'Geliriniz doğrudan cebinize girer. Satış adedi fark etmeksizin kazanın.',
    imgSrc: '/step-icons/5.png',
  },
];

const FeatureSteps: React.FC = () => {
  return (
    <section className="bg-white dark:bg-slate-900 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary dark:text-primary">
            Sisteminiz nasıl çalışır?
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-dark-blue dark:text-neutral-300">
            Supplyix İle Dropshipping Çok Daha Kolay
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {featureStepsData.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-4 md:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-primary min-h-[240px] md:min-h-[280px] ${index === 4 ? 'col-span-2 md:col-span-1 max-w-xs mx-auto md:max-w-none' : ''
                }`}
              aria-label={`${index + 1}. ${step.title}`}
            >
              {/* Icon Container */}
              <div className="flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 mb-3 md:mb-4 shadow-sm">
                <img
                  src={step.imgSrc}
                  alt={`${step.title} ikonu`}
                  className="h-14 w-14 md:h-20 md:w-20 object-contain"
                />
              </div>

              {/* Text Content */}
              <h3 className="text-sm md:text-lg font-bold text-dark-blue dark:text-white mb-2 md:mb-3 leading-tight">
                <span className="text-primary text-base md:text-xl">{index + 1}.</span> {step.title.toUpperCase()}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
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