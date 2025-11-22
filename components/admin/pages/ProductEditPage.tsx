

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Product, Variation, ProductVariant, VariationOption } from '../../dashboard/types';
import { XMarkIcon, TrashIcon, CameraIcon, PlusIcon, PencilIcon } from '../../dashboard/icons/outline';
import { initialCategories, Category as CategoryType } from '../../../data/categories';


interface ColorPickerModalProps {
    onClose: () => void;
    onSave: (option: VariationOption) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('#000000');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [sku, setSku] = useState('');

    const handleSave = () => {
        if (name.trim() && value.trim()) {
            onSave({ name: name.trim(), value: value.trim(), price, stock, sku });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">Yeni Renk Ekle</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <input
                            type="color"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="w-16 h-16 rounded-full border-none cursor-pointer p-0 bg-transparent"
                            style={{ 'backgroundColor': value }}
                        />
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-slate-700">Renk Kodu (HEX)</label>
                            <input type="text" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-slate-50 mt-1 p-2 rounded-md border border-slate-300" />
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700">Renk Adı *</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Gece Mavisi" className="w-full bg-slate-50 mt-1 p-2 rounded-md border border-slate-300" required /></div>
                    <div><label className="block text-sm font-medium text-slate-700">SKU (Opsiyonel)</label><input type="text" value={sku} onChange={e => setSku(e.target.value)} placeholder="Örn: BLK" className="w-full bg-slate-50 mt-1 p-2 rounded-md border border-slate-300" /></div>
                    <div><label className="block text-sm font-medium text-slate-700">Fiyat ($) *</label><input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} placeholder="0" className="w-full bg-slate-50 mt-1 p-2 rounded-md border border-slate-300" required /></div>
                    <div><label className="block text-sm font-medium text-slate-700">Stok *</label><input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value) || 0)} placeholder="0" className="w-full bg-slate-50 mt-1 p-2 rounded-md border border-slate-300" required /></div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300">İptal</button>
                    <button type="button" onClick={handleSave} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Kaydet</button>
                </div>
            </div>
        </div>
    );
};


interface VariationModalProps {
    variation: Variation | null;
    onClose: () => void;
    onSave: (variation: Variation) => void;
}

const VariationModal: React.FC<VariationModalProps> = ({ variation, onClose, onSave }) => {
    const [localVariation, setLocalVariation] = useState<Variation>(
        variation || { type: '', options: [] }
    );
    const [newOption, setNewOption] = useState({ name: '', sku: '', price: 0, stock: 0 });

    const handleAddOption = () => {
        if (newOption.name.trim()) {
            setLocalVariation(prev => ({
                ...prev,
                options: [...prev.options, { ...newOption, value: newOption.name }]
            }));
            setNewOption({ name: '', sku: '', price: 0, stock: 0 });
        }
    };

    const handleRemoveOption = (optionName: string) => {
        setLocalVariation(prev => ({
            ...prev,
            options: prev.options.filter(opt => opt.name !== optionName)
        }));
    };

    const handleSave = () => {
        if (localVariation.type.trim() && localVariation.options.length > 0) {
            onSave(localVariation);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">{variation ? 'Varyasyonu Düzenle' : 'Yeni Varyasyon Ekle'}</h2>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Varyasyon Başlığı (örn: Beden, Malzeme)</label>
                        <input type="text" value={localVariation.type} onChange={e => setLocalVariation(prev => ({ ...prev, type: e.target.value }))} className="w-full bg-slate-50 p-2 rounded-md border border-slate-300" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Seçenekler</label>
                        <div className="space-y-2">
                            {localVariation.options.map((opt, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                                    <span className="flex-grow font-medium text-slate-800">{opt.name}</span>
                                    <span className="text-sm text-slate-500">SKU: {opt.sku || '-'}</span>
                                    <span className="text-sm text-slate-500">Fiyat: ${opt.price.toFixed(2)}</span>
                                    <span className="text-sm text-slate-500">Stok: {opt.stock}</span>
                                    <button type="button" onClick={() => handleRemoveOption(opt.name)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-slate-200 mt-3 space-y-3 bg-slate-50 rounded-md">
                            <h4 className="text-sm font-semibold">Yeni Seçenek Ekle</h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Seçenek Adı *</label>
                                    <input type="text" value={newOption.name} onChange={e => setNewOption(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-white p-2 text-sm rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">SKU (Opsiyonel)</label>
                                    <input type="text" value={newOption.sku} onChange={e => setNewOption(prev => ({ ...prev, sku: e.target.value }))} className="w-full bg-white p-2 text-sm rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Fiyat ($) *</label>
                                    <input type="number" step="0.01" value={newOption.price} onChange={e => setNewOption(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} className="w-full bg-white p-2 text-sm rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 block">Stok *</label>
                                    <input type="number" value={newOption.stock} onChange={e => setNewOption(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))} className="w-full bg-white p-2 text-sm rounded-md border border-slate-300" />
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="button" onClick={handleAddOption} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm mt-2">Seçenek Ekle</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300">İptal</button>
                    <button type="button" onClick={handleSave} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Kaydet</button>
                </div>
            </div>
        </div>
    );
};


interface ProductEditPageProps {
    product?: Product;
    onSave: (product: Product) => void;
    navigate: (path: string) => void;
}

const defaultProduct: Product = {
    id: '',
    name: '', sku: '', images: [], category: '', subcategory: '', tags: [],
    price: { min: 0, max: 0 }, isFavorite: false, description: '',
    isPOD: false,
    variations: [], variants: [],
    shippingInfo: { weight: '', dimensions: '', shippingCosts: { eu: 0, usa: 0 } },
};

const presetVariations: Record<string, Variation> = {
    'Renk': {
        type: 'Renk',
        options: [
            { name: 'Siyah', value: '#000000' }, { name: 'Beyaz', value: '#FFFFFF' },
            { name: 'Kırmızı', value: '#FF0000' }, { name: 'Mavi', value: '#0000FF' },
            { name: 'Yeşil', value: '#008000' }, { name: 'Sarı', value: '#FFFF00' },
            { name: 'Gri', value: '#808080' },
        ].map(opt => ({ ...opt, price: 0, stock: 0, sku: '' })),
    },
    'Beden': { type: 'Beden', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({ name: size, value: size, price: 0, stock: 0, sku: '' })) },
    'Ayakkabı Numarası': { type: 'Ayakkabı Numarası', options: Array.from({ length: 11 }, (_, i) => 36 + i).map(num => ({ name: String(num), value: String(num), price: 0, stock: 0, sku: '' })) }
};

// FIX: Switched prop type definitions from `interface` with `extends` to `type` with an intersection (&).
// This resolves a series of TypeScript errors where properties were not being correctly inherited from the base HTML attribute types.
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; };
const Input = ({ hasError, className, ...props }: InputProps) => <input {...props} className={`w-full bg-slate-50 p-2 rounded-md border focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition ${hasError ? 'border-red-500' : 'border-slate-300'} ${className || ''}`} />;

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean; };
const Textarea = ({ hasError, className, ...props }: TextareaProps) => <textarea {...props} className={`w-full bg-slate-50 p-2 rounded-md border focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition ${hasError ? 'border-red-500' : 'border-slate-300'} ${className || ''}`} />;

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean; };
const Select = ({ hasError, className, children, ...props }: SelectProps) => <select {...props} className={`w-full bg-slate-50 p-2 rounded-md border focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition disabled:bg-slate-200 disabled:cursor-not-allowed ${hasError ? 'border-red-500' : 'border-slate-300'} ${className || ''}`}>{children}</select>;

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} className={`text-sm font-bold text-slate-700 mb-1 block ${props.className || ''}`}>{props.children}</label>;

const Card = ({ children, title, hasError }: { children?: React.ReactNode, title: string, hasError?: boolean }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border ${hasError ? 'border-red-500' : 'border-slate-200'}`}>
        <h2 className="text-lg font-bold text-dark-blue border-b border-slate-200 pb-3 mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FieldError = ({ message }: { message?: string }) => message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

const ProductEditPage: React.FC<ProductEditPageProps> = ({ product, onSave, navigate }) => {
    const [formData, setFormData] = useState<Product>(product || defaultProduct);
    const [imageInput, setImageInput] = useState('');
    const [categories] = useState<CategoryType[]>(initialCategories);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
    const [editingVariationIndex, setEditingVariationIndex] = useState<number | null>(null);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);

    const isEditMode = Boolean(product);

    const validate = (): boolean => {
        const newErrors: Partial<Record<string, string>> = {};

        if (!formData.name.trim()) newErrors.name = "Ürün adı zorunludur.";
        if ((!formData.variations || formData.variations.length === 0) && (!formData.price.min || formData.price.min <= 0)) newErrors.price = "Fiyat 0'dan büyük olmalıdır.";
        if (formData.images.length === 0) newErrors.images = "En az bir görsel eklenmelidir.";
        if (!formData.category) newErrors.category = "Kategori seçimi zorunludur.";
        if (formData.shippingInfo.shippingCosts.eu <= 0 || formData.shippingInfo.shippingCosts.usa <= 0) newErrors.shipping = "Kargo ücretleri 0'dan büyük olmalıdır.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenVariationModal = (index: number | null) => {
        setEditingVariationIndex(index);
        setIsVariationModalOpen(true);
    };

    const handleSaveVariation = (variation: Variation) => {
        setFormData(prev => {
            const newVariations = [...(prev.variations || [])];
            if (editingVariationIndex !== null) {
                newVariations[editingVariationIndex] = variation;
            } else {
                if (!newVariations.some(v => v.type === variation.type)) {
                    newVariations.push(variation);
                }
            }
            return { ...prev, variations: newVariations };
        });
        setIsVariationModalOpen(false);
        setEditingVariationIndex(null);
    };

    const handleAddPresetVariation = (presetType: string) => {
        if (formData.variations?.some(v => v.type === presetType)) return;
        const preset = presetVariations[presetType];
        if (preset) {
            setFormData(prev => ({ ...prev, variations: [...(prev.variations || []), JSON.parse(JSON.stringify(preset))] }));
        }
    };

    const handleOptionChange = (variationIndex: number, optionName: string, field: keyof VariationOption, value: any) => {
        setFormData(prev => {
            const newVariations = [...(prev.variations || [])];
            const variation = newVariations[variationIndex];
            const optionIndex = variation.options.findIndex(opt => opt.name === optionName);
            if (optionIndex > -1) {
                (variation.options[optionIndex] as any)[field] = value;
            }
            return { ...prev, variations: newVariations };
        });
    };

    const handleSaveColor = (newColorOption: VariationOption) => {
        setFormData(prev => {
            const newVariations = [...(prev.variations || [])];
            const colorVarIndex = newVariations.findIndex(v => v.type === 'Renk');
            if (colorVarIndex > -1) {
                if (!newVariations[colorVarIndex].options.some(o => o.name.toLowerCase() === newColorOption.name.toLowerCase())) {
                    newVariations[colorVarIndex].options.push(newColorOption);
                }
            }
            return { ...prev, variations: newVariations };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => {
                const newState = { ...prev, [name]: value };
                if (name === 'category') {
                    newState.subcategory = ''; // Reset subcategory when main category changes
                }
                return newState;
            });
        }
    };

    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, ...path: (string | number)[]) => {
        const { name, value } = e.target;
        const val = e.target.type === 'number' ? parseFloat(value) || 0 : value;

        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let current: any = newState;

            for (let i = 0; i < path.length; i++) {
                current = current[path[i]];
            }

            current[name] = val;

            if (path.length === 1 && path[0] === 'price' && name === 'min' && (!newState.variations || newState.variations.length === 0)) {
                newState.price.max = val;
            }

            return newState;
        });
    };

    const handleAddImage = () => {
        if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
            setImageInput('');
        }
    };
    const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newImageUrls = files.map(file => URL.createObjectURL(file as Blob));
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
        }
    };
    const handleRemoveImage = (imageToRemove: string) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== imageToRemove) }));
    };

    const removeVariation = (index: number) => {
        setFormData(prev => ({ ...prev, variations: prev.variations!.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            alert("Lütfen tüm zorunlu (*) alanları doğru bir şekilde doldurun.");
            return;
        }

        const finalData = { ...formData };
        const variationsWithOptions = finalData.variations?.filter(v => v.options && v.options.length > 0) || [];

        if (variationsWithOptions.length > 0) {
            const combinations = variationsWithOptions.reduce((acc, variation) => {
                const res: any[] = [];
                if (!acc || acc.length === 0) {
                    return variation.options.map(opt => [{ type: variation.type, option: opt }]);
                }
                acc.forEach(existingCombo => {
                    variation.options.forEach(option => {
                        res.push([...existingCombo, { type: variation.type, option: option }]);
                    });
                });
                return res;
            }, [] as any[]);

            finalData.variants = combinations.map((combo: { type: string; option: VariationOption }[]) => {
                const attributes: Record<string, string> = {};
                const skuParts: string[] = [];
                let price = 0;
                let stock = Infinity;

                combo.forEach(item => {
                    attributes[item.type] = item.option.name;
                    skuParts.push(item.option.sku || item.option.name.substring(0, 3).toUpperCase());
                    price += item.option.price;
                    stock = Math.min(stock, item.option.stock);
                });

                return {
                    sku: (finalData.sku || 'PROD') + '-' + skuParts.join('-'),
                    attributes,
                    price,
                    stock: stock === Infinity ? 0 : stock,
                    shippingCostModifier: 0,
                };
            });

            const allPrices = finalData.variants.map(v => v.price);
            if (allPrices.length > 0) {
                finalData.price.min = Math.min(...allPrices);
                finalData.price.max = Math.max(...allPrices);
            }
        } else {
            finalData.price.max = finalData.price.min;
            finalData.variants = [{
                sku: finalData.sku || `SKU-${Date.now()}`,
                attributes: {},
                price: finalData.price.min,
                stock: 100,
                shippingCostModifier: 0,
            }];
        }

        onSave(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isVariationModalOpen && (
                <VariationModal
                    variation={editingVariationIndex !== null ? formData.variations![editingVariationIndex] : null}
                    onClose={() => setIsVariationModalOpen(false)}
                    onSave={handleSaveVariation}
                />
            )}
            {isColorModalOpen && <ColorPickerModal onClose={() => setIsColorModalOpen(false)} onSave={handleSaveColor} />}

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-dark-blue">{isEditMode ? `Ürünü Düzenle` : 'Yeni Ürün Oluştur'}</h1>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/products')} className="bg-slate-200 text-dark-blue font-bold py-2 px-6 rounded-lg hover:bg-slate-300">İptal</button>
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">
                        {isEditMode ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6">
                    <Card title="Temel Bilgiler">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Ürün Adı *</Label>
                                <Input type="text" name="name" value={formData.name} onChange={handleChange} required hasError={!!errors.name} />
                                <FieldError message={errors.name} />
                            </div>
                            <div><Label>Ana SKU</Label><Input type="text" name="sku" value={formData.sku} onChange={handleChange} /></div>
                        </div>
                        {(!formData.variations || formData.variations.length === 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Fiyat *</Label>
                                    <Input type="number" step="0.01" name="min" value={formData.price.min} onChange={(e) => handleNestedChange(e, 'price')} required hasError={!!errors.price} />
                                    <FieldError message={errors.price} />
                                </div>
                            </div>
                        )}
                        <div><Label>Açıklama</Label><Textarea name="description" value={formData.description} onChange={handleChange} rows={8}></Textarea></div>
                        <div className="pt-4 border-t border-slate-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isPOD" checked={formData.isPOD} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                                <span className="font-semibold text-dark-blue">Bu bir POD (İsteğe Bağlı Baskı) ürünü mü?</span>
                            </label>
                        </div>
                    </Card>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-dark-blue mb-4">Varyasyonlar</h2>
                        <div className="space-y-3">
                            {formData.variations?.map((v, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-dark-blue">{v.type}</span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => handleOpenVariationModal(index)} className="p-2 text-slate-600 hover:text-primary"><PencilIcon className="w-5 h-5" /></button>
                                            <button type="button" onClick={() => removeVariation(index)} className="p-2 text-slate-600 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600 px-2 pb-1 border-b">
                                        <div className="col-span-3">Seçenek</div>{v.type === 'Renk' && <div className="col-span-1 text-center">Renk</div>}<div className="col-span-3">SKU</div><div className="col-span-2">Fiyat*</div><div className="col-span-2">Stok*</div>
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        {v.options.map((opt) => (
                                            <div key={opt.name} className="grid grid-cols-12 gap-2 items-center px-2 py-1 hover:bg-slate-100 rounded">
                                                <div className="col-span-3 font-medium text-sm">{opt.name}</div>
                                                {v.type === 'Renk' && (<div className="col-span-1 flex justify-center"><div className="w-5 h-5 rounded-full border border-slate-300" style={{ backgroundColor: opt.value }} /></div>)}
                                                <div className="col-span-3"><input type="text" placeholder="Opsiyonel" value={opt.sku || ''} onChange={(e) => handleOptionChange(index, opt.name, 'sku', e.target.value)} className="w-full text-xs p-1 rounded bg-white border border-slate-300" /></div>
                                                <div className="col-span-2"><input type="number" step="0.01" required value={opt.price} onChange={(e) => handleOptionChange(index, opt.name, 'price', parseFloat(e.target.value))} className="w-full text-xs p-1 rounded bg-white border border-slate-300" /></div>
                                                <div className="col-span-2"><input type="number" required value={opt.stock} onChange={(e) => handleOptionChange(index, opt.name, 'stock', parseInt(e.target.value))} className="w-full text-xs p-1 rounded bg-white border border-slate-300" /></div>
                                            </div>
                                        ))}
                                        {v.type === 'Renk' && (<button type="button" onClick={() => setIsColorModalOpen(true)} className="text-sm font-semibold text-primary hover:underline mt-2 ml-2">+ Renk Ekle</button>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t pt-4 flex items-center flex-wrap gap-2">
                            <button type="button" onClick={() => handleOpenVariationModal(null)} className="font-semibold text-sm bg-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 inline-flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Özel Varyasyon</button>
                            <div className="h-6 border-l border-slate-300 mx-2"></div>
                            <span className="text-sm font-medium text-slate-600">Hazır Ekle:</span>
                            <button type="button" onClick={() => handleAddPresetVariation('Renk')} disabled={formData.variations?.some(v => v.type === 'Renk')} className="font-semibold text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">Renk</button>
                            <button type="button" onClick={() => handleAddPresetVariation('Beden')} disabled={formData.variations?.some(v => v.type === 'Beden')} className="font-semibold text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">Beden</button>
                            <button type="button" onClick={() => handleAddPresetVariation('Ayakkabı Numarası')} disabled={formData.variations?.some(v => v.type === 'Ayakkabı Numarası')} className="font-semibold text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">Ayakkabı Numarası</button>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5 space-y-6">
                    <Card title="Görseller" hasError={!!errors.images}>
                        <div>
                            <Label>Görsel URL'i Ekle</Label>
                            <div className="mt-1 flex gap-2">
                                <Input type="url" value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="https://ornek.com/gorsel.jpg" />
                                <button type="button" onClick={handleAddImage} className="font-semibold bg-slate-200 px-4 rounded-md hover:bg-slate-300 flex-shrink-0">Ekle</button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="file-upload" className="w-full text-center cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md border border-slate-300 flex items-center justify-center gap-2">
                                <CameraIcon className="w-5 h-5" /> Bilgisayardan Yükle
                            </label>
                            <input id="file-upload" type="file" className="hidden" onChange={handleImageFileChange} accept="image/*" multiple />
                        </div>
                        <FieldError message={errors.images} />
                        <div className="grid grid-cols-3 gap-3">
                            {formData.images.map(img => (
                                <div key={img} className="relative aspect-square">
                                    <img src={img} alt="product" className="w-full h-full object-cover rounded-md border border-slate-200" />
                                    <button type="button" onClick={() => handleRemoveImage(img)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"><XMarkIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card title="Kategorizasyon">
                        <div>
                            <Label>Kategori *</Label>
                            <Select name="category" value={formData.category} onChange={handleChange} required hasError={!!errors.category}>
                                <option value="">Kategori Seçin</option>
                                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </Select>
                            <FieldError message={errors.category} />
                        </div>
                        <div>
                            <Label>Alt Kategori</Label>
                            <Select
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                disabled={!formData.category || (categories.find(c => c.name === formData.category)?.subcategories.length === 0)}
                            >
                                <option value="">Alt Kategori Seçin</option>
                                {formData.category && categories.find(c => c.name === formData.category)?.subcategories.map(sub => (
                                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                                ))}
                            </Select>
                        </div>
                    </Card>
                    <Card title="Kargo Ücretleri *" hasError={!!errors.shipping}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Kargo Ücreti (EU)</Label>
                                <Input type="number" step="0.01" name="eu" value={formData.shippingInfo.shippingCosts.eu} onChange={(e) => handleNestedChange(e, 'shippingInfo', 'shippingCosts')} hasError={!!errors.shipping} />
                            </div>
                            <div>
                                <Label>Kargo Ücreti (USA)</Label>
                                <Input type="number" step="0.01" name="usa" value={formData.shippingInfo.shippingCosts.usa} onChange={(e) => handleNestedChange(e, 'shippingInfo', 'shippingCosts')} hasError={!!errors.shipping} />
                            </div>
                        </div>
                        <FieldError message={errors.shipping} />
                    </Card>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => navigate('/admin/products')} className="bg-slate-200 text-dark-blue font-bold py-2 px-6 rounded-lg hover:bg-slate-300">İptal</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-focus">{isEditMode ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}</button>
            </div>
        </form>
    );
};

export default ProductEditPage;