import React from 'react';
import PageHeader from '../shared/PageHeader';
import { StarIcon, CubeIcon } from '../icons/outline';

const products = [
    { name: 'Ergonomik Ofis Sandalyesi', sku: 'EO-S-001', price: '₺2,500', shipping: '3-5 gün', image: 'https://picsum.photos/seed/chair/400' },
    { name: 'Kablosuz Bluetooth Kulaklık', sku: 'KB-K-002', price: '₺750', shipping: '2-4 gün', image: 'https://picsum.photos/seed/headphone/400' },
    { name: 'Akıllı LED Masa Lambası', sku: 'AL-L-003', price: '₺450', shipping: '3-5 gün', image: 'https://picsum.photos/seed/lamp/400' },
    { name: 'Yoga ve Pilates Matı', sku: 'YP-M-004', price: '₺300', shipping: '1-3 gün', image: 'https://picsum.photos/seed/mat/400' },
    { name: 'Paslanmaz Çelik Termos', sku: 'PC-T-005', price: '₺280', shipping: '2-4 gün', image: 'https://picsum.photos/seed/thermos/400' },
    { name: 'Otomatik Kedi Mama Kabı', sku: 'OK-M-006', price: '₺950', shipping: '4-6 gün', image: 'https://picsum.photos/seed/petfeeder/400' },
];


const SourcingPoolPage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Tedarik Havuzu"
                subtitle="Milyonlarca ürün arasından en çok satanları keşfedin ve mağazanıza ekleyin."
            >
                 <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm inline-flex items-center">
                    <CubeIcon className="w-5 h-5 mr-2" />
                    Tedarik İste
                 </button>
            </PageHeader>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" placeholder="Ürün adı veya SKU ara..." className="w-full bg-neutral p-2 rounded-md border border-gray-300 text-sm" />
                    <select className="w-full bg-neutral p-2 rounded-md border border-gray-300 text-sm">
                        <option>Tüm Kategoriler</option>
                        <option>Elektronik</option>
                        <option>Giyim</option>
                        <option>Ev & Yaşam</option>
                    </select>
                    <input type="text" placeholder="Min. Fiyat" className="w-full bg-neutral p-2 rounded-md border border-gray-300 text-sm" />
                    <button className="bg-dark-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-dark-blue/90 text-sm">Filtrele</button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.sku} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="font-bold text-dark-blue text-md mb-2 flex-grow">{product.name}</h3>
                            <div className="text-sm text-gray-500 mb-4">
                                <p>SKU: {product.sku}</p>
                                <p>Kargo: {product.shipping}</p>
                            </div>
                            <p className="text-xl font-extrabold text-primary mb-4">{product.price}</p>
                            <div className="space-y-2 mt-auto">
                                <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm">Mağazama Listele</button>
                                <button className="w-full bg-white text-dark-blue border border-gray-300 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm inline-flex items-center justify-center">
                                    <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                                    Favorilere Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Önceki</a>
                    <a href="#" aria-current="page" className="relative z-10 inline-flex items-center px-4 py-2 border border-primary bg-primary/10 text-sm font-medium text-primary">1</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Sonraki</a>
                </nav>
            </div>
        </div>
    );
};

export default SourcingPoolPage;
