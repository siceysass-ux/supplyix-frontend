import React, { useState, useEffect } from 'react';

interface BlogEditorPageProps {
    navigate: (path: string) => void;
    postId?: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    color?: string;
}

const BlogEditorPage: React.FC<BlogEditorPageProps> = ({ navigate, postId }) => {
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [author, setAuthor] = useState('Supplyix');
    const [categoryId, setCategoryId] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/blog/categories');
            const data = await response.json();
            setCategories(data);
            if (data.length > 0 && !categoryId) {
                setCategoryId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/blog/posts/${postId}`);
            const post = await response.json();

            setTitle(post.title);
            setExcerpt(post.excerpt);
            setContent(post.content);
            setCoverImage(post.coverImage || '');
            setAuthor(post.author);
            setCategoryId(post.categoryId);
            setTags(JSON.parse(post.tags || '[]'));
            setPublished(post.published);
            setFeatured(post.featured);
            setMetaTitle(post.metaTitle || '');
            setMetaDescription(post.metaDescription || '');
            setKeywords(JSON.parse(post.keywords || '[]'));
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3002/api/blog/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            setCoverImage(`http://localhost:3002${data.url}`);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Görsel yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !excerpt || !content || !categoryId) {
            alert('Lütfen tüm zorunlu alanları doldurun');
            return;
        }

        setLoading(true);

        const postData = {
            title,
            excerpt,
            content,
            coverImage,
            author,
            categoryId,
            tags,
            published,
            featured,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt,
            keywords
        };

        try {
            const url = postId
                ? `/api/blog/posts/${postId}`
                : '/api/blog/posts';

            const method = postId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                alert(postId ? 'Blog yazısı güncellendi!' : 'Blog yazısı oluşturuldu!');
                navigate('/admin/blog');
            } else {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Blog yazısı kaydedilirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-blue dark:text-white">
                    {postId ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
                </h1>
                <button
                    onClick={() => navigate('/admin/blog')}
                    className="text-gray-600 dark:text-slate-400 hover:text-primary"
                >
                    ← Geri Dön
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-dark-blue dark:text-white mb-4">📝 Temel Bilgiler</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Başlık * <span className="text-xs text-gray-500">(SEO için 60 karakter önerilir)</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">{title.length}/100 karakter</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Özet * <span className="text-xs text-gray-500">(160 karakter önerilir)</span>
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                            maxLength={300}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">{excerpt.length}/300 karakter</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Yazar</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Kategori *</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="">Kategori Seçin</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content - Simple Textarea */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-dark-blue dark:text-white mb-4">✍️ İçerik * (HTML Destekler)</h2>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white focus:ring-2 focus:ring-primary font-mono text-sm"
                        placeholder="<h2>Başlık</h2><p>İçerik...</p>"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        💡 HTML kullanabilirsiniz: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a href=""&gt;
                    </p>
                </div>

                {/* Cover Image */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-dark-blue dark:text-white mb-4">🖼️ Kapak Görseli</h2>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-focus"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-2">Yükleniyor...</p>}
                    {coverImage && <img src={coverImage} alt={title} className="max-w-md rounded-lg mt-4" />}
                </div>

                {/* Tags */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-dark-blue dark:text-white mb-4">🏷️ Etiketler</h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Etiket ekle..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-dark-blue dark:text-white"
                        />
                        <button type="button" onClick={addTag} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus">Ekle</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm flex items-center gap-2">
                                #{tag}
                                <button type="button" onClick={() => removeTag(tag)} className="text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* SEO */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700 space-y-4">
                    <h2 className="text-xl font-semibold text-dark-blue dark:text-white mb-4">🚀 SEO Optimizasyonu</h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">Meta Başlık (60 karakter)</label>
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder={title}
                            maxLength={60}
                            className="w-full px-4 py-2 border border-green-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">{(metaTitle || title).length}/60</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Meta Açıklama (160 karakter)</label>
                        <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder={excerpt}
                            rows={3}
                            maxLength={160}
                            className="w-full px-4 py-2 border border-green-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">{(metaDescription || excerpt).length}/160</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Anahtar Kelimeler</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                placeholder="Anahtar kelime..."
                                className="flex-1 px-4 py-2 border border-green-300 rounded-lg"
                            />
                            <button type="button" onClick={addKeyword} className="px-4 py-2 bg-green-600 text-white rounded-lg">Ekle</button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword) => (
                                <span key={keyword} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-2">
                                    {keyword}
                                    <button type="button" onClick={() => removeKeyword(keyword)} className="text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-dark-blue dark:text-white mb-4">⚙️ Yayın Ayarları</h2>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-5 h-5" />
                            <span>Yayınla</span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5" />
                            <span>Öne Çıkar</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : (postId ? '✅ Güncelle' : '🚀 Yayınla')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/blog')}
                        className="px-8 py-3 border rounded-lg hover:bg-gray-50"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogEditorPage;
