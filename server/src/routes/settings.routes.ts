import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all plans
router.get('/plans', async (req, res) => {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

// Update plans
router.put('/plans', async (req, res) => {
    try {
        const { plans } = req.body;
        console.log('Updating plans:', plans);
        // Delete all existing plans and create new ones
        await prisma.plan.deleteMany();
        const createdPlans = await Promise.all(
            plans.map((plan: any, index: number) =>
                prisma.plan.create({
                    data: {
                        name: plan.name,
                        price: plan.price,
                        durationText: plan.durationText || '/ aylık',
                        popular: plan.popular || false,
                        buttonText: plan.buttonText || 'Planı Seç',
                        order: index
                    }
                })
            )
        );
        console.log('Plans updated successfully:', createdPlans);
        res.json(createdPlans);
    } catch (error) {
        console.error('Error updating plans:', error);
        res.status(500).json({ error: 'Failed to update plans' });
    }
});

// Get event popup
router.get('/event-popup', async (req, res) => {
    try {
        const popup = await prisma.eventPopup.findFirst();
        res.json(popup);
    } catch (error) {
        console.error('Error fetching event popup:', error);
        res.status(500).json({ error: 'Failed to fetch event popup' });
    }
});

// Update event popup
router.put('/event-popup', async (req, res) => {
    try {
        const { enabled, title, description, imageUrl, ctaText, ctaLink } = req.body;
        console.log('Updating event popup:', req.body);
        // Delete existing and create new
        await prisma.eventPopup.deleteMany();
        const popup = await prisma.eventPopup.create({
            data: {
                enabled: enabled || false,
                title: title || '',
                description: description || '',
                imageUrl: imageUrl || '',
                ctaText: ctaText || '',
                ctaLink: ctaLink || ''
            }
        });
        console.log('Event popup updated successfully:', popup);
        res.json(popup);
    } catch (error) {
        console.error('Error updating event popup:', error);
        res.status(500).json({ error: 'Failed to update event popup' });
    }
});

// Get influencer codes
router.get('/influencer-codes', async (req, res) => {
    try {
        const codes = await prisma.influencerCode.findMany();
        const parsedCodes = codes.map(code => ({
            ...code,
            validPlans: code.validPlans ? JSON.parse(code.validPlans) : []
        }));
        res.json(parsedCodes);
    } catch (error) {
        console.error('Error fetching influencer codes:', error);
        res.status(500).json({ error: 'Failed to fetch influencer codes' });
    }
});

// Update influencer codes
router.put('/influencer-codes', async (req, res) => {
    try {
        const { codes } = req.body;
        console.log('Updating influencer codes:', codes);
        // Delete all and recreate
        await prisma.influencerCode.deleteMany();
        const createdCodes = await Promise.all(
            codes.map((code: any) =>
                prisma.influencerCode.create({
                    data: {
                        code: code.code.toUpperCase(),
                        discountRate: code.discountRate,
                        affiliateRate: code.affiliateRate,
                        usageCount: code.usageCount || 0,
                        totalEarnings: code.totalEarnings || 0,
                        validPlans: code.validPlans ? JSON.stringify(code.validPlans) : null
                    }
                })
            )
        );
        console.log('Influencer codes updated successfully:', createdCodes);
        res.json(createdCodes);
    } catch (error) {
        console.error('Error updating influencer codes:', error);
        res.status(500).json({ error: 'Failed to update influencer codes' });
    }
});

// Increment code usage
router.post('/influencer-codes/use/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const { amount } = req.body;

        const influencerCode = await prisma.influencerCode.findFirst({
            where: { code: code.toUpperCase() }
        });

        if (!influencerCode) {
            return res.status(404).json({ error: 'Code not found' });
        }

        // Calculate earnings if affiliateRate exists
        const earnings = influencerCode.affiliateRate && amount
            ? (amount * influencerCode.affiliateRate / 100)
            : 0;

        const updated = await prisma.influencerCode.update({
            where: { id: influencerCode.id },
            data: {
                usageCount: influencerCode.usageCount + 1,
                totalEarnings: influencerCode.totalEarnings + earnings
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error incrementing code usage:', error);
        res.status(500).json({ error: 'Failed to increment code usage' });
    }
});

export default router;
