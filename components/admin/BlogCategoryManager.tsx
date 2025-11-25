import React, { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    postCount: number;
}

interface BlogCategoryManagerProps {
    onClose: () => void;
}

const BlogCategoryManager: React.FC<BlogCategoryManagerProps> = ({ onClose }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        icon: '📝'
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/blog/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `/api/blog/categories/${editingId}`
                : '/api/blog/categories';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchCategories();
                resetForm();
                alert(editingId ? 'Kategori güncellendi!' : 'Kategori oluşturuldu!');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Kategori kaydedilirken hata oluştu');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
            color: category.color || '#3b82f6',
            icon: category.icon || '📝'
        });
        setIsCreating(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

        try {
            const response = await fetch(`/api/blog/categories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchCategories();
                alert('Kategori silindi!');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Kategori silinirken hata oluştu');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', color: '#3b82f6', icon: '📝' });
        setIsCreating(false);
        setEditingId(null);
    };

    const commonIcons = ['📝', '💡', '🚀', '📊', '🎯', '💼', '🔧', '📱', '🌟', '🎨'];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-dark-blue dark:text-white">Blog Kategorileri</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Create/Edit Form */}
                    {isCreating ? (
                        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-dark-blue dark:text-white">
                                {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Kategori Adı *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Renk</label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full h-10 px-2 border border-gray-300 dark:border-slate-600 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">İkon</label>
                                <div className="flex gap-2 mb-2">
                                    {commonIcons.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`text-2xl p-2 rounded-lg border-2 ${formData.icon === icon ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-slate-600'}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white"
                                    placeholder="veya emoji girin..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus">
                                    {editingId ? 'Güncelle' : 'Oluştur'}
                                </button>
                                <button type="button" onClick={resetForm} className="bg-gray-200 dark:bg-slate-600 text-dark-blue dark:text-white px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500">
                                    İptal
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus mb-6"
                        >
                            + Yeni Kategori Ekle
                        </button>
                    )}

                    {/* Categories List */}
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{category.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-dark-blue dark:text-white">{category.name}</h4>
                                        {category.description && (
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{category.description}</p>
                                        )}
                                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{category.postCount} yazı</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 px-3 py-1 text-sm font-medium"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 px-3 py-1 text-sm font-medium"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button onClick={onClose} className="bg-dark-blue text-white px-6 py-2 rounded-lg hover:bg-dark-blue/90">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogCategoryManager;
