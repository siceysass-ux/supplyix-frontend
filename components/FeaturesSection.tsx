import React from 'react';

const featuresData = [
  {
    title: 'Yüksek Hızda Performans',
    description: 'Optimize edilmiş altyapı ve hafif kod yapısı, uygulamalarınızın en yüksek hızda çalışmasını sağlar.',
    imgSrc: '/boxes.webp',
  },
  {
    title: 'Kurumsal Düzeyde Güvenlik',
    description: 'Verilerinizi çok katmanlı güvenlik, uzun şifreleme ve düzenli denetimlerle koruyoruz.',
    imgSrc: '/shop.webp',
  },
  {
    title: 'Sorunsuz Ölçeklenebilirlik',
    description: 'Kaynaklarınızı talebe göre kesintisiz bir şekilde zahmetsizce artırın veya azaltın.',
    imgSrc: '/map.webp',
  },
  {
    title: 'Geliştirici Dostu API',
    description: 'Özel çözümler ve iş akışları oluşturmak için güçlü ve iyi belgelenmiş API’mizle entegre olun.',
    imgSrc: '/graph.webp',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-white dark:bg-dark-blue/20 py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary dark:text-primary">
            Neden Supplyix’i Seçmelisiniz?
          </h2>
          <p className="mt-3 text-dark-blue dark:text-neutral-300">
            Karmaşıklık olmadan, yenilik yapmanız ve büyümeniz için gereken araçları sağlıyoruz.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-6 md:p-8 bg-white/90 dark:bg-neutral-900/90 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              aria-label={feature.title}
            >
              {/* Image Container */}
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-neutral-800 mb-6">
                <img
                  src={feature.imgSrc}
                  alt={`${feature.title} ikonu`}
                  className="h-7 w-7 object-contain"
                />
              </div>
              {/* Text Content */}
              <h3 className="text-lg font-semibold text-dark-blue dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;