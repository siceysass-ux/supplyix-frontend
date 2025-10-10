import React, { useState } from 'react';
import { Icon } from './Icon';

interface Category {
  name: string;
  products: { imageUrl: string }[];
}

const categoriesData: Category[] = [
  {
    name: 'Trend ürünler',
    products: [
      { imageUrl: 'https://picsum.photos/seed/trend1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/trend2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/trend3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/trend4/500/500' },
    ],
  },
  {
    name: 'Kadın giyim',
    products: [
      { imageUrl: 'https://picsum.photos/seed/woman1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/woman2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/woman3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/woman4/500/500' },
    ],
  },
  {
    name: 'Erkek giyim',
    products: [
      { imageUrl: 'https://picsum.photos/seed/man1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/man2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/man3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/man4/500/500' },
    ],
  },
  {
    name: 'Elektronik ve aksesuar',
    products: [
      { imageUrl: 'https://picsum.photos/seed/tech1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/tech2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/tech3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/tech4/500/500' },
    ],
  },
  {
    name: 'Evcil hayvan aksesuarları',
    products: [
      { imageUrl: 'https://picsum.photos/seed/pet1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/pet2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/pet3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/pet4/500/500' },
    ],
  },
  {
    name: 'Spor ve outdoor',
    products: [
      { imageUrl: 'https://picsum.photos/seed/sport1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/sport2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/sport3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/sport4/500/500' },
    ],
  },
  {
    name: 'Bebek, çocuk ve oyuncak',
    products: [
      { imageUrl: 'https://picsum.photos/seed/kids1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/kids2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/kids3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/kids4/500/500' },
    ],
  },
  {
    name: 'Ev ve yaşam',
    products: [
      { imageUrl: 'https://picsum.photos/seed/home1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/home2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/home3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/home4/500/500' },
    ],
  },
  {
    name: 'Aksesuar ve saatler',
    products: [
      { imageUrl: 'https://picsum.photos/seed/watch1/500/500' },
      { imageUrl: 'https://picsum.photos/seed/watch2/500/500' },
      { imageUrl: 'https://picsum.photos/seed/watch3/500/500' },
      { imageUrl: 'https://picsum.photos/seed/watch4/500/500' },
    ],
  },
];

const CategoriesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleScrollToPricing = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex overflow-x-auto justify-start md:justify-center border-b border-gray-200 scrollbar-hide">
          {categoriesData.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-300 focus:outline-none whitespace-nowrap ${
                activeTab === index
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {categoriesData.map((category, index) => (
            <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
              <div className="bg-neutral p-4 sm:p-6 md:p-8 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {category.products.map((product, pIndex) => (
                    <div key={pIndex} className="bg-white rounded-lg shadow-sm p-3 space-y-3 flex flex-col items-center">
                      <div className="relative aspect-square w-full">
                        <img
                          src={product.imageUrl}
                          alt={`${category.name} product ${pIndex + 1}`}
                          className="w-full h-full object-cover rounded-md filter blur-sm"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-md">
                          <Icon iconName="lock" className="w-12 h-12 md:w-16 md:w-16 text-primary" />
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