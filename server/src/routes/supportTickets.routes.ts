import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Helper to parse ticket messages
const parseTicket = (ticket: any) => ({
    ...ticket,
    messages: JSON.parse(ticket.messages as string)
});

// Get all support tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await prisma.supportTicket.findMany({
            orderBy: { lastUpdate: 'desc' }
        });
        res.json(tickets.map(parseTicket));
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        res.status(500).json({ error: 'Failed to fetch support tickets' });
    }
});

// Get tickets for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const tickets = await prisma.supportTicket.findMany({
            where: { userId: req.params.userId },
            orderBy: { lastUpdate: 'desc' }
        });
        res.json(tickets.map(parseTicket));
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).json({ error: 'Failed to fetch user tickets' });
    }
});

// Create ticket
router.post('/', async (req, res) => {
    try {
        const { userId, userName, userEmail, subject, messages } = req.body;

        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                userName,
                userEmail,
                subject,
                status: 'Açık',
                isReadByAdmin: false,
                lastUpdate: new Date().toISOString(),
                messages: JSON.stringify(messages)
            }
        });
        res.status(201).json(parseTicket(ticket));
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

// Update ticket
router.put('/:id', async (req, res) => {
    try {
        const { status, isReadByAdmin, isReadByUser, messages } = req.body;
        const data: any = {
            lastUpdate: new Date().toISOString()
        };

        if (status !== undefined) data.status = status;
        if (isReadByAdmin !== undefined) data.isReadByAdmin = isReadByAdmin;
        if (isReadByUser !== undefined) data.isReadByUser = isReadByUser;
        if (messages !== undefined) data.messages = JSON.stringify(messages);

        const ticket = await prisma.supportTicket.update({
            where: { id: req.params.id },
            data
        });
        res.json(parseTicket(ticket));
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
    try {
        const { role } = req.body; // 'admin' or 'user'
        const data: any = {};

        if (role === 'admin') {
            data.isReadByAdmin = true;
        } else if (role === 'user') {
            data.isReadByUser = true;
        }

        const ticket = await prisma.supportTicket.update({
            where: { id: req.params.id },
            data
        });
        res.json(parseTicket(ticket));
    } catch (error) {
        console.error('Error marking ticket as read:', error);
        res.status(500).json({ error: 'Failed to mark ticket as read' });
    }
});

// Delete ticket
router.delete('/:id', async (req, res) => {
    try {
        await prisma.supportTicket.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Support ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

export default router;
