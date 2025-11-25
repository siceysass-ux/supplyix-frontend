import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all extra fees
router.get('/', async (req, res) => {
    try {
        const fees = await prisma.extraFee.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(fees);
    } catch (error) {
        console.error('Error fetching extra fees:', error);
        res.status(500).json({ error: 'Failed to fetch extra fees' });
    }
});

// Get extra fees for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const fees = await prisma.extraFee.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(fees);
    } catch (error) {
        console.error('Error fetching user extra fees:', error);
        res.status(500).json({ error: 'Failed to fetch user extra fees' });
    }
});

// Create a new extra fee
router.post('/', async (req, res) => {
    try {
        console.log('📝 Creating extra fee with data:', JSON.stringify(req.body, null, 2));
        const { userId, item, description, amount, date, status } = req.body;

        const newFee = await prisma.extraFee.create({
            data: {
                userId,
                item,
                description: description || '',
                amount,
                date,
                status: status || 'Beklemede'
            }
        });

        console.log('✅ Extra fee created:', newFee.id);
        res.status(201).json(newFee);
    } catch (error) {
        console.error('❌ Error creating extra fee:', error);
        res.status(500).json({ error: 'Failed to create extra fee' });
    }
});

// Update an extra fee
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, item, description, amount, date, status } = req.body;

        const updatedFee = await prisma.extraFee.update({
            where: { id },
            data: {
                userId,
                item,
                description,
                amount,
                date,
                status
            }
        });

        res.json(updatedFee);
    } catch (error) {
        console.error('Error updating extra fee:', error);
        res.status(500).json({ error: 'Failed to update extra fee' });
    }
});

// Delete an extra fee
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.extraFee.delete({
            where: { id }
        });
        res.json({ message: 'Extra fee deleted successfully' });
    } catch (error) {
        console.error('Error deleting extra fee:', error);
        res.status(500).json({ error: 'Failed to delete extra fee' });
    }
});

export default router;
