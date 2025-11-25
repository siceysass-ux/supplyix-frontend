import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories with subcategories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create a new category
router.post('/', async (req, res) => {
    try {
        const { name, subcategories } = req.body;

        const category = await prisma.category.create({
            data: {
                name,
                productCount: 0,
                subcategories: {
                    create: subcategories || []
                }
            },
            include: {
                subcategories: true
            }
        });

        res.json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    try {
        const { name, subcategories } = req.body;

        // Delete existing subcategories
        await prisma.subCategory.deleteMany({
            where: { categoryId: req.params.id }
        });

        // Update category with new subcategories
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: {
                name,
                subcategories: {
                    create: subcategories || []
                }
            },
            include: {
                subcategories: true
            }
        });

        res.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        await prisma.category.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
