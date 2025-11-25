import React, { useState, useEffect } from 'react';
import BlogCategoryManager from './BlogCategoryManager';

interface BlogManagementPageProps {
    navigate: (path: string) => void;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: {
        name: string;
        color?: string;
    };
    published: boolean;
    featured: boolean;
    views: number;
    createdAt: string;
}

const BlogManagementPage: React.FC<BlogManagementPageProps> = ({ navigate }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                published: filter === 'all' ? '' : filter === 'published' ? 'true' : 'false',
                limit: '100'
            });

            const response = await fetch(`/api/blog/posts?${params}`);
            const data = await response.json();
            setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;

        try {
            await fetch(`/api/blog/posts/${id}`, {
                method: 'DELETE'
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Blog yazısı silinirken bir hata oluştu');
        }
    };

    const togglePublish = async (post: BlogPost) => {
        try {
            await fetch(`/api/blog/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !post.published })
            });
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Blog yazısı güncellenirken bir hata oluştu');
        }
    };

    const toggleFeatured = async (post: BlogPost) => {
        try {
            await fetch(`/api/blog/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !post.featured })
            });
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Blog yazısı güncellenirken bir hata oluştu');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-blue dark:text-white">Blog Yönetimi</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCategoryManager(true)}
                        className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        🏷️ Kategorileri Yönet
                    </button>
                    <button
                        onClick={() => navigate('/admin/blog-editor')}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition-colors"
                    >
                        + Yeni Blog Yazısı
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Tümü
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'published'
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Yayınlananlar
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'draft'
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                        }`}
                >
                    Taslaklar
                </button>
            </div>

            {/* Posts Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : posts.length > 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                                    Başlık
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                                    Görüntülenme
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                                    Tarih
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-medium text-dark-blue dark:text-white">
                                                    {post.title}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                                                    {post.excerpt}
                                                </div>
                                            </div>
                                            {post.featured && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                                    Öne Çıkan
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className="px-2 py-1 rounded text-xs font-semibold text-white"
                                            style={{ backgroundColor: post.category.color || '#FF6B35' }}
                                        >
                                            {post.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${post.published
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.published ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                        {post.views}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/blog/${post.slug}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Görüntüle"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => togglePublish(post)}
                                                className="text-green-600 hover:text-green-900"
                                                title={post.published ? 'Taslağa Al' : 'Yayınla'}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => toggleFeatured(post)}
                                                className="text-yellow-600 hover:text-yellow-900"
                                                title={post.featured ? 'Öne Çıkarmayı Kaldır' : 'Öne Çıkar'}
                                            >
                                                <svg className="w-5 h-5" fill={post.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Sil"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
                    <svg className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">
                        Henüz blog yazısı yok
                    </h3>
                    <p className="text-gray-500 dark:text-slate-500 mb-4">
                        İlk blog yazınızı oluşturarak başlayın
                    </p>
                    <button
                        onClick={() => navigate('/admin/blog-editor')}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition-colors"
                    >
                        + Yeni Blog Yazısı
                    </button>
                </div>
            )}

            {/* Category Manager Modal */}
            {showCategoryManager && (
                <BlogCategoryManager onClose={() => setShowCategoryManager(false)} />
            )}
        </div>
    );
};

export default BlogManagementPage;
