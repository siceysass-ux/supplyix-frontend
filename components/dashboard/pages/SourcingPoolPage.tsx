import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PageHeader from '../shared/PageHeader';
import { CubeIcon, SearchIcon, StarIcon as StarIconOutline } from '../icons/outline';
import { StarIcon as StarIconSolid } from '../icons/solid';
import { Product, Price } from '../types';

// --- Helper Functions ---

const formatPrice = (price: Price): string => {
    if (typeof price === 'number') {
        return `$${price.toLocaleString('en-US')}`;
    }
    return `$${price.min.toLocaleString('en-US')} - $${price.max.toLocaleString('en-US')}`;
};

// --- Child Components ---

const ProductCard: React.FC<{ product: Product; onToggleFavorite: (name: string) => void }> = ({ product, onToggleFavorite }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the favorite button
        setIsAnimating(true);
        onToggleFavorite(product.name);
    };
    
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative aspect-square w-full">
                <img className="w-full h-full object-cover" src={product.images[0]} alt={product.name} />
                <button
                    onClick={handleFavoriteClick}
                    onAnimationEnd={() => setIsAnimating(false)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 focus:outline-none ${
                        isAnimating ? 'animate-favorite-pop' : ''
                    } ${
                        product.isFavorite
                            ? 'bg-primary/90 text-white'
                            : 'bg-white/50 text-slate-700 backdrop-blur-sm opacity-50 group-hover:opacity-100 hover:bg-primary/90 hover:text-white'
                    }`}
                    aria-label={product.isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
                >
                    {product.isFavorite ? <StarIconSolid className="w-5 h-5" /> : <StarIconOutline className="w-5 h-5" />}
                </button>
            </div>
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-dark-blue truncate group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                <div className="flex justify-between items-baseline">
                    <p className="text-lg font-bold text-dark-blue">{formatPrice(product.price)}</p>
                    <span className="text-xs text-slate-500">Teslimat: {product.shipping}</span>
                </div>
            </div>
        </div>
    );
};


interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, value, onChange }) => {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const minValRef = useRef(value[0]);
    const maxValRef = useRef(value[1]);
    const range = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
    }, [value]);

    const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);
        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);
        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    const handleMinSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(event.target.value), maxVal - 1);
        setMinVal(value);
        minValRef.current = value;
        onChange([value, maxVal]);
    };

    const handleMaxSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(event.target.value), minVal + 1);
        setMaxVal(value);
        maxValRef.current = value;
        onChange([minVal, value]);
    };

    const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newMinVal = Math.min(Number(event.target.value), value[1] - 1);
      setMinVal(newMinVal);
      minValRef.current = newMinVal;
      onChange([newMinVal, value[1]]);
    };
    
    const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newMaxVal = Math.max(Number(event.target.value), value[0] + 1);
      setMaxVal(newMaxVal);
      maxValRef.current = newMaxVal;
      onChange([value[0], newMaxVal]);
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <input
                    type="number"
                    value={minVal}
                    onChange={handleMinInputChange}
                    className="w-full mr-2 bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                    min={min}
                    max={max}
                />
                <span className="text-slate-500">-</span>
                <input
                    type="number"
                    value={maxVal}
                    onChange={handleMaxInputChange}
                    className="w-full ml-2 bg-slate-100 p-2 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                    min={min}
                    max={max}
                />
            </div>
            <div className="relative h-8 flex items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={handleMinSliderChange}
                    className="thumb thumb--left"
                    style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={handleMaxSliderChange}
                    className="thumb thumb--right"
                />
                <div className="relative w-full">
                    <div className="absolute w-full rounded h-1 bg-slate-200 z-1"></div>
                    <div ref={range} className="absolute rounded h-1 bg-primary z-2"></div>
                </div>
            </div>
             <style>{`
                .thumb {
                    pointer-events: none;
                    position: absolute;
                    height: 0;
                    width: 100%;
                    outline: none;
                    -webkit-appearance: none;
                    background-color: transparent;
                }
                .thumb::-webkit-slider-thumb {
                    pointer-events: all;
                    width: 1.25rem;
                    height: 1.25rem;
                    border-radius: 50%;
                    border: 3px solid white;
                    background-color: #ff6a00;
                    cursor: pointer;
                    -webkit-appearance: none;
                    margin-top: -8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                 .thumb::-moz-range-thumb {
                    pointer-events: all;
                    width: 1.25rem;
                    height: 1.25rem;
                    border-radius: 50%;
                    border: 3px solid white;
                    background-color: #ff6a00;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

const categories: Record<string, string[]> = {
    'Elektronik': ['Akıllı Saat', 'Kulaklık', 'Kamera', 'Güvenlik Sistemleri', 'Bilgisayar Aksesuarları'],
    'Ev & Yaşam': ['Mutfak Gereçleri', 'Aydınlatma', 'Ofis Mobilyası', 'Banyo Aksesuarları'],
    'Spor': ['Yoga Malzemeleri'],
    'Evcil Hayvan': ['Beslenme'],
    'Sağlık & Bakım': ['Masaj Aletleri'],
};

// --- Main Component ---
interface SourcingPoolPageProps {
    products: Product[];
    toggleFavorite: (productName: string) => void;
    navigate: (path: string) => void;
}

const SourcingPoolPage: React.FC<SourcingPoolPageProps> = ({ products, toggleFavorite, navigate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const productsPerPage = 12;

    const MAX_PRICE = useMemo(() => {
        if (!products || products.length === 0) return 5000;
        const max = products.reduce((maxVal, product) => {
            const currentMax = typeof product.price === 'number' ? product.price : product.price.max;
            return currentMax > maxVal ? currentMax : maxVal;
        }, 0);
        return Math.ceil(max / 100) * 100;
    }, [products]);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
    
    useEffect(() => {
        setPriceRange([0, MAX_PRICE]);
    }, [MAX_PRICE]);


    const subcategories = useMemo(() => {
        return selectedCategory ? categories[selectedCategory] : [];
    }, [selectedCategory]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Search filter
            if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            // Category filter
            if (selectedCategory && p.category !== selectedCategory) {
                return false;
            }
            // Subcategory filter
            if (selectedSubcategory && p.subcategory !== selectedSubcategory) {
                return false;
            }
            // Price filter
            const [minFilter, maxFilter] = priceRange;
            const pMin = typeof p.price === 'number' ? p.price : p.price.min;
            const pMax = typeof p.price === 'number' ? p.price : p.price.max;
            if (pMax < minFilter || pMin > maxFilter) {
                return false;
            }
            return true;
        });
    }, [searchTerm, selectedCategory, selectedSubcategory, priceRange, products]);


    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedSubcategory, priceRange]);
    
    const handleProductClick = (productName: string) => {
        navigate(`/dashboard/product/${encodeURIComponent(productName)}`);
    };

    return (
        <div>
            <PageHeader
                title="Tedarik Havuzu"
                subtitle="Milyonlarca ürün arasından en çok satanları keşfedin ve mağazanıza ekleyin."
            />

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                    <div className="lg:col-span-2">
                        <label className="text-xs font-semibold text-slate-500">Arama</label>
                        <div className="relative mt-1">
                             <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Ürün adı veya SKU..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 p-2 pl-10 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Kategori</label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => {setSelectedCategory(e.target.value); setSelectedSubcategory('');}}
                            className="w-full bg-slate-100 p-2 mt-1 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                        >
                            <option value="">Tümü</option>
                            {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">Alt Kategori</label>
                        <select 
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            className="w-full bg-slate-100 p-2 mt-1 rounded-md border border-slate-200 text-sm focus:ring-primary focus:border-primary"
                            disabled={!selectedCategory}
                        >
                            <option value="">Tümü</option>
                            {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                     <div className="lg:col-span-1">
                        <label className="text-xs font-semibold text-slate-500">Fiyat Aralığı ($)</label>
                        <PriceRangeSlider min={0} max={MAX_PRICE} value={priceRange} onChange={setPriceRange} />
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((product, index) => (
                    <div key={index} onClick={() => handleProductClick(product.name)} className="cursor-pointer">
                        <ProductCard product={product} onToggleFavorite={toggleFavorite} />
                    </div>
                ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center">
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">
                            <span className="sr-only">Önceki</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button key={number} onClick={() => paginate(number)} className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium ${currentPage === number ? 'z-10 bg-primary/10 border-primary text-primary' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                {number}
                            </button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50">
                            <span className="sr-only">Sonraki</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </button>
                    </nav>
                </div>
            )}
            <style>{`
                @keyframes favorite-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.4); }
                    100% { transform: scale(1); }
                }
                .animate-favorite-pop {
                    animation: favorite-pop 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SourcingPoolPage;