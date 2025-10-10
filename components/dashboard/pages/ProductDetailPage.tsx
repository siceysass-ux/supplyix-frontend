import React, { useState, useEffect } from 'react';
import { Product, Price, VariationOption } from '../types';
import { StarIcon as StarIconOutline, ShoppingCartIcon, ArrowDownTrayIcon, ClipboardIcon } from '../icons/outline';
import { StarIcon as StarIconSolid } from '../icons/solid';

// Declare global variables from CDN scripts for TypeScript
declare const JSZip: any;
declare const saveAs: any;

interface ProductDetailPageProps {
    product?: Product;
    toggleFavorite: (productName: string) => void;
    navigate: (path: string) => void;
}

const formatPrice = (price: Price): string => {
    if (typeof price === 'number') {
        return `$${price.toLocaleString('en-US')}`;
    }
    return `$${price.min.toLocaleString('en-US')} - $${price.max.toLocaleString('en-US')}`;
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, toggleFavorite, navigate }) => {
    const [mainImage, setMainImage] = useState(product?.images[0] || '');
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
    const [isDownloading, setIsDownloading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
            // Set default selections for variations
            const defaults: Record<string, string> = {};
            product.variations?.forEach(v => {
                defaults[v.type] = v.options[0].name;
            });
            setSelectedVariations(defaults);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="text-center p-12">
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
    
    const handleVariationSelect = (type: string, option: VariationOption) => {
        setSelectedVariations(prev => ({ ...prev, [type]: option.name }));
        if (option.image) {
            setMainImage(option.image);
        }
    };
    
    const handleDownloadImages = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();

            // Helper function to fetch an image, draw it to a canvas, and return a PNG blob.
            const convertImageToPngBlob = (imageUrl: string): Promise<Blob> => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const response = await fetch(imageUrl);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch image: ${response.statusText}`);
                        }
                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        
                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) {
                                URL.revokeObjectURL(objectUrl);
                                return reject(new Error('Could not get canvas context'));
                            }
                            ctx.drawImage(img, 0, 0);
                            canvas.toBlob((pngBlob) => {
                                URL.revokeObjectURL(objectUrl);
                                if (pngBlob) {
                                    resolve(pngBlob);
                                } else {
                                    reject(new Error('Canvas toBlob returned null'));
                                }
                            }, 'image/png');
                        };
                        img.onerror = () => {
                            URL.revokeObjectURL(objectUrl);
                            reject(new Error('Image failed to load'));
                        };
                        img.src = objectUrl;

                    } catch (error) {
                        reject(error);
                    }
                });
            };


            const imagePromises = product.images.map((imgUrl, index) => 
                convertImageToPngBlob(imgUrl).then(blob => ({
                    blob,
                    name: `${product.name.replace(/\s+/g, '_')}_${index + 1}.png`
                }))
            );

            const imageBlobs = await Promise.all(imagePromises);

            imageBlobs.forEach(({ blob, name }) => {
                zip.file(name, blob);
            });
            
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${product.name.replace(/\s+/g, '_')}_images.zip`);

        } catch (error) {
            console.error("Error downloading images:", error);
            // You might want to show an error message to the user here.
        } finally {
            setIsDownloading(false);
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(text);
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square w-full bg-slate-100 rounded-lg overflow-hidden mb-4 border border-slate-200">
                        <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {product.images.map((img, index) => (
                            <button 
                                key={index} 
                                onClick={() => setMainImage(img)}
                                className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-slate-300'}`}
                            >
                                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-dark-blue">{product.name}</h1>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>

                    {/* Variations */}
                    {product.variations && product.variations.length > 0 && (
                        <div className="mt-6 space-y-4">
                            {product.variations.map(variation => (
                                <div key={variation.type}>
                                    <h3 className="text-sm font-medium text-slate-700">{variation.type}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {variation.options.map(option => (
                                            <button 
                                                key={option.name}
                                                onClick={() => handleVariationSelect(variation.type, option)}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${selectedVariations[variation.type] === option.name ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white hover:border-slate-400'}`}
                                            >
                                                {option.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-8 space-y-4">
                        <button className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors inline-flex items-center justify-center">
                           <ShoppingCartIcon className="w-5 h-5 mr-2" /> Mağazana Ekle
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={handleDownloadImages}
                                disabled={isDownloading}
                                className="bg-dark-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-dark-blue/90 transition-colors inline-flex items-center justify-center disabled:bg-slate-400"
                            >
                               <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> 
                               {isDownloading ? 'İndiriliyor...' : 'Görselleri İndir'}
                            </button>
                            <button
                                onClick={() => toggleFavorite(product.name)}
                                className={`font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center border-2 ${
                                    product.isFavorite
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                                }`}
                            >
                                {product.isFavorite ? <StarIconSolid className="w-5 h-5 mr-2" /> : <StarIconOutline className="w-5 h-5 mr-2" />}
                                {product.isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Description */}
            <div className="mt-12">
                <h2 className="text-lg font-semibold text-dark-blue border-b border-slate-200 pb-2 mb-3">Ürün Açıklaması</h2>
                <div className="relative">
                    <button
                        onClick={() => copyToClipboard(product.description)}
                        className="absolute top-0 right-0 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold py-1 px-2 rounded-md inline-flex items-center transition-colors"
                    >
                        <ClipboardIcon className="w-4 h-4 mr-1.5" />
                        {copySuccess === product.description ? 'Kopyalandı!' : 'Kopyala'}
                    </button>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed pr-24">{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
