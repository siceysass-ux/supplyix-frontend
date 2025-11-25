import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createBackup } from '../services/backup.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * Generate unique referral code for a user
 */
async function generateUniqueReferralCode(userName: string): Promise<string> {
    const namePrefix = userName
        .replace(/\s+/g, '')
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, 'X');

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const code = `SUPPLYIX-${namePrefix}${randomNum}`;

    const existing = await prisma.user.findFirst({
        where: { referralCode: code }
    });

    if (existing) {
        return generateUniqueReferralCode(userName);
    }

    return code;
}

/**
 * Initialize referral codes for all users without one
 * POST /api/admin/init-referral-codes
 */
router.post('/init-referral-codes', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        let updatedCount = 0;

        for (const user of users) {
            if (user.referralCode && user.referralCode !== '') {
                continue;
            }

            const code = await generateUniqueReferralCode(user.name);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    referralCode: code,
                    referralCount: user.referralCount || 0,
                    referralRewards: user.referralRewards || 0
                }
            });

            updatedCount++;
        }

        res.json({
            success: true,
            message: `${updatedCount} users updated with referral codes`,
            total: users.length
        });
    } catch (error) {
        console.error('Init referral codes error:', error);
        res.status(500).json({ error: 'Failed to initialize referral codes' });
    }
});

/**
 * Create manual backup
 * POST /api/admin/backup
 */
router.post('/backup', async (req, res) => {
    try {
        const backupPath = await createBackup();
        res.json({
            success: true,
            message: 'Backup created successfully',
            path: backupPath
        });
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Failed to create backup' });
    }
});

export default router;
