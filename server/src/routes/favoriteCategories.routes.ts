import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all favorite categories for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const categories = await prisma.favoriteCategory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching favorite categories:', error);
        res.status(500).json({ error: 'Failed to fetch favorite categories' });
    }
});

// Create a new favorite category
router.post('/', async (req, res) => {
    try {
        const { userId, name, productIds } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newCategory = await prisma.favoriteCategory.create({
            data: {
                userId,
                name,
                productIds: JSON.stringify(productIds || [])
            }
        });

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating favorite category:', error);
        res.status(500).json({ error: 'Failed to create favorite category' });
    }
});

// Update a favorite category
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, productIds } = req.body;

        const updatedCategory = await prisma.favoriteCategory.update({
            where: { id },
            data: {
                name,
                productIds: JSON.stringify(productIds)
            }
        });

        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating favorite category:', error);
        res.status(500).json({ error: 'Failed to update favorite category' });
    }
});

// Delete a favorite category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.favoriteCategory.delete({
            where: { id }
        });
        res.json({ message: 'Favorite category deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite category:', error);
        res.status(500).json({ error: 'Failed to delete favorite category' });
    }
});

export default router;
