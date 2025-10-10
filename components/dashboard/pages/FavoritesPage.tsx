import React from 'react';
import PageHeader from '../shared/PageHeader';
import { ShoppingCartIcon, StarIcon, DocumentTextIcon } from '../icons/outline';
import EmptyState from '../shared/EmptyState';

const favoriteProducts = [
    { name: 'Kablosuz Bluetooth Kulaklık', sku: 'KB-K-002', price: '₺750', stock: 500, shipping: '2-4 gün', image: 'https://picsum.photos/seed/headphone/400' },
    { name: 'Paslanmaz Çelik Termos', sku: 'PC-T-005', price: '₺280', stock: 1200, shipping: '2-4 gün', image: 'https://picsum.photos/seed/thermos/400' },
];

const FavoritesPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const hasFavorites = favoriteProducts.length > 0;
    
    return (
        <div>
            <PageHeader
                title="Favorilerim"
                subtitle="Beğendiğiniz ürünleri burada bulabilir ve hızlıca mağazanıza ekleyebilirsiniz."
            >
                 <div className="flex space-x-3">
                     <button className="bg-dark-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-dark-blue/90 transition-colors text-sm">Tümünü Listele</button>
                     <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm">Tümünü Kaldır</button>
                 </div>
            </PageHeader>
            
            {hasFavorites ? (
                 <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kargo</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {favoriteProducts.map(product => (
                                    <tr key={product.sku}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-dark-blue">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark-blue">{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.shipping}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button className="text-primary hover:text-primary-focus">Listele</button>
                                            <button className="text-red-600 hover:text-red-800">Kaldır</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            ) : (
                <EmptyState
                    icon={<StarIcon className="h-12 w-12 text-gray-400" />}
                    title="Henüz favori ürününüz yok"
                    message="Tedarik Havuzu'nda beğendiğiniz ürünleri favorilerinize ekleyerek başlayın."
                    actionButton={
                        <button 
                            onClick={() => navigate('/dashboard/sourcing-pool')}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm"
                        >
                            Tedarik Havuzuna Git
                        </button>
                    }
                />
            )}
        </div>
    );
};

export default FavoritesPage;
