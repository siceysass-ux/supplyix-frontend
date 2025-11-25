

import React, { useState } from 'react';
import { Product } from '../../dashboard/types';
import ConfirmationModal from '../shared/ConfirmationModal';

interface ManageProductsPageProps {
    products: Product[];
    navigate: (path: string) => void;
    onDeleteProduct: (productName: string) => void;
}

const ManageProductsPage: React.FC<ManageProductsPageProps> = ({ products, navigate, onDeleteProduct }) => {
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleConfirmDelete = () => {
        if (productToDelete) {
            onDeleteProduct(productToDelete.name);
            setProductToDelete(null);
        }
    };

    return (
        <>
            {productToDelete && (
                <ConfirmationModal
                    title="Ürünü Sil"
                    message={`'${productToDelete.name}' adlı ürünü kalıcı olarak silmek istediğinizden emin misiniz?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setProductToDelete(null)}
                    confirmText="Sil"
                />
            )}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-dark-blue">Ürünleri Yönet</h2>
                    <button
                        onClick={() => navigate('/admin/product-add')}
                        className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-sm"
                    >
                        Yeni Ürün Ekle
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Ürün</th>
                                <th className="px-6 py-3">Kategori</th>
                                <th className="px-6 py-3">Stok</th>
                                <th className="px-6 py-3">Fiyat Aralığı</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {products.map(product => {
                                const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                                return (
                                    <tr key={product.name} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 flex items-center space-x-4">
                                            <img src={product.images?.[0] || ''} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                                            <span className="font-medium text-dark-blue">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4">{totalStock}</td>
                                        <td className="px-6 py-4">${product.price?.min || 0} - ${product.price?.max || 0}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => navigate(`/admin/product-edit/${encodeURIComponent(product.name)}`)} className="font-medium text-primary hover:underline">Düzenle</button>
                                            <button onClick={() => setProductToDelete(product)} className="font-medium text-red-600 hover:underline">Sil</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageProductsPage;