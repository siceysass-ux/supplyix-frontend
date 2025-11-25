import React, { useState, useEffect } from 'react';

interface BlogPostPageProps {
    slug: string;
    navigate: (path: string) => void;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: string;
    authorAvatar?: string;
    category: {
        id: string;
        name: string;
        slug: string;
        color?: string;
    };
    tags: string;
    views: number;
    readingTime: number;
    createdAt: string;
    publishedAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, navigate }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
        fetchRelatedPosts();
    }, [slug]);

    // SEO: Update meta tags when post loads
    useEffect(() => {
        if (!post) return;

        const siteUrl = 'https://www.supplyix.com';
        const postUrl = `${siteUrl}/blog/${post.slug}`;
        const imageUrl = post.coverImage || `${siteUrl}/logo.png`;

        // Update document title
        document.title = post.metaTitle || `${post.title} | Supplyix Blog`;

        // Update or create meta tags
        const updateMetaTag = (name: string, content: string, property?: boolean) => {
            const attr = property ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        // Basic SEO
        updateMetaTag('description', post.metaDescription || post.excerpt);
        updateMetaTag('keywords', post.keywords || '');
        updateMetaTag('author', post.author);

        // Open Graph (Facebook)
        updateMetaTag('og:type', 'article', true);
        updateMetaTag('og:url', postUrl, true);
        updateMetaTag('og:title', post.metaTitle || post.title, true);
        updateMetaTag('og:description', post.metaDescription || post.excerpt, true);
        updateMetaTag('og:image', imageUrl, true);
        updateMetaTag('og:site_name', 'Supplyix', true);
        updateMetaTag('article:published_time', post.publishedAt || post.createdAt, true);
        updateMetaTag('article:author', post.author, true);
        updateMetaTag('article:section', post.category.name, true);

        // Twitter Cards
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:url', postUrl);
        updateMetaTag('twitter:title', post.metaTitle || post.title);
        updateMetaTag('twitter:description', post.metaDescription || post.excerpt);
        updateMetaTag('twitter:image', imageUrl);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = postUrl;

        // Structured Data (JSON-LD)
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: imageUrl,
            author: {
                '@type': 'Person',
                name: post.author
            },
            publisher: {
                '@type': 'Organization',
                name: 'Supplyix',
                logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/logo.png`
                }
            },
            datePublished: post.publishedAt || post.createdAt,
            dateModified: post.createdAt,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': postUrl
            },
            keywords: post.keywords || '',
            articleSection: post.category.name,
            wordCount: post.content.split(' ').length,
            timeRequired: `PT${post.readingTime}M`
        };

        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);

        // Cleanup function
        return () => {
            document.title = 'Supplyix - Dropshipping Platformu';
        };
    }, [post]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/blog/posts/${slug}`);
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedPosts = async () => {
        try {
            const response = await fetch(`/api/blog/posts/${slug}/related`);
            const data = await response.json();
            setRelatedPosts(data);
        } catch (error) {
            console.error('Error fetching related posts:', error);
        }
    };

    const shareOnTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    };

    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link kopyalandı!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-dark-blue dark:text-white mb-4">Blog yazısı bulunamadı</h2>
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-primary hover:underline"
                    >
                        Blog sayfasına dön
                    </button>
                </div>
            </div>
        );
    }

    const tags = JSON.parse(post.tags || '[]');
    const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Back Button */}
            <div className="container mx-auto px-6 pt-8">
                <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Blog'a Dön
                </button>
            </div>

            {/* Hero Section */}
            <article className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Category & Meta */}
                <div className="flex items-center gap-4 mb-6">
                    <span
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: post.category.color || '#FF6B35' }}
                    >
                        {post.category.name}
                    </span>
                    <span className="text-gray-500 dark:text-slate-500 text-sm">{publishDate}</span>
                    <span className="text-gray-500 dark:text-slate-500 text-sm">•</span>
                    <span className="text-gray-500 dark:text-slate-500 text-sm">{post.readingTime} dk okuma</span>
                    <span className="text-gray-500 dark:text-slate-500 text-sm">•</span>
                    <span className="text-gray-500 dark:text-slate-500 text-sm">{post.views} görüntülenme</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-dark-blue dark:text-white mb-6 leading-tight">
                    {post.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-3 mb-8">
                    {post.authorAvatar ? (
                        <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                                {post.author.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-dark-blue dark:text-white">{post.author}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-500">Yazar</p>
                    </div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="mb-12 rounded-2xl overflow-hidden">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose dark:prose-invert prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
                        {tags.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Share Buttons */}
                <div className="mb-12">
                    <h3 className="text-lg font-semibold text-dark-blue dark:text-white mb-4">Paylaş</h3>
                    <div className="flex gap-3">
                        <button
                            onClick={shareOnTwitter}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                            Twitter
                        </button>
                        <button
                            onClick={shareOnFacebook}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                        <button
                            onClick={shareOnLinkedIn}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095196] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                        </button>
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Kopyala
                        </button>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold text-dark-blue dark:text-white mb-6">İlgili Yazılar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <div
                                    key={relatedPost.id}
                                    onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                                    className="cursor-pointer group"
                                >
                                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                                        {relatedPost.coverImage ? (
                                            <img
                                                src={relatedPost.coverImage}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-dark-blue/20" />
                                        )}
                                    </div>
                                    <h4 className="font-semibold text-dark-blue dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                        {relatedPost.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                                        {relatedPost.readingTime} dk okuma
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default BlogPostPage;
