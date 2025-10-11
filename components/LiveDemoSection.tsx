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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="demo" className="py-20 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Supplyix'i Çalışırken Görün</h2>
          <p className="text-lg text-dark-blue dark:text-slate-300">
            Platformumuzun sezgisel arayüzünü ve güçlü özelliklerini keşfedin. Kayıt olmanıza gerek yok.
          </p>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col space-y-4">
            {demoFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`p-6 rounded-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                  activeIndex === index
                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon iconName={feature.iconName} className={`w-6 h-6 mr-3 ${activeIndex === index ? 'text-primary' : 'text-dark-blue/60 dark:text-slate-400'}`} />
                  <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 relative">
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2 shadow-2xl shadow-gray-500/10">
                <div className="flex items-center space-x-1.5 p-2 border-b border-gray-200 dark:border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-b-lg p-4">
                    {activeIndex !== null && (
                      <img
                          key={activeIndex}
                          src={demoFeatures[activeIndex].imageUrl}
                          alt={demoFeatures[activeIndex].title}
                          className="w-full h-full object-cover rounded-md animate-fade-in"
                      />
                    )}
                </div>
             </div>
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="block lg:hidden space-y-4">
          {demoFeatures.map((feature, index) => {
            const isActive = activeIndex === index;
            return (
              <div key={index} className={`rounded-lg border-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}>
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left"
                  aria-expanded={isActive}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center pr-4">
                      <Icon iconName={feature.iconName} className={`w-6 h-6 mr-3 flex-shrink-0 ${isActive ? 'text-primary' : 'text-dark-blue/60 dark:text-slate-400'}`} />
                      <h3 className="text-lg font-bold text-dark-blue dark:text-slate-100">{feature.title}</h3>
                    </div>
                    <Icon iconName="chevron-down" className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isActive ? 'transform rotate-180' : ''}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[1000px]' : 'max-h-0'}`}>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">{feature.description}</p>
                    <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg p-2 border border-gray-200 dark:border-slate-600">
                      <img
                          src={feature.imageUrl}
                          alt={feature.title}
                          className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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