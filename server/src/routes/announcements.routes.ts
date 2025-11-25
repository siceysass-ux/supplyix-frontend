import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { date: 'desc' }
        });
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Create announcement
router.post('/', async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                type,
                date: new Date().toLocaleDateString('tr-TR')
            }
        });
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
    try {
        await prisma.announcement.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

export default router;
