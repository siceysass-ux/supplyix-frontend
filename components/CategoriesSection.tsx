import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from './Icon';

interface Category {
  name: string;
  products: { imageUrl: string }[];
}

const categoriesData: Category[] = [
  {
    name: 'Trend ürünler',
    products: [
      { imageUrl: '/category-images/Trend Ürünler/1_23fd9682-a215-48bf-9255-977c28cdb3b5.jpg' },
      { imageUrl: '/category-images/Trend Ürünler/1_cba3c7d6-0c3d-4b5e-8517-6dd0b5a6242e.jpg' },
      { imageUrl: '/category-images/Trend Ürünler/1_O1CN01hI4AFp2AglqKRovmO_!!2211907038233-0-cib.jpg' },
      { imageUrl: '/category-images/Trend Ürünler/2_7120482a-6f11-465e-84f3-c102895bce7f.jpg' },
    ],
  },
  {
    name: 'Kadın giyim',
    products: [
      { imageUrl: '/category-images/Kadın Giyim/1_c1c8e31c-56f1-4f88-89da-7a06cf1320a2.jpg' },
      { imageUrl: '/category-images/Kadın Giyim/1_c769b3ab-06fe-459d-bd58-df2215d3eaca.jpg' },
      { imageUrl: '/category-images/Kadın Giyim/5_86ff75b6-d1bd-4bc0-aacc-86d4d9025d89.jpg' },
      { imageUrl: '/category-images/Kadın Giyim/10_dac52ea5-e2e4-4369-867a-f8e6ae4badb4.jpg' },
    ],
  },
  {
    name: 'Erkek giyim',
    products: [
      { imageUrl: '/category-images/Erkek giyim/1_1ab55d39-a390-4075-84ee-4362f0c56d14.jpg' },
      { imageUrl: '/category-images/Erkek giyim/1_8c633cc4-d52d-4d3c-a11b-715a502a7ab6.jpg' },
      { imageUrl: '/category-images/Erkek giyim/1_O1CN01q21As1215pKJ5dAMf_!!2218609886934-0-cib.jpg' },
      { imageUrl: '/category-images/Erkek giyim/5_13c77468-a503-42f0-8d96-e3c2884ee35c.jpg' },
    ],
  },
  {
    name: 'Elektronik ve aksesuar',
    products: [
      { imageUrl: '/category-images/Elektronik ve Aksesuar/1_1621559698860.jpg' },
      { imageUrl: '/category-images/Elektronik ve Aksesuar/1_b03b0490-9caa-4e3f-9f2a-355bfb189d0f.jpg' },
      { imageUrl: '/category-images/Elektronik ve Aksesuar/3_2301460954712.jpg' },
      { imageUrl: '/category-images/Elektronik ve Aksesuar/4_666353255921.jpg' },
    ],
  },
  {
    name: 'Evcil hayvan aksesuarları',
    products: [
      { imageUrl: '/category-images/Evcil hayvan aksesuarları/1_152800313011.jpg' },
      { imageUrl: '/category-images/Evcil hayvan aksesuarları/1_7b026313-6571-46c4-9351-0199ed00b13b.jpg' },
      { imageUrl: '/category-images/Evcil hayvan aksesuarları/1_d58a59ce-f500-4e4e-a5c8-aba64379ed96.jpg' },
      { imageUrl: '/category-images/Evcil hayvan aksesuarları/2_a5312892-23aa-4389-a5a7-b7831a5c532a.jpg' },
    ],
  },
  {
    name: 'Spor ve outdoor',
    products: [
      { imageUrl: '/category-images/Spor ve Outdoor/1_1319177014747.jpg' },
      { imageUrl: '/category-images/Spor ve Outdoor/2_8efd4456-8576-4109-bed0-65b8aeb435eb.jpg' },
      { imageUrl: '/category-images/Spor ve Outdoor/5_291026545814.jpg' },
      { imageUrl: '/category-images/Spor ve Outdoor/5_bec4dd52-90d8-4e1e-8de2-ccfc4ab24835.jpg' },
    ],
  },
  {
    name: 'Bebek, çocuk ve oyuncak',
    products: [
      { imageUrl: '/category-images/bebek çocuk ve giyim/1_61237357-6545-4692-8956-8d467042e8c7.jpg' },
      { imageUrl: '/category-images/bebek çocuk ve giyim/2_1618382503339.jpg' },
      { imageUrl: '/category-images/bebek çocuk ve giyim/2_48f74113-ea79-468f-ae39-cb58c8591e3a.jpg' },
      { imageUrl: '/category-images/bebek çocuk ve giyim/2_ea09ab0b-8f56-48d1-9691-506be645a169.jpg' },
    ],
  },
  {
    name: 'Ev ve yaşam',
    products: [
      { imageUrl: '/category-images/Ev ve yaşam/1_0bb1958f-d137-41ba-9517-faa7c81054c4.jpg' },
      { imageUrl: '/category-images/Ev ve yaşam/1_40c92733-87b7-4e35-b285-8159ffa899e0.jpg' },
      { imageUrl: '/category-images/Ev ve yaşam/2_1354302241951.jpg' },
      { imageUrl: '/category-images/Ev ve yaşam/3_724e3720-d399-4494-861a-7fcadc432d99.jpg' },
    ],
  },
  {
    name: 'Aksesuar ve saatler',
    products: [
      { imageUrl: '/category-images/Aksesuar Ve Saatler/1_1e1dd9f8-8d9f-44bc-afb3-9c7b66d8492e.jpg' },
      { imageUrl: '/category-images/Aksesuar Ve Saatler/1_431f164e-7dd5-4bc9-b288-b15f94cd0d5f.jpg' },
      { imageUrl: '/category-images/Aksesuar Ve Saatler/1_6e4c1439-21df-4362-ba25-bf4c43a4d5e7.jpg' },
      { imageUrl: '/category-images/Aksesuar Ve Saatler/1_85dacc4f-5b7a-48fd-bfd8-2389df09d5b8.jpg' },
    ],
  },
];

const CategoriesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const handleScrollToPricing = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [checkScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="categories" className="py-12 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="relative">
          {showLeftButton && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-dark-blue rounded-full p-1 shadow-md hover:bg-dark-blue/90 md:hidden"
              aria-label="Geri Kaydır"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto justify-start md:justify-center border-b border-gray-200 dark:border-slate-700 scrollbar-hide"
          >
            {categoriesData.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-300 focus:outline-none whitespace-nowrap ${activeTab === index
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {showRightButton && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-dark-blue rounded-full p-1 shadow-md hover:bg-dark-blue/90 md:hidden"
              aria-label="İleri Kaydır"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        <div className="mt-8">
          {categoriesData.map((category, index) => (
            <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {category.products.map((product, pIndex) => (
                    <div key={pIndex} className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-3 space-y-3 flex flex-col items-center">
                      <div className="relative w-full aspect-square overflow-hidden rounded-md">
                        <img
                          src={product.imageUrl}
                          alt={`${category.name} product ${pIndex + 1}`}
                          className="w-full h-full object-cover filter blur-sm"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-md">
                          <Icon iconName="lock" className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                        </div>
                      </div>
                      <button
                        onClick={handleScrollToPricing}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 text-sm w-full"
                      >
                        Satmaya Başla
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;