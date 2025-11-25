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
    title: 'Doğru Ürünü Seçin, Dropshipping\'de Başarıya İlk Adımı Atın',
    description: 'E-ticarette ve dropshipping\'de başarı doğru ürünü seçmekle başlar. Supplyix\'in kullanıcı dostu arayüzü sayesinde binlerce ürünü kategori bazlı filtreleyin, en çok satanları tek tıkla mağazanıza ekleyin. Stoksuz satış modeliyle ürün aramak artık vakit kaybı değil, stratejik bir kazanç adımı.',
    imageUrl: '/demo-slides/1.png',
  },
  {
    iconName: 'globe',
    title: 'Stoksuz E-Ticarette Sipariş ve Kargo Sürecini Kolayca Yönetin',
    description: 'Beğendiğin ürünlerin görsellerini sitemizden tek tıkla indirip hemen listelemeye başlayabilirsin. Ürünleri favorilerine ekleyerek takipte kal, ilgilendiğin kategorilerdeki gelişmelerden anında haberdar ol. Online mağazana sipariş geldiğinde ürününü biz göndeririz; kargo süreci ve envanter yönetimi Supplyix ile tamamen şeffaf ilerler.',
    imageUrl: '/demo-slides/2.png',
  },
  {
    iconName: 'code',
    title: 'Tedarik ve Danışmanlık Talepleriniz İçin Supplyix Yanınızda',
    description: 'Sitemizde bulunmayan ürünler için "Tedarik İste" özelliğini kullanarak sizin için uygun fiyatlı tedarikçi arıyoruz ve bulduğumuz ürünleri Supplyix havuzuna ekliyoruz. Ayrıca "Danışmanlık İste" butonuyla e-ticaret sayfanızda karşılaşabileceğiniz tüm pazar yeri sorunları için uzman ekibimizden destek alabilirsiniz. Supplyix, dropshipping sürecinizin her adımında yanınızda.',
    imageUrl: '/demo-slides/3.png',
  },
  {
    iconName: 'settings',
    title: 'Supplyix Destek Merkezi: E-Ticaret Yolculuğunuzda Yanınızdayız',
    description: 'Her şeyin sorunsuz ilerlemesi için sizi yalnız bırakmıyoruz. Geliştirilmiş mesajlaşma altyapımızla, sorularınıza hızlıca yanıt bulabilir, süreci güvenle yönetebilirsiniz. E-Ticaretin her adımda yanınızdayız.',
    imageUrl: '/demo-slides/4.png',
  },
];

const LiveDemoSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="demo" className="py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-4">Supplyix'i Çalışırken Görün</h2>
          <p className="text-base md:text-lg text-dark-blue">
            Platformumuzun sezgisel arayüzünü ve güçlü özelliklerini keşfedin. Kayıt olmanıza gerek yok.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col space-y-3 lg:space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {demoFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`p-4 lg:p-6 rounded-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${activeIndex === index
                  ? 'bg-primary/5 border-primary shadow-lg shadow-primary/20'
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start mb-2">
                  <Icon iconName={feature.iconName} className={`w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 mt-1 flex-shrink-0 ${activeIndex === index ? 'text-primary' : 'text-dark-blue/60'}`} />
                  <h3 className="text-sm lg:text-base font-bold text-dark-blue leading-tight">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xl shadow-gray-500/10 overflow-hidden">
              <div className="flex items-center space-x-1.5 p-3 border-b border-gray-200 bg-gray-50">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="aspect-video bg-slate-50">
                {activeIndex !== null && (
                  <img
                    key={activeIndex}
                    src={demoFeatures[activeIndex].imageUrl}
                    alt={demoFeatures[activeIndex].title}
                    className="w-full h-full object-contain animate-fade-in"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="block lg:hidden space-y-3 md:space-y-4">
          {demoFeatures.map((feature, index) => {
            const isActive = activeIndex === index;
            return (
              <div key={index} className={`rounded-lg border-2 transition-all duration-300 ${isActive ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-4 md:p-6 text-left"
                  aria-expanded={isActive}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center pr-3 md:pr-4">
                      <Icon iconName={feature.iconName} className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 flex-shrink-0 ${isActive ? 'text-primary' : 'text-dark-blue/60'}`} />
                      <h3 className="text-sm md:text-base lg:text-lg font-bold text-dark-blue leading-tight">{feature.title}</h3>
                    </div>
                    <Icon iconName="chevron-down" className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isActive ? 'transform rotate-180' : ''}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[1000px]' : 'max-h-0'}`}>
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 leading-relaxed">{feature.description}</p>
                    <div className="aspect-video bg-slate-50 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={feature.imageUrl}
                        alt={feature.title}
                        className="w-full h-full object-contain"
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
        .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
        }
        .scrollbar-thumb-primary\\/20::-webkit-scrollbar-thumb {
            background-color: rgba(255, 106, 0, 0.2);
            border-radius: 3px;
        }
        .scrollbar-thumb-primary\\/20::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 106, 0, 0.4);
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
            background: transparent;
        }
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default LiveDemoSection;