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
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users', details: error });
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

/**
 * Create new user (admin only)
 * POST /api/users
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, phone, tcKimlik, vergiKimlik, plan, status } = req.body;

        // Generate unique referral code
        const namePrefix = name
            .replace(/\s+/g, '')
            .substring(0, 3)
            .toUpperCase()
            .padEnd(3, 'X');
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const referralCode = `SUPPLYIX-${namePrefix}${randomNum}`;

        // Calculate subscription dates
        const today = new Date();
        const registrationDate = today.toISOString().split('T')[0];
        const subscriptionStartDate = registrationDate;

        // Calculate end date based on plan
        let subscriptionEndDate = registrationDate;
        if (plan === '1 Ay') {
            const endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + 1);
            subscriptionEndDate = endDate.toISOString().split('T')[0];
        } else if (plan === '6 Ay') {
            const endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + 6);
            subscriptionEndDate = endDate.toISOString().split('T')[0];
        } else if (plan === '1 Sene') {
            const endDate = new Date(today);
            endDate.setFullYear(endDate.getFullYear() + 1);
            subscriptionEndDate = endDate.toISOString().split('T')[0];
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role: role || 'member',
                phone: phone || null,
                tcKimlik: tcKimlik || null,
                vergiKimlik: vergiKimlik || null,
                referans: null,
                plan: plan || '1 Ay',
                status: status || 'Aktif',
                registrationDate,
                subscriptionStartDate,
                subscriptionEndDate,
                totalSpent: 0,
                lastLogin: new Date().toISOString(),
                platforms: JSON.stringify([]),
                avatar: null,
                referralCode,
                referredBy: null,
                referralCount: 0,
                referralRewards: 0
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user plan
router.put('/:id/plan', async (req, res) => {
    try {
        const { plan, subscriptionEndDate } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                plan,
                subscriptionEndDate,
                subscriptionStartDate: new Date().toISOString().split('T')[0]
            },
        });
        res.json(user);
    } catch (error) {
        console.error('Error updating user plan:', error);
        res.status(500).json({ error: 'Failed to update user plan' });
    }
});

// Update auto-renew preference
router.put('/:id/auto-renew', async (req, res) => {
    try {
        const { autoRenew } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { autoRenew },
        });
        res.json(user);
    } catch (error) {
        console.error('Error updating auto-renew:', error);
        res.status(500).json({ error: 'Failed to update auto-renew' });
    }
});

export default router;
