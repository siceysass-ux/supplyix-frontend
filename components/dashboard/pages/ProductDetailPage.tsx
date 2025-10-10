import React, { useState, useEffect } from 'react';
import { Product, Price, VariationOption } from '../types';
import { StarIcon as StarIconOutline, ShoppingCartIcon, ArrowDownTrayIcon, ClipboardIcon } from '../icons/outline';
import { StarIcon as StarIconSolid } from '../icons/solid';

declare const JSZip: any;
declare const saveAs: any;

interface ProductDetailPageProps {
    product?: Product;
    toggleFavorite: (productName: string) => void;
    navigate: (path: string) => void;
    addToCart: (product: Product, variations: Record<string, string>) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, toggleFavorite, navigate, addToCart }) => {
    const [mainImage, setMainImage] = useState(product?.images[0] || '');
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
    const [isDownloading, setIsDownloading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [zoomPosition, setZoomPosition] = useState('50% 50%');
    const [addSuccess, setAddSuccess] = useState(false);

    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
            const defaults: Record<string, string> = {};
            product.variations?.forEach(v => {
                if (v.options.length > 0) defaults[v.type] = v.options[0].name;
            });
            setSelectedVariations(defaults);
        }
    }, [product]);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPosition(`${x}% ${y}%`);
    };

    if (!product) {
        return (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-dark-blue">Ürün Bulunamadı</h2>
                <p className="text-slate-600 mt-2">Aradığınız ürün mevcut değil veya kaldırılmış.</p>
                <button
                    onClick={() => navigate('/dashboard/sourcing-pool')}
                    className="mt-6 bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-focus"
                >
                    Tedarik Havuzuna Geri Dön
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, selectedVariations);
            setAddSuccess(true);
            setTimeout(() => setAddSuccess(false), 2000);
        }
    };
    
    const handleVariationSelect = (type: string, option: VariationOption) => {
        setSelectedVariations(prev => ({ ...prev, [type]: option.name }));
        if (option.image) setMainImage(option.image);
    };
    
    const handleDownloadImages = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const fetchImage = (url: string) => fetch(url).then(res => res.blob());
            const imagePromises = product.images.map((imgUrl, index) => 
                fetchImage(imgUrl).then(blob => ({
                    blob,
                    name: `${product.name.replace(/\s+/g, '_')}_${index + 1}.${blob.type.split('/')[1]}`
                }))
            );
            const imageBlobs = await Promise.all(imagePromises);
            imageBlobs.forEach(({ blob, name }) => zip.file(name, blob));
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${product.name.replace(/\s+/g, '_')}_images.zip`);
        } catch (error) {
            console.error("Error downloading images:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(text);
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const getStockBadge = (stock: number) => {
        if (stock > 50) return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Stokta</span>;
        if (stock > 0) return <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Az Adet</span>;
        return <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Tükendi</span>;
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-1 order-first lg:order-none">
                        <div className="flex lg:flex-col gap-2">
                            {product.images.slice(0, 5).map((img, index) => (
                                <button key={index} onClick={() => setMainImage(img)} className={`w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-slate-300'}`}>
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div onMouseMove={handleMouseMove} onMouseLeave={() => setZoomPosition('50% 50%')} className="aspect-square w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in">
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-150" style={{ transformOrigin: zoomPosition }}/>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <h1 className="text-2xl lg:text-3xl font-bold text-dark-blue">{product.name}</h1>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                            <span>SKU: {product.sku}</span>
                            <span className="h-4 border-l border-slate-300"></span>
                            <span>{product.category} &gt; {product.subcategory}</span>
                            <span className="h-4 border-l border-slate-300"></span>
                            <div className="flex items-center space-x-2">
                                {getStockBadge(product.stock)}
                                <span className="font-medium">({product.stock} adet)</span>
                            </div>
                        </div>

                        {product.variations?.map(variation => (
                            <div key={variation.type} className="mt-6">
                                <h3 className="text-sm font-semibold text-slate-700 mb-2">{variation.type}: <span className="font-normal text-slate-600">{selectedVariations[variation.type]}</span></h3>
                                <div className="flex flex-wrap gap-2">
                                    {variation.options.map(option => variation.type === 'Renk' ? (
                                        <button key={option.name} onClick={() => handleVariationSelect(variation.type, option)} title={option.name} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariations[variation.type] === option.name ? 'border-primary' : 'border-transparent hover:border-slate-400'}`} style={{ backgroundColor: option.value }}>
                                            <span className="sr-only">{option.name}</span>
                                        </button>
                                    ) : (
                                        <button key={option.name} onClick={() => handleVariationSelect(variation.type, option)} className={`px-4 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${selectedVariations[variation.type] === option.name ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                            <button onClick={handleAddToCart} disabled={addSuccess} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus transition-colors flex items-center justify-center text-base disabled:bg-green-500 disabled:cursor-not-allowed">
                               <ShoppingCartIcon className="w-5 h-5 mr-2" /> {addSuccess ? 'Sepete Eklendi!' : 'Sepete Ekle'}
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => toggleFavorite(product.name)} className={`font-bold py-3 rounded-lg transition-colors flex items-center justify-center border-2 ${product.isFavorite ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                                    {product.isFavorite ? <StarIconSolid className="w-5 h-5 mr-2" /> : <StarIconOutline className="w-5 h-5 mr-2" />}
                                    Favori
                                </button>
                                <button onClick={handleDownloadImages} disabled={isDownloading} className="font-bold py-3 rounded-lg transition-colors flex items-center justify-center border-2 bg-white border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-200">
                                   <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> 
                                   {isDownloading ? 'İndiriliyor...' : 'Görseller'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('description')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Ürün Açıklaması</button>
                        <button onClick={() => setActiveTab('specs')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Teknik Özellikler</button>
                        <button onClick={() => setActiveTab('shipping')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Kargo & Tedarik</button>
                    </nav>
                </div>
                <div className="pt-6">
                    {activeTab === 'description' && (
                        <div className="relative">
                            <button onClick={() => copyToClipboard(product.description)} className="absolute top-0 right-0 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold py-1 px-2 rounded-md flex items-center transition-colors">
                                <ClipboardIcon className="w-3 h-3 mr-1.5" />
                                {copySuccess === product.description ? 'Kopyalandı!' : 'Kopyala'}
                            </button>
                            <p className="text-slate-600 whitespace-pre-line leading-relaxed pr-24">{product.description}</p>
                        </div>
                    )}
                    {activeTab === 'specs' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            {product.specifications.map(spec => (
                                <div key={spec.key} className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="font-medium text-slate-600">{spec.key}</span>
                                    <span className="text-dark-blue">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'shipping' && (
                        <div className="text-sm">
                             <div className="flex justify-between border-b border-slate-200 pb-2 mb-4">
                                <span className="font-medium text-slate-600">Tedarik Süresi</span>
                                <span className="text-dark-blue">{product.shippingInfo.processingTime}</span>
                            </div>
                             <div className="flex justify-between border-b border-slate-200 pb-2 mb-4">
                                <span className="font-medium text-slate-600">Kargo Süresi</span>
                                <span className="text-dark-blue">{product.shipping}</span>
                            </div>
                             <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="font-medium text-slate-600">Depo Konumu</span>
                                <span className="text-dark-blue">{product.shippingInfo.warehouse}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;