import React from 'react';
import { FeatureCard, Feature } from './FeatureCard';

const features: Feature[] = [
  {
    iconName: 'zap',
    title: 'Yüksek Hızda Performans',
    description: 'Optimize edilmiş altyapı ve hafif kod yapısı, uygulamalarınızın en yüksek hızda çalışmasını sağlar.',
  },
  {
    iconName: 'shield',
    title: 'Kurumsal Düzeyde Güvenlik',
    description: 'Verilerinizi çok katmanlı güvenlik, uçtan uca şifreleme ve düzenli denetimlerle koruyun.',
  },
  {
    iconName: 'cloud',
    title: 'Sorunsuz Ölçeklenebilirlik',
    description: 'Kaynaklarınızı talebe göre kesintisiz bir şekilde zahmetsizce artırın veya azaltın.',
  },
  {
    iconName: 'code',
    title: 'Geliştirici Dostu API',
    description: 'Özel çözümler ve iş akışları oluşturmak için güçlü ve iyi belgelenmiş API\'mizle entegre olun.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-neutral">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">Neden Supplyix'i Seçmelisiniz?</h2>
        <p className="text-lg text-dark-blue/80 mb-12 max-w-2xl mx-auto">
          Karmaşıklık olmadan, yenilik yapmanız ve büyümeniz için gereken araçları sağlıyoruz.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;