import React, { useState, useMemo } from 'react';
import PageHeader from '../shared/PageHeader';
import { Product, Price } from '../types';
import { StarIcon as StarIconOutline, SearchIcon } from '../icons/outline';
import { StarIcon as StarIconSolid } from '../icons/solid';

const formatPrice = (price: Price): string => {
    if (price.min === price.max) {
        return `$${price.min.toFixed(2)}`;
    }
    return `$${price.min.toFixed(2)} - $${price.max.toFixed(2)}`;
};

interface SourcingPoolPageProps {
    navigate: (path: string) => void;
    products: Product[];
    toggleFavorite: (productName: string) => void;
}

const SourcingPoolPage: React.FC<SourcingPoolPageProps> = ({ navigate, products, toggleFavorite }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [subcategoryFilter, setSubcategoryFilter] = useState('All');

    const categoriesWithSubcategories = useMemo(() => {
        const structure: Record<string, Set<string>> = {};
        products.forEach(p => {
            if (!structure[p.category]) {
                structure[p.category] = new Set();
            }
            if (p.subcategory) {
                structure[p.category].add(p.subcategory);
            }
        });
        return structure;
    }, [products]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryFilter(e.target.value);
        setSubcategoryFilter('All'); // Reset subcategory filter when main category changes
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            const matchesSubcategory = subcategoryFilter === 'All' || product.subcategory === subcategoryFilter;
            return matchesSearch && matchesCategory && matchesSubcategory;
        });
    }, [products, searchTerm, categoryFilter, subcategoryFilter]);

    const availableSubcategories = categoriesWithSubcategories[categoryFilter]
      ? Array.from(categoriesWithSubcategories[categoryFilter])
      : [];

    return (
        <div>
            <PageHeader
                title="Tedarik Havuzu"
                subtitle="Satışa hazır binlerce ürünü keşfedin ve mağazanıza ekleyin."
            />
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <SearchIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ürün adı veya etiket ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 p-3 pl-10 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                             className="w-full bg-slate-100 p-3 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"
                        >
                            <option value="All">Tüm Kategoriler</option>
                            {Object.keys(categoriesWithSubcategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div>
                        <select
                            value={subcategoryFilter}
                            onChange={e => setSubcategoryFilter(e.target.value)}
                             className="w-full bg-slate-100 p-3 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"
                             disabled={availableSubcategories.length === 0}
                        >
                            <option value="All">Tüm Alt Kategoriler</option>
                             {availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.name} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="relative">
                            <img 
                                className="h-48 w-full object-cover rounded-t-xl cursor-pointer" 
                                src={product.images[0]} 
                                alt={product.name}
                                onClick={() => navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}
                            />
                            <button
                                onClick={() => toggleFavorite(product.name)}
                                className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-slate-600 hover:text-primary transition-colors"
                                aria-label="Favorilere ekle"
                            >
                                {product.isFavorite ? <StarIconSolid className="w-5 h-5 text-primary" /> : <StarIconOutline className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <p className="text-xs text-slate-500 mb-1">{product.category}{product.subcategory ? ` > ${product.subcategory}` : ''}</p>
                            <h3 
                                className="font-semibold text-dark-blue truncate group-hover:text-primary transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}
                            >
                                {product.name}
                            </h3>
                            
                            <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100 mt-3">
                                <p className="text-lg font-bold text-dark-blue">{formatPrice(product.price)}</p>
                                 <button
                                     onClick={() => navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}
                                     className="text-sm font-semibold text-primary hover:underline"
                                >
                                    Detaylar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SourcingPoolPage;