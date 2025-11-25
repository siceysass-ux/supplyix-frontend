import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get user's favorites
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { product: true }
        });

        const products = favorites.map(fav => ({
            ...fav.product,
            images: JSON.parse(fav.product.images),
            price: JSON.parse(fav.product.price),
            shippingInfo: fav.product.shippingInfo ? JSON.parse(fav.product.shippingInfo) : undefined,
            variations: fav.product.variations ? JSON.parse(fav.product.variations) : [],
            variants: fav.product.variants ? JSON.parse(fav.product.variants) : [],
            tags: fav.product.tags ? JSON.parse(fav.product.tags) : [],
            isFavorite: true // Explicitly set for frontend
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Toggle favorite
router.post('/toggle', async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            res.json({ isFavorite: false });
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    productId
                }
            });
            res.json({ isFavorite: true });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

export default router;
