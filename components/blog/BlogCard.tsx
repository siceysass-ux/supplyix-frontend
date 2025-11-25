import React from 'react';

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
}

interface BlogCardProps {
    post: BlogPost;
    navigate: (path: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, navigate }) => {
    const tags = JSON.parse(post.tags || '[]');
    const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article
            className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate(`/blog/${post.slug}`)}
        >
            {/* Cover Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-dark-blue/20">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
                        style={{ backgroundColor: post.category.color || '#FF6B35' }}
                    >
                        {post.category.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-dark-blue dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-gray-600 dark:text-slate-300 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                        {post.authorAvatar ? (
                            <img
                                src={post.authorAvatar}
                                alt={post.author}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                    {post.author.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-dark-blue dark:text-white">{post.author}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500">{publishDate}</p>
                        </div>
                    </div>

                    {/* Reading Time & Views */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-500">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{post.readingTime} dk</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{post.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
