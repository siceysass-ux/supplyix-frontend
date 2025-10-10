import React from 'react';
import PageHeader from '../shared/PageHeader';
import { StarIcon, TrashIcon } from '../icons/outline';
import EmptyState from '../shared/EmptyState';
import { Product, Price } from '../types';

interface FavoritesPageProps {
    navigate: (path: string) => void;
    products: Product[];
    toggleFavorite: (productName: string) => void;
}

const formatPrice = (price: Price): string => {
    if (typeof price === 'number') {
        return `$${price.toLocaleString('en-US')}`;
    }
    return `$${price.min.toLocaleString('en-US')} - $${price.max.toLocaleString('en-US')}`;
};

const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigate, products, toggleFavorite }) => {
    const favoriteProducts = products.filter(p => p.isFavorite);

    const handleRemoveFavorite = (productName: string) => {
        toggleFavorite(productName);
    };
    
    const hasFavorites = favoriteProducts.length > 0;
    
    return (
        <div>
            <PageHeader
                title="Favorilerim"
                subtitle="Beğendiğiniz ürünleri burada bulabilir ve hızlıca mağazanıza ekleyebilirsiniz."
            />
            
            {hasFavorites ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteProducts.map(product => (
                        <div key={product.name} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            {/* FIX: The Product type uses an `images` array. Display the first image. */}
                            <img className="h-48 w-full object-cover rounded-t-xl" src={product.images[0]} alt={product.name} />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-dark-blue truncate group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                                <p className="text-sm text-slate-500 mb-3">{product.category}</p>
                                
                                <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-100">
                                    <p className="text-lg font-bold text-dark-blue">{formatPrice(product.price)}</p>
                                    <button 
                                        onClick={() => handleRemoveFavorite(product.name)}
                                        className="inline-flex items-center justify-center text-sm font-semibold text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors duration-200 px-3 py-1.5 border border-red-200 hover:border-red-500"
                                        aria-label={`${product.name} ürününü favorilerden kaldır`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-1.5" />
                                        Kaldır
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                <EmptyState
                    icon={<StarIcon />}
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