import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { creationDate: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Create order
router.post('/', async (req, res) => {
    try {
        const order = await prisma.order.create({
            data: req.body,
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Update tracking info
router.put('/:id/tracking', async (req, res) => {
    try {
        const { shippingCarrier, trackingNumber } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                shippingCarrier,
                trackingNumber,
                status: 'Kargoda'
            },
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tracking info' });
    }
});

export default router;
