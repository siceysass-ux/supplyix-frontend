import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { registrationDate: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Update subscription end date
router.put('/:id/subscription', async (req, res) => {
    try {
        const { subscriptionEndDate } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { subscriptionEndDate },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subscription' });
    }
});

export default router;
