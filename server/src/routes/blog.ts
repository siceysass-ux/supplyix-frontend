import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for blog image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/blog');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Helper function to generate slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// ============ BLOG POSTS ============

// Get all blog posts (with filters)
router.get('/posts', async (req, res) => {
    try {
        const {
            page = '1',
            limit = '9',
            category,
            search,
            featured,
            published = 'true',
            sort = 'latest'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (published === 'true') {
            where.published = true;
        }

        if (featured === 'true') {
            where.featured = true;
        }

        if (category) {
            const cat = await prisma.blogCategory.findFirst({
                where: { slug: category as string }
            });
            if (cat) {
                where.categoryId = cat.id;
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string } },
                { excerpt: { contains: search as string } },
                { content: { contains: search as string } }
            ];
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'popular') {
            orderBy = { views: 'desc' };
        } else if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        }

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: {
                    category: true
                },
                orderBy,
                skip,
                take: limitNum
            }),
            prisma.blogPost.count({ where })
        ]);

        res.json({
            posts,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

// Get single blog post by slug
router.get('/posts/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: {
                category: true
            }
        });

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        // Increment view count
        await prisma.blogPost.update({
            where: { id: post.id },
            data: { views: post.views + 1 }
        });

        res.json(post);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});

// Get related posts
router.get('/posts/:slug/related', async (req, res) => {
    try {
        const { slug } = req.params;

        const post = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        const relatedPosts = await prisma.blogPost.findMany({
            where: {
                AND: [
                    { id: { not: post.id } },
                    { published: true },
                    { categoryId: post.categoryId }
                ]
            },
            include: {
                category: true
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
        });

        res.json(relatedPosts);
    } catch (error) {
        console.error('Error fetching related posts:', error);
        res.status(500).json({ error: 'Failed to fetch related posts' });
    }
});

// Create new blog post (admin only)
router.post('/posts', async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content,
            coverImage,
            author,
            authorAvatar,
            categoryId,
            tags,
            published,
            featured,
            metaTitle,
            metaDescription,
            keywords
        } = req.body;

        const slug = generateSlug(title);
        const readingTime = calculateReadingTime(content);

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                coverImage,
                author,
                authorAvatar,
                categoryId,
                tags: JSON.stringify(tags || []),
                published: published || false,
                featured: featured || false,
                readingTime,
                metaTitle,
                metaDescription,
                keywords: JSON.stringify(keywords || []),
                publishedAt: published ? new Date() : null
            },
            include: {
                category: true
            }
        });

        // Update category post count
        if (published) {
            await prisma.blogCategory.update({
                where: { id: categoryId },
                data: { postCount: { increment: 1 } }
            });
        }

        res.json(post);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Failed to create blog post' });
    }
});

// Update blog post (admin only)
router.put('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            excerpt,
            content,
            coverImage,
            author,
            authorAvatar,
            categoryId,
            tags,
            published,
            featured,
            metaTitle,
            metaDescription,
            keywords
        } = req.body;

        const existingPost = await prisma.blogPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        const slug = title ? generateSlug(title) : existingPost.slug;
        const readingTime = content ? calculateReadingTime(content) : existingPost.readingTime;

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                excerpt,
                content,
                coverImage,
                author,
                authorAvatar,
                categoryId,
                tags: tags ? JSON.stringify(tags) : existingPost.tags,
                published,
                featured,
                readingTime,
                metaTitle,
                metaDescription,
                keywords: keywords ? JSON.stringify(keywords) : existingPost.keywords,
                publishedAt: published && !existingPost.published ? new Date() : existingPost.publishedAt
            },
            include: {
                category: true
            }
        });

        // Update category post counts if category changed or published status changed
        if (categoryId && categoryId !== existingPost.categoryId) {
            await prisma.blogCategory.update({
                where: { id: existingPost.categoryId },
                data: { postCount: { decrement: 1 } }
            });
            await prisma.blogCategory.update({
                where: { id: categoryId },
                data: { postCount: { increment: 1 } }
            });
        } else if (published !== existingPost.published) {
            await prisma.blogCategory.update({
                where: { id: existingPost.categoryId },
                data: { postCount: { increment: published ? 1 : -1 } }
            });
        }

        res.json(post);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ error: 'Failed to update blog post' });
    }
});

// Delete blog post (admin only)
router.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const post = await prisma.blogPost.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        await prisma.blogPost.delete({
            where: { id }
        });

        // Update category post count
        if (post.published) {
            await prisma.blogCategory.update({
                where: { id: post.categoryId },
                data: { postCount: { decrement: 1 } }
            });
        }

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

// ============ CATEGORIES ============

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.blogCategory.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create category (admin only)
router.post('/categories', async (req, res) => {
    try {
        const { name, description, color, icon } = req.body;

        const slug = generateSlug(name);

        const category = await prisma.blogCategory.create({
            data: {
                name,
                slug,
                description,
                color,
                icon
            }
        });

        res.json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update category (admin only)
router.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, color, icon } = req.body;

        const slug = name ? generateSlug(name) : undefined;

        const category = await prisma.blogCategory.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                color,
                icon
            }
        });

        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.blogCategory.delete({
            where: { id }
        });

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// ============ IMAGE UPLOAD ============

router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/blog/${req.file.filename}`;
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;
