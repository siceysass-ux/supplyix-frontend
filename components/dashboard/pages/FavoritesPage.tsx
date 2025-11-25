import React, { useState, useMemo, useEffect, useRef } from 'react';
import PageHeader from '../shared/PageHeader';
import { StarIcon, TrashIcon, Squares2X2Icon, PlusIcon, FolderIcon, InboxStackIcon, TagIcon } from '../icons/outline';
import EmptyState from '../shared/EmptyState';
import { Product, Price, FavoriteCategory } from '../types';

interface FavoritesPageProps {
    navigate: (path: string) => void;
    products: Product[];
    toggleFavorite: (productName: string) => void;
    favoriteCategories: FavoriteCategory[];
    onAddCategory: (name: string) => void;
    onDeleteCategory: (id: string) => void;
    onAssignProduct: (productName: string, categoryId: string | null) => void;
}

const formatPrice = (price: Price): string => {
    if (price.min === price.max) {
        return `$${price.min.toFixed(2)}`;
    }
    return `$${price.min.toFixed(2)} - $${price.max.toFixed(2)}`;
};

import Pagination from '../shared/Pagination';

// ... existing imports

const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigate, products, toggleFavorite, favoriteCategories, onAddCategory, onDeleteCategory, onAssignProduct }) => {
    const favoriteProducts = useMemo(() => products.filter(p => p.isFavorite), [products]);
    const uncategorizedCount = useMemo(() => {
        const categorizedProductNames = new Set(favoriteCategories.flatMap(c => c.productNames));
        return favoriteProducts.filter(p => !categorizedProductNames.has(p.name)).length;
    }, [favoriteProducts, favoriteCategories]);

    const [activeFilter, setActiveFilter] = useState<string>('all'); // 'all', 'uncategorized', or a category ID
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [movingProduct, setMovingProduct] = useState<string | null>(null); // name of the product being moved

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setMovingProduct(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    const filteredFavoriteProducts = useMemo(() => {
        if (activeFilter === 'all') {
            return favoriteProducts;
        }
        if (activeFilter === 'uncategorized') {
            const categorizedProductNames = new Set(favoriteCategories.flatMap(c => c.productNames));
            return favoriteProducts.filter(p => !categorizedProductNames.has(p.name));
        }
        const category = favoriteCategories.find(c => c.id === activeFilter);
        if (category) {
            return favoriteProducts.filter(p => category.productNames.includes(p.name));
        }
        return [];
    }, [favoriteProducts, activeFilter, favoriteCategories]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredFavoriteProducts.length / itemsPerPage);
    const currentProducts = filteredFavoriteProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreateCategory = () => {
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName);
            setNewCategoryName('');
            setIsCreating(false);
        }
    };

    const handleAssignAndClose = (productName: string, categoryId: string | null) => {
        onAssignProduct(productName, categoryId);
        setMovingProduct(null);
    };

    if (favoriteProducts.length === 0) {
        return (
            <div>
                <PageHeader
                    title="Favorilerim"
                    subtitle="Beğendiğiniz ürünleri burada bulabilir ve kategorilere ayırabilirsiniz."
                />
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
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Favorilerim"
                subtitle="Beğendiğiniz ürünleri burada bulabilir ve yönetebilirsiniz."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Sidebar for Filters and Categories */}
                <aside className="lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 lg:sticky top-24">
                    <h3 className="font-bold text-dark-blue dark:text-slate-100 px-2 mb-3">Kategoriler</h3>
                    <nav className="space-y-1">
                        <button onClick={() => setActiveFilter('all')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            <FolderIcon className="w-5 h-5" />
                            <span className="flex-grow text-left">Tümü</span>
                            <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-bold px-2 py-0.5 rounded-full">{favoriteProducts.length}</span>
                        </button>
                        <button onClick={() => setActiveFilter('uncategorized')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${activeFilter === 'uncategorized' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            <InboxStackIcon className="w-5 h-5" />
                            <span className="flex-grow text-left">Kategorisiz</span>
                            <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-bold px-2 py-0.5 rounded-full">{uncategorizedCount}</span>
                        </button>

                        <div className="pt-2">
                            {favoriteCategories.map(cat => (
                                <div key={cat.id} className="group flex items-center">
                                    <button onClick={() => setActiveFilter(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${activeFilter === cat.id ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        <TagIcon className="w-5 h-5" />
                                        <span className="flex-grow text-left truncate">{cat.name}</span>
                                        <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-bold px-2 py-0.5 rounded-full">{cat.productNames.length}</span>
                                    </button>
                                    <button onClick={() => onDeleteCategory(cat.id)} className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1" aria-label={`${cat.name} kategorisini sil`}>
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </nav>
                    <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        {isCreating ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Yeni kategori adı..."
                                    className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md border border-slate-300 dark:border-slate-600 text-sm focus:ring-primary focus:border-primary"
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <button onClick={handleCreateCategory} className="flex-grow bg-primary text-white font-semibold py-1.5 px-3 rounded-md text-sm">Kaydet</button>
                                    <button onClick={() => setIsCreating(false)} className="flex-grow bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-1.5 px-3 rounded-md text-sm">İptal</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsCreating(true)} className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm inline-flex items-center justify-center gap-2">
                                <PlusIcon className="w-5 h-5" />
                                Yeni Kategori
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content: Favorite Products Grid */}
                <main className="lg:col-span-3">
                    {filteredFavoriteProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {currentProducts.map(product => (
                                    <div key={product.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        <div className="relative cursor-pointer" onClick={() => navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}>
                                            <img className="h-48 w-full object-cover rounded-t-xl" src={product.images[0]} alt={product.name} />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-dark-blue dark:text-slate-100 truncate cursor-pointer group-hover:text-primary transition-colors" onClick={() => navigate(`/dashboard/product/${encodeURIComponent(product.name)}`)}>{product.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{product.category}</p>

                                            <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                                                <p className="text-lg font-bold text-dark-blue dark:text-slate-100">{formatPrice(product.price)}</p>
                                                <div className="flex items-center gap-1" ref={movingProduct === product.name ? popoverRef : null}>
                                                    <div className="relative">
                                                        <button onClick={() => setMovingProduct(product.name === movingProduct ? null : product.name)} className="p-2 text-slate-500 hover:text-primary rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" title="Taşı">
                                                            <Squares2X2Icon className="w-5 h-5" />
                                                        </button>
                                                        {movingProduct === product.name && (
                                                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10">
                                                                <ul className="text-sm text-slate-700 dark:text-slate-200 max-h-48 overflow-y-auto">
                                                                    <li className="px-3 py-2 font-semibold border-b border-slate-200 dark:border-slate-700">Taşı...</li>
                                                                    {favoriteCategories.map(cat => (
                                                                        <li key={cat.id} onClick={() => handleAssignAndClose(product.name, cat.id)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">{cat.name}</li>
                                                                    ))}
                                                                    {favoriteCategories.length > 0 && <li className="border-t border-slate-200 dark:border-slate-700"></li>}
                                                                    <li onClick={() => handleAssignAndClose(product.name, null)} className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer">Kategoriden Çıkar</li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => toggleFavorite(product.name)}
                                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-md"
                                                        aria-label={`${product.name} ürününü favorilerden kaldır`}
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="mx-auto h-12 w-12 text-slate-400">
                                <TagIcon />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-dark-blue dark:text-slate-100">Bu Kategoride Ürün Yok</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Seçtiğiniz kategoride favori ürün bulunmuyor.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default FavoritesPage;