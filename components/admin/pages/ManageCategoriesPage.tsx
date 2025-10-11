import React, { useState } from 'react';
import { Category, SubCategory } from '../../../data/categories';
import { TrashIcon, PencilIcon } from '../../dashboard/icons/outline';

interface CategoryModalProps {
    category?: Category | null;
    onClose: () => void;
    onSave: (category: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onClose, onSave }) => {
    const [name, setName] = useState(category?.name || '');
    const [subcategories, setSubcategories] = useState<SubCategory[]>(category?.subcategories || []);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');

    const handleAddSubcategory = () => {
        if (newSubCategoryName.trim() && !subcategories.some(sc => sc.name.toLowerCase() === newSubCategoryName.trim().toLowerCase())) {
            const newSub: SubCategory = {
                id: `sub-${Date.now()}`,
                name: newSubCategoryName.trim(),
            };
            setSubcategories([...subcategories, newSub]);
            setNewSubCategoryName('');
        }
    };
    
    const handleRemoveSubcategory = (id: string) => {
        setSubcategories(subcategories.filter(sc => sc.id !== id));
    };

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({
            id: category?.id || `cat-${Date.now()}`,
            name,
            productCount: category?.productCount || 0,
            subcategories,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-dark-blue">{category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Ana Kategori Adı *</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 mt-1 p-2 rounded-md border border-slate-200" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Alt Kategoriler (Opsiyonel)</label>
                        <div className="flex gap-2 mt-1">
                            <input type="text" value={newSubCategoryName} onChange={e => setNewSubCategoryName(e.target.value)} placeholder="Alt kategori adı" className="flex-grow bg-slate-100 p-2 rounded-md border border-slate-200" />
                            <button type="button" onClick={handleAddSubcategory} className="bg-primary text-white font-semibold px-4 rounded-lg text-sm">Ekle</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {subcategories.map(sub => (
                                <span key={sub.id} className="flex items-center gap-1 bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full">
                                    {sub.name}
                                    <button type="button" onClick={() => handleRemoveSubcategory(sub.id)}>&times;</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="bg-slate-200 text-dark-blue font-bold py-2 px-4 rounded-lg hover:bg-slate-300">İptal</button>
                    <button onClick={handleSave} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Kaydet</button>
                </div>
            </div>
        </div>
    );
};

interface ManageCategoriesPageProps {
    categories: Category[];
}

const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ categories: initialCategories }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleOpenModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };
    
    const handleSaveCategory = (category: Category) => {
        if (editingCategory) { // Update existing
            setCategories(categories.map(c => c.id === category.id ? category : c));
        } else { // Add new
            setCategories([...categories, category]);
        }
        handleCloseModal();
    };

    const handleDeleteCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };
    
    return (
        <>
        {isModalOpen && <CategoryModal category={editingCategory} onClose={handleCloseModal} onSave={handleSaveCategory} />}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-dark-blue">Kategorileri Yönet</h2>
                 <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm">
                    Yeni Kategori Ekle
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Kategori Adı</th>
                            <th className="px-6 py-3">Alt Kategoriler</th>
                            <th className="px-6 py-3">Ürün Sayısı</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 font-medium text-dark-blue">{category.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {category.subcategories.map(sub => (
                                            <span key={sub.id} className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">{sub.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{category.productCount}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                     <button onClick={() => handleOpenModal(category)} className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors" title="Düzenle">
                                        <PencilIcon className="w-5 h-5"/>
                                     </button>
                                     <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-red-600 hover:bg-red-500/10 rounded-md transition-colors" title="Sil">
                                        <TrashIcon className="w-5 h-5"/>
                                     </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default ManageCategoriesPage;