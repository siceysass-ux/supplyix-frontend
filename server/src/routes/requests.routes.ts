import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all requests (admin only - in production add auth middleware)
router.get('/', async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format for frontend - use displayId if available, otherwise generate it
        const formattedRequests = requests.map(req => ({
            id: req.displayId || `#${req.type === 'Tedarik' ? 'T' : 'D'}${req.id.slice(-4)}`,
            type: req.type,
            userId: req.userId,
            userName: req.user.name,
            userEmail: req.user.email,
            explanation: req.explanation,
            status: req.status,
            result: req.result,
            response: req.response,
            title: req.title,
            productName: req.productName,
            imageUrls: req.imageUrls ? JSON.parse(req.imageUrls) : [],
            referenceLink: req.referenceLink,
            updated: req.updatedAt.toLocaleDateString('tr-TR'),
            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
        }));

        res.json(formattedRequests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Get requests for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const requests = await prisma.request.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format for frontend - use displayId if available, otherwise generate it
        const formattedRequests = requests.map(req => ({
            id: req.displayId || `#${req.type === 'Tedarik' ? 'T' : 'D'}${req.id.slice(-4)}`,
            type: req.type,
            userId: req.userId,
            userName: req.user.name,
            userEmail: req.user.email,
            explanation: req.explanation,
            status: req.status,
            result: req.result,
            response: req.response,
            title: req.title,
            productName: req.productName,
            imageUrls: req.imageUrls ? JSON.parse(req.imageUrls) : [],
            referenceLink: req.referenceLink,
            updated: req.updatedAt.toLocaleDateString('tr-TR'),
            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
        }));

        res.json(formattedRequests);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ error: 'Failed to fetch user requests' });
    }
});

// Create a new request
router.post('/', async (req, res) => {
    try {
        const { type, userId, explanation, title, productName, imageUrls, referenceLink } = req.body;

        // Validate required fields
        if (!type || !userId || !explanation) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (type === 'Danışmanlık' && !title) {
            return res.status(400).json({ error: 'Title is required for Danışmanlık requests' });
        }

        if (type === 'Tedarik' && (!productName || !imageUrls || !referenceLink)) {
            return res.status(400).json({ error: 'Product name, images, and reference link are required for Tedarik requests' });
        }

        const newRequest = await prisma.request.create({
            data: {
                type,
                userId,
                explanation,
                status: 'Bekliyor',
                result: null,
                response: null,
                title: type === 'Danışmanlık' ? title : null,
                productName: type === 'Tedarik' ? productName : null,
                imageUrls: type === 'Tedarik' && imageUrls ? JSON.stringify(imageUrls) : null,
                referenceLink: type === 'Tedarik' ? referenceLink : null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        // Format for frontend
        const formattedRequest = {
            id: `#${newRequest.type === 'Tedarik' ? 'T' : 'D'}${newRequest.id.slice(-4)}`,
            type: newRequest.type,
            userId: newRequest.userId,
            userName: newRequest.user.name,
            userEmail: newRequest.user.email,
            explanation: newRequest.explanation,
            status: newRequest.status,
            result: newRequest.result,
            response: newRequest.response,
            title: newRequest.title,
            productName: newRequest.productName,
            imageUrls: newRequest.imageUrls ? JSON.parse(newRequest.imageUrls) : [],
            referenceLink: newRequest.referenceLink,
            updated: newRequest.updatedAt.toLocaleDateString('tr-TR'),
            createdAt: newRequest.createdAt,
            updatedAt: newRequest.updatedAt,
        };

        res.status(201).json(formattedRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

// Admin responds to a request
router.patch('/:id/respond', async (req, res) => {
    try {
        const { id } = req.params;
        const { response, status, result } = req.body;

        console.log('📝 Respond endpoint called:');
        console.log('  Request ID:', id);
        console.log('  Response:', response);
        console.log('  Status:', status);
        console.log('  Result:', result);

        // Find the request by the formatted ID (need to extract UUID)
        const allRequests = await prisma.request.findMany();
        console.log('  Total requests in DB:', allRequests.length);

        const targetRequest = allRequests.find(r =>
            `#${r.type === 'Tedarik' ? 'T' : 'D'}${r.id.slice(-4)}` === id
        );

        if (!targetRequest) {
            console.log('  ❌ Request not found!');
            return res.status(404).json({ error: 'Request not found' });
        }

        console.log('  ✅ Found request:', targetRequest.id);

        const updatedRequest = await prisma.request.update({
            where: {
                id: targetRequest.id
            },
            data: {
                response,
                status,
                result,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        console.log('  ✅ Request updated successfully');

        // Create notification for the user
        try {
            await prisma.notification.create({
                data: {
                    userId: updatedRequest.userId,
                    title: 'Talebiniz Sonuçlandı',
                    message: `${updatedRequest.type} talebiniz yönetici tarafından yanıtlandı. Sonuç: ${updatedRequest.result || 'Belirtilmedi'}`,
                    type: updatedRequest.result === 'Başarılı' ? 'success' : updatedRequest.result === 'Başarısız' ? 'error' : 'info',
                    link: '/dashboard/requests'
                }
            });
            console.log('  ✅ Notification created');
        } catch (notifError) {
            console.error('  ❌ Failed to create notification:', notifError);
            // Don't fail the request if notification fails
        }

        // Format for frontend
        const formattedRequest = {
            id: `#${updatedRequest.type === 'Tedarik' ? 'T' : 'D'}${updatedRequest.id.slice(-4)}`,
            type: updatedRequest.type,
            userId: updatedRequest.userId,
            userName: updatedRequest.user.name,
            userEmail: updatedRequest.user.email,
            explanation: updatedRequest.explanation,
            status: updatedRequest.status,
            result: updatedRequest.result,
            response: updatedRequest.response,
            title: updatedRequest.title,
            productName: updatedRequest.productName,
            imageUrls: updatedRequest.imageUrls ? JSON.parse(updatedRequest.imageUrls) : [],
            referenceLink: updatedRequest.referenceLink,
            updated: updatedRequest.updatedAt.toLocaleDateString('tr-TR'),
            createdAt: updatedRequest.createdAt,
            updatedAt: updatedRequest.updatedAt,
        };

        res.json(formattedRequest);
    } catch (error) {
        console.error('❌ Error responding to request:', error);
        res.status(500).json({ error: 'Failed to respond to request' });
    }
});

// Get a single request by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the request by the formatted ID
        const allRequests = await prisma.request.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        const targetRequest = allRequests.find(r =>
            `#${r.type === 'Tedarik' ? 'T' : 'D'}${r.id.slice(-4)}` === id
        );

        if (!targetRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Format for frontend
        const formattedRequest = {
            id: `#${targetRequest.type === 'Tedarik' ? 'T' : 'D'}${targetRequest.id.slice(-4)}`,
            type: targetRequest.type,
            userId: targetRequest.userId,
            userName: targetRequest.user.name,
            userEmail: targetRequest.user.email,
            explanation: targetRequest.explanation,
            status: targetRequest.status,
            result: targetRequest.result,
            response: targetRequest.response,
            title: targetRequest.title,
            productName: targetRequest.productName,
            imageUrls: targetRequest.imageUrls ? JSON.parse(targetRequest.imageUrls) : [],
            referenceLink: targetRequest.referenceLink,
            updated: targetRequest.updatedAt.toLocaleDateString('tr-TR'),
            createdAt: targetRequest.createdAt,
            updatedAt: targetRequest.updatedAt,
        };

        res.json(formattedRequest);
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ error: 'Failed to fetch request' });
    }
});

// Delete a request
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by displayId first, then by UUID
        let targetRequest = await prisma.request.findUnique({
            where: { displayId: id }
        });

        if (!targetRequest) {
            // If not found by displayId, try by UUID
            targetRequest = await prisma.request.findUnique({
                where: { id }
            });
        }

        if (!targetRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        await prisma.request.delete({
            where: { id: targetRequest.id }
        });

        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

export default router;
