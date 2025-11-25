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

        // Create notification for status change
        try {
            await prisma.notification.create({
                data: {
                    userId: order.userId,
                    title: 'Sipariş Durumu Güncellendi',
                    message: `Siparişinizin durumu güncellendi: ${status}`,
                    type: 'info',
                    link: '/dashboard/orders'
                }
            });
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
        }
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

        // Create notification for tracking update
        try {
            await prisma.notification.create({
                data: {
                    userId: order.userId,
                    title: 'Siparişiniz Kargoya Verildi',
                    message: `Siparişiniz kargoya verildi. Takip Numarası: ${trackingNumber}`,
                    type: 'success',
                    link: '/dashboard/orders'
                }
            });
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tracking info' });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        await prisma.order.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

export default router;
