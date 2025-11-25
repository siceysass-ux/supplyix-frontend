import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get unseen referral rewards for a user
 * GET /api/referral/rewards/:userId
 */
router.get('/rewards/:userId', async (req, res) => {
    try {
        const rewards = await prisma.referralReward.findMany({
            where: {
                userId: req.params.userId,
                seen: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(rewards);
    } catch (error) {
        console.error('Get rewards error:', error);
        res.status(500).json({ error: 'Failed to get rewards' });
    }
});

/**
 * Mark rewards as seen
 * POST /api/referral/rewards/:userId/mark-seen
 */
router.post('/rewards/:userId/mark-seen', async (req, res) => {
    try {
        await prisma.referralReward.updateMany({
            where: {
                userId: req.params.userId,
                seen: false
            },
            data: {
                seen: true
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Mark rewards seen error:', error);
        res.status(500).json({ error: 'Failed to mark rewards as seen' });
    }
});

/**
 * Get referral stats for a user
 * GET /api/referral/stats/:userId
 */
router.get('/stats/:userId', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const nextRewardIn = 3 - (user.referralCount % 3);

        res.json({
            referralCode: user.referralCode,
            referralCount: user.referralCount,
            referralRewards: user.referralRewards,
            nextRewardIn: nextRewardIn === 3 ? 3 : nextRewardIn
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

export default router;
