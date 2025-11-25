
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import PageHeader from '../shared/PageHeader';
import { Product, Price } from '../types';
import { StarIcon as StarIconOutline, SearchIcon } from '../icons/outline';
import { StarIcon as StarIconSolid } from '../icons/solid';

const formatPrice = (price: Price | string | number): string => {
    if (typeof price === 'object' && price.min !== undefined && price.max !== undefined) {
        const min = parseFloat(String(price.min));
        const max = parseFloat(String(price.max));
        if (min === max) {
            return `$${min.toFixed(2)}`;
        }
        return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
    }
    const numPrice = parseFloat(String(price)) || 0;
    return `$${numPrice.toFixed(2)}`;
};

import { normalizeText } from '../shared/utils';

interface SourcingPoolPageProps {
    navigate: (path: string) => void;
    products: Product[];
    toggleFavorite: (productName: string) => void;
    isSubscriptionExpired?: boolean;
    categories: any[];
}

import Pagination from '../shared/Pagination';

// ... existing imports

const SourcingPoolPage: React.FC<SourcingPoolPageProps> = ({ navigate, products, toggleFavorite, isSubscriptionExpired = false, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [subcategoryFilter, setSubcategoryFilter] = useState('All');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const maxProductPrice = useMemo(() => {
        if (products.length === 0) return 1000;
        const prices = products
            .map(p => {
                if (typeof p.price === 'object' && p.price.max !== undefined) {
                    return parseFloat(String(p.price.max));
                }
                return parseFloat(String(p.price)) || 0;
            })
            .filter(price => !isNaN(price) && price > 0);

        if (prices.length === 0) return 1000;
        return Math.ceil(Math.max(...prices));
    }, [products]);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Update max price when products change
    useEffect(() => {
        if (products.length > 0) {
            const prices = products
                .map(p => {
                    if (typeof p.price === 'object' && p.price.max !== undefined) {
                        return parseFloat(String(p.price.max));
                    }
                    return parseFloat(String(p.price)) || 0;
                })
                .filter(price => !isNaN(price) && price > 0);

            if (prices.length > 0) {
                const max = Math.ceil(Math.max(...prices));
                setPriceRange([0, max]);
            }
        }
    }, [products]);

    const availableSubcategories = useMemo(() => {
        if (categoryFilter === 'All') return [];
        const category = categories.find(c => c.name === categoryFilter);
        return category ? category.subcategories : [];
    }, [categoryFilter, categories]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryFilter(e.target.value);
        setSubcategoryFilter('All');
    };

    const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), priceRange[1] - 1);
        setPriceRange([val, priceRange[1]]);
    };

    const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), priceRange[0] + 1);
        setPriceRange([priceRange[0], val]);
    };

    // Slider logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !sliderRef.current) return;
            const rect = sliderRef.current.getBoundingClientRect();
            const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
            const value = Math.round(percent * maxProductPrice);

            if (dragging === 'min') {
                setPriceRange(prev => [Math.min(value, prev[1] - 1), prev[1]]);
            } else {
                setPriceRange(prev => [prev[0], Math.max(value, prev[0] + 1)]);
            }
        };

        const handleMouseUp = () => {
            setDragging(null);
        };

        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, maxProductPrice]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, subcategoryFilter, priceRange]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const normalizedSearchTerm = normalizeText(searchTerm);
            const matchesSearch = normalizedSearchTerm === '' ||
                normalizeText(product.name).includes(normalizedSearchTerm) ||
                product.tags.some(tag => normalizeText(tag).includes(normalizedSearchTerm));

            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            const matchesSubcategory = subcategoryFilter === 'All' || product.subcategory === subcategoryFilter;

            // Handle both object and string price formats
            let productMin = 0;
            let productMax = 0;

            if (typeof product.price === 'object' && product.price.max !== undefined) {
                productMin = parseFloat(String(product.price.min)) || 0;
                productMax = parseFloat(String(product.price.max)) || 0;
            } else {
                const price = parseFloat(String(product.price)) || 0;
                productMin = price;
                productMax = price;
            }

            const matchesPrice = productMax >= priceRange[0] && productMin <= priceRange[1];

            return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
        });
    }, [products, searchTerm, categoryFilter, subcategoryFilter, priceRange]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <PageHeader
                title="Tedarik Havuzu"
                subtitle="Satışa hazır binlerce ürünü keşfedin ve mağazanıza ekleyin."
            />

            {/* ... (keep existing filters section) */}
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                    <div className="lg:col-span-1">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-1">Ürün Ara</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="tshirt, ofis, saat..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-700 p-3 pl-10 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-1">Kategori</label>
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary"
                            >
                                <option value="All">Tümü</option>
                                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-1">Alt Kategori</label>
                            <select
                                value={subcategoryFilter}
                                onChange={e => setSubcategoryFilter(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary disabled:opacity-50"
                                disabled={availableSubcategories.length === 0}
                            >
                                <option value="All">Tümü</option>
                                {availableSubcategories.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-1">Fiyat Aralığı ($)</label>
                        <div className="flex items-center gap-2">
                            <input type="number" min="0" max={maxProductPrice} value={priceRange[0]} onChange={handleMinPriceInput} className="w-full text-center bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" />
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">-</span>
                            <input type="number" min="0" max={maxProductPrice} value={priceRange[1]} onChange={handleMaxPriceInput} className="w-full text-center bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary" />
                        </div>
                        <div ref={sliderRef} className="relative w-full h-5 mt-2 pt-2 px-2">
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-slate-200 dark:bg-slate-600 rounded-full" />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full"
                                style={{
                                    left: `${(priceRange[0] / maxProductPrice) * 100}%`,
                                    right: `${100 - (priceRange[1] / maxProductPrice) * 100}%`
                                }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-200 border-2 border-primary rounded-full shadow cursor-grab active:cursor-grabbing"
                                style={{ left: `calc(${(priceRange[0] / maxProductPrice) * 100}%)` }}
                                onMouseDown={() => setDragging('min')}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-200 border-2 border-primary rounded-full shadow cursor-grab active:cursor-grabbing"
                                style={{ left: `calc(${(priceRange[1] / maxProductPrice) * 100}%)` }}
                                onMouseDown={() => setDragging('max')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                    <div key={product.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative">
                        {isSubscriptionExpired && (
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg">
                                    Aboneliğiniz sona erdi
                                </div>
                            </div>
                        )}
                        <div className="relative">
                            <img
                                className={`h-48 w-full object-cover rounded-t-xl ${!isSubscriptionExpired ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                src={product.images[0]}
                                alt={product.name}
                                onClick={() => !isSubscriptionExpired && navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}
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
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{product.category}{product.subcategory ? ` > ${product.subcategory}` : ''}</p>
                            <h3
                                className={`font-semibold text-dark-blue dark:text-slate-100 truncate group-hover:text-primary transition-colors duration-200 ${!isSubscriptionExpired ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={() => !isSubscriptionExpired && navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}
                            >
                                {product.name}
                            </h3>

                            <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700 mt-3">
                                <p className="text-lg font-bold text-dark-blue dark:text-slate-100">{formatPrice(product.price)}</p>
                                <button
                                    onClick={() => !isSubscriptionExpired && navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}
                                    disabled={isSubscriptionExpired}
                                    className={`text-sm font-semibold ${isSubscriptionExpired ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}
                                >
                                    Detaylar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Control */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default SourcingPoolPage;
