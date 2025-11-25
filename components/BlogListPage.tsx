import React, { useState, useEffect } from 'react';
import BlogCard from './blog/BlogCard';

interface BlogListPageProps {
    navigate: (path: string) => void;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    author: string;
    authorAvatar?: string;
    category: {
        name: string;
        slug: string;
        color?: string;
    };
    tags: string;
    views: number;
    readingTime: number;
    createdAt: string;
    publishedAt?: string;
    featured: boolean;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    color?: string;
    postCount: number;
}

const BlogListPage: React.FC<BlogListPageProps> = ({ navigate }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, searchQuery, sortBy, currentPage]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/blog/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '9',
                published: 'true',
                sort: sortBy
            });

            if (selectedCategory) {
                params.append('category', selectedCategory);
            }

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const response = await fetch(`/api/blog/posts?${params}`);
            const data = await response.json();

            setPosts(data.posts);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const featuredPosts = posts.filter(post => post.featured).slice(0, 1);
    const regularPosts = posts.filter(post => !post.featured || featuredPosts.length === 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-dark-blue to-primary/80 text-white py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold mb-4">Blog</h1>
                        <p className="text-xl text-white/90">
                            Dropshipping, e-ticaret ve dijital pazarlama hakkında en güncel içerikler
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-12">
                {/* Filters & Search */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Blog yazılarında ara..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-6 py-4 pl-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Categories & Sort */}
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory('');
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === ''
                                    ? 'bg-primary text-white'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Tümü
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setSelectedCategory(category.slug);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.slug
                                        ? 'text-white'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                        }`}
                                    style={selectedCategory === category.slug ? { backgroundColor: category.color || '#FF6B35' } : {}}
                                >
                                    {category.name} ({category.postCount})
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary"
                        >
                            <option value="latest">En Yeni</option>
                            <option value="popular">En Popüler</option>
                            <option value="oldest">En Eski</option>
                        </select>
                    </div>
                </div>

                {/* Featured Post */}
                {featuredPosts.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-dark-blue dark:text-white mb-6">Öne Çıkan</h2>
                        <div
                            className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group"
                            onClick={() => navigate(`/blog/${featuredPosts[0].slug}`)}
                        >
                            {featuredPosts[0].coverImage ? (
                                <img
                                    src={featuredPosts[0].coverImage}
                                    alt={featuredPosts[0].title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-dark-blue/20" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <span
                                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
                                    style={{ backgroundColor: featuredPosts[0].category.color || '#FF6B35' }}
                                >
                                    {featuredPosts[0].category.name}
                                </span>
                                <h3 className="text-3xl font-bold mb-3">{featuredPosts[0].title}</h3>
                                <p className="text-white/90 mb-4 line-clamp-2">{featuredPosts[0].excerpt}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span>{featuredPosts[0].author}</span>
                                    <span>•</span>
                                    <span>{featuredPosts[0].readingTime} dk okuma</span>
                                    <span>•</span>
                                    <span>{featuredPosts[0].views} görüntülenme</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blog Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : regularPosts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {regularPosts.map((post) => (
                                <BlogCard key={post.id} post={post} navigate={navigate} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-dark-blue dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Önceki
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-slate-800 text-dark-blue dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-dark-blue dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <svg className="w-20 h-20 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">Blog yazısı bulunamadı</h3>
                        <p className="text-gray-500 dark:text-slate-500">Farklı bir kategori veya arama terimi deneyin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListPage;
