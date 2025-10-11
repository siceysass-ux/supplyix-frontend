export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
    id: string;
    name: string;
    productCount: number;
    subcategories: SubCategory[];
}

export const initialCategories: Category[] = [
    { 
        id: 'cat-1', 
        name: 'Elektronik', 
        productCount: 25,
        subcategories: [
            { id: 'sub-1-1', name: 'Giyilebilir Teknoloji' },
            { id: 'sub-1-2', name: 'Ses Sistemleri' },
            { id: 'sub-1-3', name: 'Kameralar' },
        ]
    },
    { 
        id: 'cat-2', 
        name: 'Giyim', 
        productCount: 42,
        subcategories: [
            { id: 'sub-2-1', name: 'Kadın Giyim' },
            { id: 'sub-2-2', name: 'Erkek Giyim' },
        ]
    },
    { id: 'cat-3', name: 'Ev & Yaşam', productCount: 31, subcategories: [] },
    { id: 'cat-4', name: 'Spor & Outdoor', productCount: 18, subcategories: [] },
    { id: 'cat-5', name: 'Kişisel Bakım', productCount: 22, subcategories: [] },
];
