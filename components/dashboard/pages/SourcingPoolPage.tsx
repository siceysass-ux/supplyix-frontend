
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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

const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[-]/g, '') // Remove hyphens
        .replace(/[ıİ]/g, 'i')
        .replace(/[şŞ]/g, 's')
        .replace(/[ğĞ]/g, 'g')
        .replace(/[üÜ]/g, 'u')
        .replace(/[öÖ]/g, 'o')
        .replace(/[çÇ]/g, 'c');
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

    const maxProductPrice = useMemo(() => {
        if (products.length === 0) return 1000;
        return Math.ceil(Math.max(...products.map(p => p.price.max)));
    }, [products]);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, maxProductPrice]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
    
    useEffect(() => {
        setPriceRange([0, maxProductPrice]);
    }, [maxProductPrice]);

    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging || !sliderRef.current) return;
        e.preventDefault();

        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        let newValue = Math.floor(percent * maxProductPrice);

        setPriceRange(prev => {
            if (dragging === 'min') {
                const newMin = Math.min(newValue, prev[1]);
                return [newMin, prev[1]];
            } else {
                const newMax = Math.max(newValue, prev[0]);
                return [prev[0], newMax];
            }
        });
    }, [dragging, maxProductPrice]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, handleMouseMove, handleMouseUp]);


    const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const newMin = isNaN(value) ? 0 : Math.max(0, Math.min(value, priceRange[1]));
        setPriceRange([newMin, priceRange[1]]);
    };

    const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const newMax = isNaN(value) ? maxProductPrice : Math.min(maxProductPrice, Math.max(value, priceRange[0]));
        setPriceRange([priceRange[0], newMax]);
    };

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
            const normalizedSearchTerm = normalizeText(searchTerm);
            const matchesSearch = normalizedSearchTerm === '' ||
                normalizeText(product.name).includes(normalizedSearchTerm) ||
                product.tags.some(tag => normalizeText(tag).includes(normalizedSearchTerm));

            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            const matchesSubcategory = subcategoryFilter === 'All' || product.subcategory === subcategoryFilter;
            
            const matchesPrice = product.price.max >= priceRange[0] && product.price.min <= priceRange[1];

            return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
        });
    }, [products, searchTerm, categoryFilter, subcategoryFilter, priceRange]);

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
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                    <div className="lg:col-span-1">
                        <label className="text-sm font-semibold text-slate-600 block mb-1">Ürün Ara</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="tshirt, ofis, saat..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 p-3 pl-10 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 block mb-1">Kategori</label>
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                className="w-full bg-slate-100 p-3 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"
                            >
                                <option value="All">Tümü</option>
                                {Object.keys(categoriesWithSubcategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="text-sm font-semibold text-slate-600 block mb-1">Alt Kategori</label>
                            <select
                                value={subcategoryFilter}
                                onChange={e => setSubcategoryFilter(e.target.value)}
                                className="w-full bg-slate-100 p-3 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"
                                disabled={availableSubcategories.length === 0}
                            >
                                <option value="All">Tümü</option>
                                {availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="text-sm font-semibold text-slate-600 block mb-1">Fiyat Aralığı ($)</label>
                        <div className="flex items-center gap-2">
                            <input type="number" min="0" max={maxProductPrice} value={priceRange[0]} onChange={handleMinPriceInput} className="w-full text-center bg-slate-100 p-3 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"/>
                            <span className="text-slate-500 font-semibold">-</span>
                            <input type="number" min="0" max={maxProductPrice} value={priceRange[1]} onChange={handleMaxPriceInput} className="w-full text-center bg-slate-100 p-3 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary"/>
                        </div>
                        <div ref={sliderRef} className="relative w-full h-5 mt-2 pt-2 px-2">
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-slate-200 rounded-full" />
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full"
                                style={{
                                    left: `${(priceRange[0] / maxProductPrice) * 100}%`,
                                    right: `${100 - (priceRange[1] / maxProductPrice) * 100}%`
                                }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-grab active:cursor-grabbing"
                                style={{ left: `calc(${(priceRange[0] / maxProductPrice) * 100}%)` }}
                                onMouseDown={() => setDragging('min')}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-grab active:cursor-grabbing"
                                style={{ left: `calc(${(priceRange[1] / maxProductPrice) * 100}%)` }}
                                onMouseDown={() => setDragging('max')}
                            />
                        </div>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
