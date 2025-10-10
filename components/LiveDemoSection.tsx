import React, { useState } from 'react';
import { Icon, IconName } from './Icon';

interface DemoFeature {
  iconName: IconName;
  title: string;
  description: string;
  imageUrl: string;
}

const demoFeatures: DemoFeature[] = [
  {
    iconName: 'zap',
    title: 'Sezgisel Gösterge Paneli',
    description: 'Projelerinize, görevlerinize ve ekip performansınıza bir bakışta tam bir genel bakış elde edin.',
    imageUrl: 'https://picsum.photos/seed/dashboard/1200/800',
  },
  {
    iconName: 'globe',
    title: 'Gerçek Zamanlı İşbirliği',
    description: 'Paylaşılan düzenleme, yorumlar ve bildirimlerle ekibinizle gerçek zamanlı olarak çalışın.',
    imageUrl: 'https://picsum.photos/seed/collaboration/1200/800',
  },
  {
    iconName: 'code',
    title: 'Gelişmiş Analitik',
    description: 'Ayrıntılı analizlerle ilerlemenizi takip edin ve zahmetsizce anlayışlı raporlar oluşturun.',
    imageUrl: 'https://picsum.photos/seed/analytics/1200/800',
  },
  {
    iconName: 'settings',
    title: 'Güçlü Entegrasyonlar',
    description: 'Sorunsuz ve otomatik bir iş akışı oluşturmak için Supplyix\'i favori araçlarınızla bağlayın.',
    imageUrl: 'https://picsum.photos/seed/integrations/1200/800',
  },
];

const LiveDemoSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="demo" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">Supplyix'i Çalışırken Görün</h2>
          <p className="text-lg text-gray-600">
            Platformumuzun sezgisel arayüzünü ve güçlü özelliklerini keşfedin. Kayıt olmanıza gerek yok.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col space-y-4">
            {demoFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`p-6 rounded-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                  activeIndex === index
                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/20'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon iconName={feature.iconName} className={`w-6 h-6 mr-3 ${activeIndex === index ? 'text-primary' : 'text-dark-blue/60'}`} />
                  <h3 className="text-lg font-bold text-dark-blue">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 relative">
             <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-2xl shadow-gray-500/10">
                <div className="flex items-center space-x-1.5 p-2 border-b border-gray-200">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="aspect-video bg-neutral rounded-b-lg p-4">
                    <img
                        key={activeIndex}
                        src={demoFeatures[activeIndex].imageUrl}
                        alt={demoFeatures[activeIndex].title}
                        className="w-full h-full object-cover rounded-md animate-fade-in"
                    />
                </div>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default LiveDemoSection;